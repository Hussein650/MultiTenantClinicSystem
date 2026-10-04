import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Building2, Users, DollarSign, User } from "lucide-react";

interface Props {
    totalClinics?: number,
    totalUsers?: number,
    revenue?: number,
}

export default function adminDashboard({totalClinics, totalUsers, revenue}: Props) {
    return(
        <>
            <Head title="Super Admin Dashboard"/>

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6 overflow-hidden">

                {/* Start Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">عدد العيادات</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" /> 
                        </CardHeader>
                        <CardContent>{ totalClinics ?? '0' }</CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">عدد المستخدمين</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" /> 
                        </CardHeader>
                        <CardContent>{ totalUsers ?? '0' }</CardContent>
                    </Card>
                </div>

                <div className="relative h-full flex-1 overflow-hidden rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10"/>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground">
                        أنشطة النظام و إحصائيات النظام
                    </div>
                </div>
            </div>
        </>
    );
}