'use client';

import { useAuth } from '@/lib/auth-context';

export function AdminHeader() {
  const { admin } = useAuth();

  return (
    <header
      className="flex h-[var(--header-height)] shrink-0 items-center border-b px-4 lg:px-6"
      style={{ height: 'var(--header-height)' }}
    >
      <h1 className="text-base font-medium">Admin Panel</h1>
      <div className="ml-auto">
        {admin && (
          <span className="text-sm text-muted-foreground">{admin.email}</span>
        )}
      </div>
    </header>
  );
}
