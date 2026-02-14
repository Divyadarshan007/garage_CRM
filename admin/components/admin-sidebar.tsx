'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  FileStack,
  LogOut,
  Layout,
  Car,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Garages', url: '/admin/garages', icon: Car },
  { title: 'Subscription Plans', url: '/admin/subscription-plans', icon: FileStack },
  { title: 'AdminUser', url: '/admin/adminUser', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <aside
      className="flex w-[var(--sidebar-width)] flex-col border-r bg-sidebar text-sidebar-foreground"
      style={{ minHeight: '100vh' }}
    >
      <div className="flex h-[var(--header-height)] items-center border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Layout className="h-5 w-5" />
          <span>Admin Boilerplate</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + '/');
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {admin?.email || 'Admin'}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
