import { Head, useForm } from '@inertiajs/react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    CheckCircle,
    ShieldAlert,
    Mail,
    User,
    Search,
    ChevronRight,
    ChevronLeft,
    Clock,
    AlertCircle
} from 'lucide-react';

interface Doctor {
    id: string;
    name: string;
    email: string;
}

interface Props {
    pendingDoctors: Doctor[];
}

export default function Approvals({ pendingDoctors }: Props) {
    const { post, processing } = useForm();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmApprove, setConfirmApprove] = useState<Doctor | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const itemsPerPage = 10;

    const safeDoctors = Array.isArray(pendingDoctors) ? pendingDoctors : [];
    const filteredDoctors = safeDoctors.filter((doctor) => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalItems = filteredDoctors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const openConfirm = (doctor: Doctor) => {
        setConfirmApprove(doctor);
        setIsConfirmOpen(true);
    };

    const approve = () => {
        if (!confirmApprove) return;
        post(`/admin/approvals/${confirmApprove.id}/approve`, {
            preserveScroll: true,
            onFinish: () => {
                setIsConfirmOpen(false);
                setConfirmApprove(null);
            },
        });
    };

    // Get initials for docotr avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0,2);
    }

    return (
        <>
            <Head title="الموافقات المعلقة" />
            
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                {/* Start card */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
                                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">الموافقات قيد الإنتظار</p>
                                <p className="text-lg font-bold">{safeDoctors.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-blue-500/10 p-2.5 ring-1 ring-blue-500/20">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">بإنتظار الموافقة منذ</p>
                                <p className="text-lg font-bold">التسجيل</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-emerald-500/10 p-2.5 ring-1 ring-emerald-500/20">
                                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">الحالة</p>
                                <p className="text-lg font-bold">{safeDoctors.length === 0 ? 'تمت الموافقة على جميع الطلبات' : 'بحاجة لمراجعة'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main card */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">الموافقات المعلقة</CardTitle>
                                <CardDescription>
                                    مراجعة واعتماد حسابات الأطباء الجديدة
                                </CardDescription>
                            </div>
                            <div className="rounded-full bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
                                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mt-3">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                type="text"
                                placeholder="إبحث بالاسم أو عنوان البريد..."
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
                                    <TableHead className="text-right font-semibold">الطبيب</TableHead>
                                    <TableHead className="font-semibold hidden sm:table-cell">البريد</TableHead>
                                    <TableHead className="font-semibold">الحالة</TableHead>
                                    <TableHead className="text-center font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3 py-4">
                                                <div className="rounded-full bg-emerald-100 dark:text-emerald-900/30 p-3">
                                                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {searchQuery ? 'لا يوجد أطباء مطابقين لبحثك.' : '.لا توجد مهام جديدة'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {searchQuery
                                                            ? 'جرب تعديل كلمات البحث.'
                                                            : 'لا توجد موافقات معلقة حالياً.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentDoctors.map((doctor) => (
                                        <TableRow key={doctor.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shrink-0">
                                                        {getInitials(doctor.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{doctor.name}</p>
                                                        <p className="text-xs text-muted-foreground sm:hidden">{doctor.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden sm:table-cell">
                                                <span className="flex items-center gap-1.5 text-sm">
                                                    <Mail className="h-3.5 w-3.5" /> {doctor.email}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    قيد الإنتظار
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    onClick={() => openConfirm(doctor)}
                                                    disabled={processing}
                                                    className="h-8 gap-1.5"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    اعتماد
                                                </Button>
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
                                    عرض <span className="font-medium text-foreground">{indexOfFirstItem}</span> إلى{' '}
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

                {/* Confirm Approval Dialog */}
                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="rounded-full bg-emerald-500/10 p-1.5">
                                    <ShieldAlert className="h-5 w-5 text-emerald-600" />
                                </div>
                                تأكيد الاعتماد
                            </DialogTitle>
                            <DialogDescription>
                                سيتم تفعيل حساب الطبيب والسماح له بدخول النظام.
                            </DialogDescription>
                        </DialogHeader>

                        {confirmApprove && (
                            <div className="py-2">
                                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                        {getInitials(confirmApprove.name)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{confirmApprove.name}</p>
                                        <p className="text-xs text-muted-foreground">{confirmApprove.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                                إلغاء
                            </Button>
                            <Button onClick={approve} disabled={processing} className="mr-2 gap-1.5">
                                <CheckCircle className="h-4 w-4" />
                                {processing ? 'جارٍ الاعتماد...' : 'اعتماد الطبيب'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}