import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HesaabProLogo } from '@/components/icons';

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full bg-card text-card-foreground">
        <CardHeader className="text-center">
          <HesaabProLogo className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl font-headline">ایجاد حساب کاربری</CardTitle>
          <CardDescription>برای شروع، اطلاعات خود را وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">نام کامل</Label>
              <Input id="full-name" placeholder="نام شما" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" type="password" required />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href="/dashboard">ایجاد حساب</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <Link href="/" className="underline">
              وارد شوید
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
