import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormEvent } from 'react';

interface Clinic {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
};

interface Props {
    clinic: Clinic;
};

export default function ClinicEdit({ clinic }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: clinic.name || '',
        email: clinic.email || '',
        phone: clinic.phone || '',
        address: clinic.address || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/clinics/${clinic.id}`);
    }

    return (
        <>
            <Head title="تعديل بيانات العيادة" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">تعديل بيانات العيادة</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid-gap-2">
                                    <Label htmlFor="name">إسم العيادة</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="أدخل إسم العيادة"
                                        required
                                    />
                                    <InputError message={errors.name}/>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">البريد الإلكتروني الرسمي</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="clinic@example.com"
                                        required
                                    />
                                    <InputError message={errors.email}/>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="Phone">رقم الهاتف</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="+249 111111111"
                                    />
                                    <InputError message={errors.email}/>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">العنوان</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="عنوان مكان العيادة"
                                    />
                                    <InputError message={errors.address}/>
                                </div>

                                <div className="flex -justify-start gap-4 p-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing? 'حفظ...' : 'حفظ التعديلات'}
                                    </Button>

                                    <Link href="/admin/clinics/">
                                        <Button type="button" variant="outline">
                                            إلغاء
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}