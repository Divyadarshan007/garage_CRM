'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH = '16rem';

function SidebarProvider({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex min-h-svh w-full', className)}
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH,
          '--header-height': '3rem',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-1 flex-col min-w-0', className)}
      {...props}
    />
  );
}

export { SidebarProvider, SidebarInset };
