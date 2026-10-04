import { Head, usePage, useForm } from '@inertiajs/react';
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Clock, User, UserCog, Check, ClipboardCheck, Search } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';

interface UserType {
    name: string;
};

interface Appointment {
    id: number;
    patient: UserType;
    doctor: UserType;
    appointment_date: string;
    appointment_time: string;
    status: string;
    doctor_notes?: string;
    patient_notes?: string;
};

interface Props {
    appointments: Appointment[];
};

const statusStyles: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    completed: 'default',
    pending: 'secondary',
    cancelled: 'destructive',
    confirmed: 'outline',
}

const statusLables: Record<string, string> = {
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    cancelled: 'ملغى',
    confirmed: 'مؤكد',
}

export default function AppointmentsIndex({ appointments }: Props) {
    const { auth } = usePage().props as any ;
    const userRole = auth?.user?.role;
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const itemsPerPage = 10;

    const { data, setData, post, processing, errors, reset } = useForm({
        doctor_notes: ''
    });

    const confirmForm = useForm<{doctor_notes?: string}>();

    // Filter & Paginate
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    const filteredAppointments = safeAppointments.filter((appt) => {
        const matchesSearch =
            (appt.patient?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (appt.doctor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleConfirm = (appointmentId: number) => {
        confirmForm.post(`/appointments/${appointmentId}/confirm`, {
            preserveScroll: true,
        });
    };

    const openCompletedModal = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setData('doctor_notes', '');
        setIsCompletedModalOpen(true);
    };

    const openViewNotes = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsViewNotesOpen(true);
    };

    const submitComplete = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAppointment) {
            post(`/appointments/${selectedAppointment.id}/complete`, {
                onSuccess: () => {
                    setIsCompletedModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="المواعيد" />

            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">المواعيد</CardTitle>
                                <CardDescription>متابعة وإدارة الجداول الطبية</CardDescription>
                            </div>
                            <div className="rounded-full bg-primary/10 p-2 border border-primary/20">
                                <CalendarDays className="h-5 w-5 text-primary" />
                            </div>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex items-center gap-3 mt-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="ابحث عن مريض أو طبيب..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="flex h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="all">كل الحالات</option>
                                <option value="pending">قيد الانتظار</option>
                                <option value="confirmed">مؤكد</option>
                                <option value="completed">مكتمل</option>
                                <option value="cancelled">ملغى</option>
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted-20">
                                    <TableHead className="font-semibold text-right">المريض</TableHead>
                                    <TableHead className="font-semibold text-right">الطبيب</TableHead>
                                    <TableHead className="font-semibold text-right">التاريخ والوقت</TableHead>
                                    <TableHead className="font-semibold text-right">الحالة</TableHead>
                                    <TableHead className="font-semibold text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Clock className="h-8 w-8 opacity-20" />
                                                <p>{searchQuery || statusFilter !== 'all' ? 'لا توجد مواعيد مطابقة لبحثك.' : 'لا توجد مواعيد مجدولة.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentAppointments.map((appointment) => (
                                        <TableRow key={appointment.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {appointment.patient?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <UserCog className="h-3.5 w-3.5 text-muted-foreground/70" />
                                                    {appointment.doctor?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-foreground font-medium">
                                                        {new Date(appointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs">
                                                        {appointment.appointment_time || new Date(appointment.appointment_date + 'T00:00:00').toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusStyles[appointment.status] ?? 'outline'}>
                                                    {statusLables[appointment.status] || appointment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {userRole === 'doctor' && appointment.status === 'peding' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleConfirm(appointment.id)}
                                                        disabled={confirmForm.processing}
                                                        variant="outline"
                                                        className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                                                    >
                                                        <Check className="mr-1 h-3.5 w-3.5" /> تأكيد
                                                    </Button>
                                                )}
                                                {userRole === 'doctor' && appointment.status === 'confirmed' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openCompletedModal(appointment)}
                                                        variant="outline"
                                                        className="bordar-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                                                    >
                                                        <ClipboardCheck className="mr-1 h-3.5 w-3.5" /> مكتمل
                                                    </Button>
                                                )}
                                                {appointment.status === 'completed' && appointment.doctor_notes && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => openViewNotes(appointment)}
                                                    >
                                                        <Check className="mr-1 h-3.5 w-3.5" /> عرض الملاحظات
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
                                <div className="text-sm text-muted-foreground">
                                    عرض <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> إلى{' '}
                                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, totalItems)}</span> من{' '}
                                    <span className="font-medium text-foreground">{totalItems}</span> النتائج
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        السابق
                                    </Button>

                                    <div className="flex items-center gap-1 text-sm font-medium px-2 text-foreground">
                                        الصفحة <span className="text-foreground">{currentPage}</span> من <span className="text-foreground">{totalPages}</span>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        التالي
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isCompletedModalOpen} onOpenChange={setIsCompletedModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>إتمام الموعد</DialogTitle>
                        <DialogDescription>
                            أدخل ملاحظات الإستشارة الخاصة بالمريض {selectedAppointment?.patient?.name}. سيتم حفظ الملاحظات وتغيير حالة الموعد إلى مكتمل. 
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitComplete} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="doctor_notes" className="text-sm font-medium leading-none">ملاحظات الطبيب</label>
                            <textarea
                                id="doctor_notes"
                                value={data.doctor_notes}
                                onChange={(e) => setData('doctor_notes', e.target.value)}
                                className="flexmin-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring"
                                placeholder="أكتب ملاحظات الإستشارة هنا (عشرة أحرف على الأقل)..."
                                required
                                minLength={10}
                            ></textarea>
                            {errors.doctor_notes && <span className="text-xs text-destructive">{errors.doctor_notes}</span>}
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'حفظ...' : 'إتمام الموعد'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isViewNotesOpen} onOpenChange={setIsViewNotesOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>ملاحظات الإستشارة</DialogTitle>
                        <DialogDescription>
                            ملاحظات الطبيب. {selectedAppointment?.doctor?.name} بتاريخ {selectedAppointment && new Date(selectedAppointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-md bg-muted p-4 text-sm text-foreground whitespace-pre-wrap">
                            {selectedAppointment?.doctor_notes || 'لا توجد ملاحظات.'}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewNotesOpen(false)}>
                            إغلاق
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}