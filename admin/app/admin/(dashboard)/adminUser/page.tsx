'use client';

import { AdminUserTable } from '@/components/admin-user-table';

export default function AdminUserPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Admin Users</h2>
                <p className="text-muted-foreground">Manage multi-admin access and permissions</p>
            </div>
            <AdminUserTable />
        </div>
    );
}
