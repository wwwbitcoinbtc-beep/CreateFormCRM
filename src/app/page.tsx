import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HesaabProLogo } from '@/components/icons';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full bg-card text-card-foreground">
        <CardHeader className="text-center">
          <HesaabProLogo className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl font-headline">ورود به حساب پرو</CardTitle>
          <CardDescription>برای دسترسی به داشبورد خود وارد شوید</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">رمز عبور</Label>
                <Link href="#" className="mr-auto inline-block text-sm underline">
                  رمز عبور خود را فراموش کرده‌اید؟
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href="/dashboard">ورود</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            حساب کاربری ندارید؟{' '}
            <Link href="/signup" className="underline">
              ثبت نام کنید
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
