'use client';

import { ArrowUpRight, DollarSign, Users, ShoppingCart, MoreVertical, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTransactions, chartData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip } from 'recharts';
import Image from 'next/image';

export default function DashboardPage() {
    const totalBalance = mockTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    const recentTransactions = mockTransactions.slice(0, 4);

    return (
        <div className="grid gap-6 xl:grid-cols-3">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
                <Card className="bg-card border-none">
                    <CardHeader>
                        <CardTitle>نمای کلی</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>۳ نفر و @yermaldov به این دسترسی دارند.</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="h-[250px] w-full pr-0">
                         <ChartContainer config={{}} className="h-full w-full">
                            <ResponsiveContainer>
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border bg-card p-2 shadow-sm">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    درآمد
                                                                </span>
                                                                <span className="font-bold text-foreground">
                                                                    {payload[0].value?.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                       </div>
                       <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                            <div>
                                <p className="text-3xl font-bold text-green-500">+۱۹.۲۳٪</p>
                                <p className="text-xs text-muted-foreground">آخرین به‌روزرسانی امروز، ۰۸:۴۹ صبح</p>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm">۲۴ ساعت</Button>
                                <Button variant="outline" size="sm">هفته</Button>
                                <Button variant="secondary" size="sm">ماه</Button>
                            </div>
                       </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-none">
                    <CardHeader>
                        <CardTitle>محبوب‌ترین کمپین‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className='border-b-border/50'>
                                        <TableHead>رتبه</TableHead>
                                        <TableHead>نام</TableHead>
                                        <TableHead className="hidden md:table-cell">مدیر</TableHead>
                                        <TableHead className="hidden lg:table-cell">تاریخ</TableHead>
                                        <TableHead className="text-left">عملیات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((transaction, index) => (
                                        <TableRow key={transaction.id} className='border-b-0'>
                                            <TableCell className="font-medium">#{index + 1}</TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                 <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={`/avatars/0${index+1}.png`} alt="Avatar" />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                    <span>کاربر {index + 1}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">{new Date(transaction.date).toLocaleDateString('fa-IR')}</TableCell>
                                            <TableCell className="text-left">
                                                <Button variant="outline" size="sm">پیوستن</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
            <div className="xl:col-span-1 space-y-6">
                <Card className="bg-card border-none">
                    <CardHeader>
                        <CardTitle>موجودی کل</CardTitle>
                        <CardDescription>مجموع تمام مبالغ در کیف پول شما</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold text-foreground" dir="ltr">${totalBalance.toLocaleString()}</div>
                        <div className='relative w-full h-40 rounded-lg overflow-hidden'>
                             <Image src="https://picsum.photos/seed/1/600/400" alt="AI Assistant" fill style={{objectFit: 'cover'}} data-ai-hint="abstract wave" />
                             <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                                <div>
                                    <p className="font-semibold text-white">دستیار هوش مصنوعی</p>
                                    <p className="text-xs text-white/80">در حال به‌روزرسانی موجودی...</p>
                                </div>
                             </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-accent/50 border-accent/50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className='text-base'>تبلیغات</CardTitle>
                            <span className="text-xs text-muted-foreground">بعدی &larr;</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <h3 className="font-bold text-lg">
                            با ۴۰٪ تخفیف به پریمیوم بروید
                        </h3>
                         <p className="text-sm text-muted-foreground">
                           اشتراک خود را ارتقا دهید و از مزایای انحصاری بهره‌مند شوید.
                        </p>
                        <Button className="w-full">شروع کنید</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
