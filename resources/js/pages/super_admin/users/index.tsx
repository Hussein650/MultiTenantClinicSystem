import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { spawn } from 'child_process';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    tenant_id: number | null;
    tenant?: { name: string }
}

interface Props {
    users: User[];
}

const roleBadgeStyles: Record<string, string> = {
    super_admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/15',
    clinic_admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15',
    doctor: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/15',
    patient: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 borderyellow-500/20 hover:bg-yellow-500/15',
};

export default function UsersIndex({ users = [] }: Props) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const safeUsers = Array.isArray(users) ? users : [];

    const totalItems = safeUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentPageUsers = safeUsers.slice(indexOfFirstItem, indexOfLastItem);

    const toggleStatus = (id: number) => {
        router.patch(`/admin/users/${id}/toggle`, {}, {
            preserveScroll: true
        });
    }

    return (
        <>
            <Head title="إدارة المستخدمين"/>

            <div className="flex flex-1 flex-col gap-4 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>قائمة المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right py-6 pr-6">الإسم</TableHead>
                                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                    <TableHead className="text-right">المستشفى / العيادة</TableHead>
                                    <TableHead className="text-right">الدور</TableHead>
                                    <TableHead className="text-right">الحالة</TableHead>
                                    <TableHead className="text-left pl-6">الوصول</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentPageUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentPageUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium pr-6">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            
                                            <TableCell>
                                                <span className="text-sm font-medium text-foreground">
                                                    {user.tenant?.name || <span className="text-muted-foreground italic">System / N/A</span>}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize font-medium ${roleBadgeStyles[user.role]?? 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />

                                                    <span className={`text-sm ${user.is_active ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-left pl-6">
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(user.id)}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-outline-none focus-ring-2 focus-ring-ring focus:ring-offset-2 ${user.is_active ? 'bg-primary' : 'bg-input'}`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${user.is_active? 'translate-x-0' : '-translate-x-5'}`}/>
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination navigation footer controls area */}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to {" "}
                                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, totalItems)}</span> of {" "}
                                    <span className="font-medium text-foreground">{totalItems}</span> results
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1 text-sm font-medium px-2 text-muted-foreground">
                                        Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}