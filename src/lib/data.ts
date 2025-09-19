import type { Transaction, NavItem } from './types';
import { LayoutDashboard, ArrowRightLeft, BarChart3, Landmark } from 'lucide-react';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-05-01', description: 'حقوق ماهانه', amount: 5000000, type: 'income', category: 'حقوق' },
  { id: '2', date: '2024-05-01', description: 'اجاره دفتر', amount: 1200000, type: 'expense', category: 'اجاره' },
  { id: '3', date: '2024-05-03', description: 'خرید لوازم اداری', amount: 150000, type: 'expense', category: 'ملزومات' },
  { id: '4', date: '2024-05-05', description: 'پرداخت قبض برق', amount: 75000, type: 'expense', category: 'خدمات رفاهی' },
  { id: '5', date: '2024-05-10', description: 'درآمد پروژه ۱', amount: 2500000, type: 'income', category: 'پروژه' },
  { id: '6', date: '2024-05-12', description: 'ناهار کاری', amount: 45000, type: 'expense', category: 'غذا' },
  { id: '7', date: '2024-05-15', description: 'خرید نرم‌افزار', amount: 300000, type: 'expense', category: 'نرم‌افزار' },
  { id: '8', date: '2024-05-20', description: 'درآمد مشاوره', amount: 1000000, type: 'income', category: 'مشاوره' },
];

export const navItems: NavItem[] = [
    { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/dashboard/transactions', label: 'تراکنش‌ها', icon: ArrowRightLeft },
    { href: '/dashboard/reports', label: 'گزارشات', icon: BarChart3 },
    { href: '/dashboard/tax', label: 'مالیات', icon: Landmark },
];

export const chartData = [
    { month: 'فروردین', income: 4000, expense: 2400 },
    { month: 'اردیبهشت', income: 3000, expense: 1398 },
    { month: 'خرداد', income: 2000, expense: 9800 },
    { month: 'تیر', income: 2780, expense: 3908 },
    { month: 'مرداد', income: 1890, expense: 4800 },
    { month: 'شهریور', income: 2390, expense: 3800 },
];
