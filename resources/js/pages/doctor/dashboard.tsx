import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, ArrowLeft, ClipboardList, Stethoscope } from "lucide-react";

interface Props {
    todayAppointments?: number;
    totalPatients?: number;
    upcomingAppointments?: number;
}

export default function DoctorDashboard({ todayAppointments = 0, totalPatients = 0, upcomingAppointments = 0 }: Props) {
    return (
        <>
            <Head title="لوحة تحكم الطبيب" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">

                {/* Welcome Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">مرحباً بعودتك يا طبيب</h2>
                    <p className="text-sm text-muted-foreground">إليك نظرة عامة على نشاطك اليوم.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">مواعيد اليوم</CardTitle>
                            <div className="rounded-full bg-blue-500/10 p-1.5 border border-blue-500/20">
                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{todayAppointments}</div>
                            {upcomingAppointments > 0 &&  (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {upcomingAppointments} قادم
                                </p>
                            )}
                            <Link href="/appointments" className="group mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:opacity-80">
                                عرض الجدول الكامل  <ArrowLeft className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">مرضاك</CardTitle>
                            <div className="rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/20">
                                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPatients}</div>
                            <Link href="/patients" className="group mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:opacity-80">
                                عرض المرضى <ArrowLeft className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">الاستشارات المعلقة</CardTitle>
                            <div className="rounded-full bg-amber-500/10 p-1.5 border border-amber-500/20">
                                <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground mt-1">بانتظار مراجعتك</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Schedule */}
                <Card>
                    <CardHeader className="pb-3x">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">جدول اليوم</CardTitle>
                                <CardDescription>مواعيد و استشارات اليوم.</CardDescription>
                            </div>
                            <Link href="/appointments">
                                <Button variant="outline" size="sm">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    عرض الكل
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {todayAppointments === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="rounded-full bg-muted p-3 border border-border">
                                    <Clock className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-center-space-y-1">
                                    <h3 className="text-sm font-semibold text-foreground">لا توجد مواعيد اليوم</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        ستظهر مواعيدك القادمة و استشارات المرضى هنا بعد حجزها.
                                    </p>
                                </div>
                                <Link href="/appointments">
                                    <Button variant="outline" size="sm">
                                        <Stethoscope className="mr-2 h-4 w-4" />
                                        تحقق من المواعيد
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">قائمة المواعيد ستكون متاحة قريباً.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}