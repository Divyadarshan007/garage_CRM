'use client';

import { useEffect, useState } from 'react';
import { garageAPI } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, Users, LayoutDashboard, Crown } from 'lucide-react';

interface Stats {
  totalGarages: number;
  activeSubscriptions: number;
  totalActivePlans: number;
  totalCustomers: number;
  totalVehicles: number;
  totalJobCards: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await garageAPI.getOverviewStats();
        console.log(res);
        setStats({
          totalGarages: res.totalGarages ?? 0,
          activeSubscriptions: res.activeSubscriptions ?? 0,
          totalActivePlans: res.totalActivePlans ?? 0,
          totalCustomers: res.totalCustomers ?? 0,
          totalVehicles: res.totalVehicles ?? 0,
          totalJobCards: res.totalJobCards ?? 0,
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
        setStats({
          totalGarages: 0,
          activeSubscriptions: 0,
          totalActivePlans: 0,
          totalCustomers: 0,
          totalVehicles: 0,
          totalJobCards: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Garages',
      value: stats?.totalGarages ?? 0,
      desc: 'All registered garages',
      icon: Users,
    },
    {
      title: 'Active Subscriptions',
      value: stats?.totalActivePlans ?? 0,
      desc: `plans currently active`,
      icon: Crown,
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      desc: 'All registered customers',
      icon: FileText,
    },
    {
      title: 'Total Vehicles',
      value: stats?.totalVehicles ?? 0,
      desc: 'All registered vehicles',
      icon: LayoutDashboard,
    },
    {
      title: 'Total JobCards',
      value: stats?.totalJobCards ?? 0,
      desc: 'All registered jobcards',
      icon: LayoutDashboard,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">Overview of your CMS content</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          cards.map((c) => (
            <Card key={c.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                <CardDescription className="mt-2">—</CardDescription>
              </CardContent>
            </Card>
          ))
        ) : (
          cards.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{c.value}</div>
                  <CardDescription>{c.desc}</CardDescription>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
