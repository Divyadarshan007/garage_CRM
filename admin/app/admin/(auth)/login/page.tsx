'use client';

import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginPageContent() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);


  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    const redirectTo = searchParams.get('redirect') || '/admin/dashboard';
    router.push(redirectTo);
  };

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
