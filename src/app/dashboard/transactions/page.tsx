'use client';

import * as React from 'react';
import { PlusCircle, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { TransactionForm } from '@/components/dashboard/transaction-form';

export default function TransactionsPage() {
    const [transactions, setTransactions] = React.useState<Transaction[]>(mockTransactions);
    const [open, setOpen] = React.useState(false);

    const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [{ ...newTransaction, id: (prev.length + 1).toString() }, ...prev]);
        setOpen(false);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>تراکنش‌ها</CardTitle>
                        <CardDescription>مدیریت درآمدها و هزینه‌های شما</CardDescription>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">فیلتر</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>فیلتر بر اساس نوع</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value="all">
                                    <DropdownMenuRadioItem value="all">همه</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="income">درآمد</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="expense">هزینه</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">تراکنش جدید</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>ایجاد تراکنش جدید</DialogTitle>
                                </DialogHeader>
                                <TransactionForm onSubmit={handleAddTransaction} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>توضیحات</TableHead>
                                <TableHead className="hidden sm:table-cell">دسته‌بندی</TableHead>
                                <TableHead className="hidden md:table-cell">تاریخ</TableHead>
                                <TableHead>نوع</TableHead>
                                <TableHead className="text-left">مبلغ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.description}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{transaction.category}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(transaction.date).toLocaleDateString('fa-IR')}</TableCell>
                                    <TableCell>
                                        <Badge variant={transaction.type === 'income' ? 'secondary' : 'destructive'}>
                                            {transaction.type === 'income' ? 'درآمد' : 'هزینه'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-left" dir="ltr">{transaction.amount.toLocaleString()} تومان</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
