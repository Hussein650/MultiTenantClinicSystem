import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { User, UserCircle, AlertCircle, CalendarDays} from 'lucide-react';

interface Props {
    totalDoctors?: number;
    totalPatients?: number;
    pendingDoctors?: number;
}

export default function ClinicDashboard({ totalDoctors = 0, totalPatients = 0, pendingDoctors = 0}: Props) {
    return (
        <>
            <Head title="لوحة التحكم"/>

            <div className="flex flex-1 flex-col p-4 lg:p-6 h-full overflow-hidden">

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">عدد الأطباء</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{totalDoctors}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">عدد المرضى</CardTitle>
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{totalPatients}</div>
                        </CardContent>
                    </Card>

                    <Card className={pendingDoctors > 0 ? 'border-amber-500/50 bg-amber-500/5' : ''}>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">الموافقات المعلقة</CardTitle>
                            <AlertCircle className={`h-4 w-4 ${pendingDoctors > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{pendingDoctors}</div>
                            {pendingDoctors > 0 && (
                                <Link href="/admin/approvals" className="text-xs text-amber-600 dark:text-amber-900 hover:underline font-medium">
                                     المعلقة عرض الطلبات
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main content area */}
                <div className="relative min-h-[400px] mt-7 flex-1 overflow-hidden rounded-xl border border-dashed bg-muted/30">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/5" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="rounded-full bg-background p-3 shadow-sm border border-border">
                            <CalendarDays className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-sm font-semibold text-foreground">ملخص المواعيد</h3>
                            <p className="text-sm text-muted-foreground">بيانات التحليلات والجدولة ستظهر هنا</p>
                        </div>

                        <Link href="/appointments">
                            <Button variant="outline" size="sm">
                                عرض التقويم الكامل
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
}