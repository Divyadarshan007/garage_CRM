'use client';

import GarageDashboard from '@/components/ui/GarageDashboard';

export default function GarageDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Garage Management</h2>
                <p className="text-muted-foreground">Manage and monitor all connected garage details</p>
            </div>

            <div className="pt-4 border-t">
                <GarageDashboard />
            </div>
        </div>
    );
}
