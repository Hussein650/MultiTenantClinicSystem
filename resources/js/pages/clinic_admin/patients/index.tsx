import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Phone, Calendar, Search, ChevronRight, ChevronLeft } from 'lucide-react';

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
}

interface Props {
    patients: Patient[];
}

export default function patientsIndex({ patients }: Props) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    const safePatients = Array.isArray(patients) ? patients : [];
    const filteredPatients = safePatients.filter((patient) => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.phone || '').includes(searchQuery)
    );
    const totalItems = filteredPatients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="دليل المرضى" />

            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">دليل المرضى</CardTitle>
                                <CardDescription>قائمة المرضى المسجلين في العيادة.</CardDescription>
                            </div>
                            <div className="rounded-full bg-emerald-500/10 p-2 border border-emerald-500/20">
                                <UserCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mt-3">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="إبحث بالاسم, عنوان البريد أو رقم الهاتف"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pr-9 max-w-sm"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20">
                                    <TableHead className="text-right font-semibold">الاسم</TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5" /> البريد
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5" /> رقم الهاتف
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5" /> العمر
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Search className="h-8 w-8 opacity-20" />
                                                <p>{searchQuery ? 'لا يوجد مرضى مطابقين لبحثك.' : 'لا يوجد مرضى.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentPatients.map((patient) => (
                                        <TableRow key={patient.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="text-right font-medium py-4">
                                                {patient.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {patient.email}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {patient.phone || ''}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {patient.age ? `${patient.age} سنة` : ''}
                                                </Badge>
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
                                        السابق <ChevronLeft className="h-4 w-4 mr-1" />
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
                                        التالي <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
