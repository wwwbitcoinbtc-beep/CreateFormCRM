'use client';

import { ArrowUpRight, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTransactions, chartData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip } from 'recharts';

export default function DashboardPage() {
    const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const recentTransactions = mockTransactions.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">مجموع درآمد</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" dir="ltr">{totalIncome.toLocaleString()} تومان</div>
                        <p className="text-xs text-muted-foreground">%۲۰.۱+ از ماه گذشته</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">اشتراک‌ها</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+۲۳۵۰</div>
                        <p className="text-xs text-muted-foreground">%۱۸۰.۱+ از ماه گذشته</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">فروش</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+۱۲,۲۳۴</div>
                        <p className="text-xs text-muted-foreground">%۱۹+ از ماه گذشته</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">فعال در حال حاضر</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+۵۷۳</div>
                        <p className="text-xs text-muted-foreground">۲۰۱+ از ساعت گذشته</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>مرور کلی</CardTitle>
                    </CardHeader>
                    <CardContent className="pr-0">
                        <ChartContainer config={{}} className="h-[350px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
                                    <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>فروش‌های اخیر</CardTitle>
                        <CardDescription>شما در این ماه ۲۶۵ فروش داشته‌اید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                             {recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                        <AvatarFallback>{transaction.description.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="mr-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{transaction.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                             {transaction.category}
                                        </p>
                                    </div>
                                    <div className="mr-auto font-medium text-left" dir="ltr">+{transaction.amount.toLocaleString()}</div>
                                </div>
                             ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
