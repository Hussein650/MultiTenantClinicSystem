import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Clinic {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    clinics: Clinic[];
}

export default function ClinicsIndex({ clinics }: Props) {
    return (
        <>
            <Head title="إدارة العيادات" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-2xl font-bold">إدارة العيادات</CardTitle>
                        <Link href="/admin/clinics/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                إضافة عيادة جديدة
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">الإسم</TableHead>
                                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                    <TableHead className="text-right">الهاتف</TableHead>
                                    <TableHead className="text-left">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {clinics.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreforund">
                                            لا توجد عيادات
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clinics.map((clinic) => (
                                        <TableRow key={clinic.id}>
                                            <TableCell className="font-medium">{ clinic.name }</TableCell>
                                            <TableCell>{ clinic.email }</TableCell>
                                            <TableCell>{ clinic.phone || 'N/A'}</TableCell>
                                            <TableCell className="text-left">
                                                <Link href={`/admin/clinics/${clinic.id}/edit`}>
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}