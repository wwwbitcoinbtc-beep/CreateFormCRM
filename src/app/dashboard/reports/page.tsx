import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">گزارشات مالی</h1>

            <Card>
                <CardHeader>
                    <CardTitle>صورت سود و زیان</CardTitle>
                    <CardDescription>خلاصه‌ای از درآمدها، هزینه‌ها و سود در یک دوره زمانی.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>عنوان</TableHead>
                                <TableHead className="text-left">مبلغ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>درآمد کل</TableCell>
                                <TableCell className="text-left" dir="ltr">15,000 تومان</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>هزینه‌های عملیاتی</TableCell>
                                <TableCell className="text-left" dir="ltr">(5,000 تومان)</TableCell>
                            </TableRow>
                            <TableRow className="font-bold">
                                <TableCell>سود خالص</TableCell>
                                <TableCell className="text-left" dir="ltr">10,000 تومان</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>ترازنامه</CardTitle>
                    <CardDescription>تصویری از وضعیت مالی شرکت در یک نقطه زمانی خاص.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">محتوای ترازنامه در اینجا نمایش داده می‌شود...</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>صورت جریان وجوه نقد</CardTitle>
                    <CardDescription>نشان‌دهنده نحوه ورود و خروج پول از کسب‌وکار شما.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">محتوای صورت جریان وجوه نقد در اینجا نمایش داده می‌شود...</p>
                </CardContent>
            </Card>
        </div>
    );
}
