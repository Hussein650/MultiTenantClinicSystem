import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { email } from '@/routes/password';

export default function ClinicCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/clinics');
    }

    return (
        <>
            <Head title="إنشاء عيادة"/>
            <div className="flex flex-1 gap-4 p-4">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">إنشاء عيادة جديدة</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" >إسم العيادة</Label>
                                    <Input 
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="أدخل إسم العيادة"
                                        required
                                    />
                                    <InputError message={errors.name} />
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
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="+249 111111111"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">العنوان</Label>
                                    <Input 
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="عنوان مكان العيادة"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="flex justify-start gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'إنشاء...' : 'إنشاء عيادة'}
                                    </Button>
                                    <Link href="/admin/clinics">
                                        <Button type="button" variant="outline">إلغاء</Button>
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