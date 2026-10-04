import { Head, router } from "@inertiajs/react";
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, Sunset } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Clock,
    Plus,
    Trash2,
    Save,
    CalendarDays,
    Sun,
    Sunrise,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// Types

interface Slot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface Availability {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface Props {
    availabilities: Availability[];
}

// Constants

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const DAY_COLORS: Record<number, string> = {
    0: 'from-red-500/20 to-orange-500/10',
    1: 'from-blue-500/20 to-cyan-500/10',
    2: 'from-emerald-500/20 to-green-500/10',
    3: 'from-violet-500/20 to-purple-500/10',
    4: 'from-amber-500/20 to-yellow-500/10',
    5: 'from-rose-500/20 to-pink-500/10',
    6: 'from-red-500/20 to-orange-500/10',
};

const DAY_ACCENT: Record<number, string> = {
    0: 'border-red-300 dark:border-red-700',
    1: 'border-blue-300 dark:border-blue-700',
    2: 'border-emerald-300 dark:border-emerald-700',
    3: 'border-violet-300 dark:border-violet-700',
    4: 'border-amber-300 dark:border-amber-700',
    5: 'border-rose-300 dark:border-rose-700',
    6: 'border-red-300 dark:border-red-700',
};

type Preset = 'morning' | 'afternoon' | 'fullday';

const PRESETS: { key: Preset; label: string; icon: typeof Sun; start: string; end: string; }[] = [
    { key: 'morning', label: 'الصباح', icon: Sunrise, start: '09:00', end: '12:00' },
    { key: 'afternoon', label: 'بعد الظهر', icon: Sun, start: '13:00', end: '17:00' },
    { key: 'fullday', label: 'يوم كامل', icon: Sunset, start: '09:00', end: '17:00' },
];

// Helpers

function formatHour(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h === 0 ? 12 : h >  12 ? h - 12 : h;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function diffMinutes(start: string, end: string): number {
    return toMinutes(end) - toMinutes(start);
}

// Component

export default function DoctorAvailability({ availabilities }: Props) {
    const existingSlots: Slot[] = Array.isArray(availabilities)
        ? availabilities.map((a) => ({
            day_of_week: a.day_of_week,
            start_time: a.start_time,
            end_time: a.end_time,
            is_available: a.is_available,
        }))
        : [];
    
    const defaultSlots: Slot[] =
        existingSlots.length > 0
            ? existingSlots
            : (() => {
                const defaults: Slot[] = [];
                for(let d =  1; d <= 5; d++) {
                    defaults.push({day_of_week: d, start_time: '9:00', end_time: '12:00', is_available: true});
                    defaults.push({day_of_week: d, start_time: '13:00', end_time: '17:00', is_available: true});
                }
                return defaults;
            })();

    const [slots, setSlots] = useState<Slot[]>(defaultSlots);
    const [saving, setSaving] = useState(false);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);

    // Derived State

    const stats = useMemo(() => {
        const activeSlots = slots.filter((s) => s.is_available);
        const activeDays = new Set(activeSlots.map((s) => s.day_of_week));
        const totalMinutes = activeSlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
        return { activeSlotsCount: activeSlots.length, activeDaysCount: activeDays.size, totalHours};
    }, [slots]);

    const isDayActive = useCallback(
        (day: number) => slots.some((s) => s.day_of_week === day && s.is_available),
        [slots],
    );

    // Actions

    const addSlot = useCallback(
        (day: number, preset?: Preset) => {
            if (preset) {
                const p = PRESETS.find((pr) => pr.key === preset);

                const exists = slots.some(
                    (s) => s.day_of_week === day && s.start_time === p.start && s.end_time === p.end,
                );
                
                if (exists) return;

                setSlots((prev) => [
                    ...prev,
                    { day_of_week: day, start_time: p.start, end_time: p.end, is_available: true },
                ]);
            } else {
                const day_slots = slots.filter((s) => s.day_of_week === day);
                let startHour = day_slots.length > 0 ? parseInt(day_slots[day_slots.length - 1].end_time.split(':')[0]) : 9;
                setSlots((prev) => [
                    ...prev,
                    {
                        day_of_week: day,
                        start_time: `${String(startHour).padStart(2, '0')}:00`,
                        end_time: `${String(startHour + 1).padStart(2, '0')}:00`,
                        is_available: true,
                    },
                ])
            }
        },
        [slots],
    );

    const removeSlot = useCallback((index: number) => {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateSlot = useCallback((index: number, field: keyof Slot, value: string | number | boolean) => {
        setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    }, []);

    const toggleDayActive = useCallback(
        (day: number) => {
            const currentlyActive = isDayActive(day);
            setSlots((prev) => {
                const mapped = prev.map((s) => (s.day_of_week === day ? { ...s, is_available: !currentlyActive } : s));

                if(!prev.some((s) => s.day_of_week === day)) {
                    mapped.push(
                        { day_of_week: day, start_time: '09:00', end_time: '12:00', is_available: true },
                        { day_of_week: day, start_time: '13:00', end_time: '17:00', is_available: true }
                    );
                }
                return mapped;
            });
        },
        [isDayActive],
    );

    const handleSave = useCallback(() => {
        setSaving(true);
        router.post('/doctor/availability', { slots: slots as any }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }, [slots]);

    const toggleExpand = (day: number) => {
        setExpandedDay((prev) => (prev === day ? null : day));
    };

    // Render

    return (
        <>
            <Head title="جدولي" />

            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br form-primary/20 to-primary/5 p-2.5 shadow-sm ring-1 ring-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">الجدول الأسبوعي</h1>
                            <p className="text-sm text-muted-foreground">حدد ساعات الاستشارة المتاحة</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-sm">
                        <Save className="h-4 w-4" />
                        {saving ? 'حفظ...' : 'حفظ الجدول'}
                    </Button>
                </div>

                {/* Stats Summary */}
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                                    <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">أيام العمل</p>
                                    <p className="text-lg font-bold">
                                        {stats.activeDaysCount}
                                        <span className="text-sm font-normal text-muted-foreground"> / 7</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-emerald-500/10 p-2 ring-1 ring-emerald-500/20">
                                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">ساعات العمل في الأسبوع</p>
                                    <p className="text-lg font-bold">
                                        {stats.totalHours}
                                        <span className="text-sm font-normal text-muted-foreground"> ساعة</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-amber-500/10 p-2 ring-1 ring-amber-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">المواعيد المتاحة</p>
                                    <p className="text-lg font-bold">
                                        {stats.activeSlotsCount}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {' '}مواعيد
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Overview Bar */}
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground mr-1 shrink-0">الأسبوع</span>
                            {DAY_NAMES.map((label, i) => {
                                const active = isDayActive(i);
                                const isWeekend = i === 0 || i === 6;
                                const daySlots = slots.filter((s) => s.day_of_week === i && s.is_available);
                                const totalMinutes = daySlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
                                const hours = Math.round((totalMinutes / 60) * 10) / 10;

                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 h-8 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                                            active
                                                ? isWeekend
                                                    ? 'bg-amber-100 text-amber-700 dark:text-amber-300'
                                                    : 'bg-primary/15 text-primary dark:bg-primary/25'
                                                : 'bg-muted text-muted-foreground/50'
                                        }`}
                                        title={`${DAY_NAMES[i]}: ${active ? hours + 'ساعة عمل' : 'غير نشط'}`}
                                    >
                                        {label}
                                    </div>
                                );
                            })}
                        </div>

                        {stats.activeSlotsCount === 0 && (
                            <div className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                <XCircle className="h-4 w-4 shrink-0" />
                                <span>لم تحدد مواعيد متاحة, لايمكن للمرضى الحجز</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Day Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {DAY_NAMES.map((dayName, dayIndex) => {
                        const isActive = isDayActive(dayIndex);
                        const isWeekend = dayIndex === 0 || dayIndex === 1;
                        const daySlots = slots.filter((s) => s.day_of_week === dayIndex);
                        const activeDaySlots = daySlots.filter((s) => s.is_available);
                        const activeMinutes = activeDaySlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
                        const activeHours = Math.round((activeMinutes / 60) * 10) / 10;
                        const isExpanded = expandedDay === dayIndex;

                        return (
                            <Card
                                key={dayIndex}
                                className={`group relative overflow-hidden border transition-all duration-300 ${DAY_ACCENT[dayIndex]} ${
                                    isActive
                                        ? 'shadow-sm hover:shadow-md'
                                        : 'opacity-60 hover:opacity-80'
                                }`}
                            >
                                {/* Gradient Header Accent */}
                                <div className={`absolute inset-x-0 top-0 h-1  bg-gradient-to-r ${DAY_COLORS[dayIndex]} ${isActive ? '' : 'opacity-30'}`} />

                                {/* Day Header  */}
                                <div
                                    className={`flex items-center justify-between px-4 pt-4 pb-3 cursor-pointer ${isActive ? '' : 'opacity-70'}`}
                                    onClick={() => toggleExpand(dayIndex)}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                                                isWeekend
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                    : isActive
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {dayName}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold leading-tight">{dayName}</p>
                                            {isActive && (
                                                <p className="text-[11px] text-muted-foreground">
                                                    {activeHours > 0 ? `${activeHours} ساعات` : 'لا توجد ساعات عمل'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Day Toggle */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDayActive(dayIndex);
                                            }}
                                            role="switch"
                                            aria-checked={isActive}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-transparent transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary shadow-sm'
                                                    : 'bg-input hover:bg-muted-foreground/30'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-md transition-all duration-200 ${
                                                    isActive ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>

                                        {/* Expand/Collapse */}
                                        <div className="text-muted-foreground/50">
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Preset (Quick Add) */}
                                {isActive && isExpanded && (
                                    <div className="px-4 pb-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {PRESETS.map((preset) => {
                                                const hasPreset = daySlots.some(
                                                    (s) => s.start_time === preset.start && s.end_time === preset.end,
                                                );
                                                const PresetIcon = preset.icon;
                                                return (
                                                    <button
                                                        key={preset.key}
                                                        type="button"
                                                        disabled={hasPreset}
                                                        onClick={() => addSlot(dayIndex, preset.key)}
                                                        className={`inline-flex items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-all ${
                                                            hasPreset
                                                                ? 'bg-primary/10 text-primary/50 cursor-not-allowed'
                                                                : 'bg-primary/5 text-primary hover:bg-primary/10 hover:shadow-sm active:scale-95'
                                                        }`}
                                                    >
                                                        <PresetIcon className="h-3 w-3" />
                                                        {preset.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}