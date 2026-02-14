'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useState, useCallback } from 'react';
import { garageAPI } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PlanModal } from './plan-modal';

interface SubscriptionPlan {
    _id: string;
    name: string;
    durationDays: number;
    price: number;
    isActive: boolean;
    usageCount?: number;
    createdAt: string;
}

export function SubscriptionPlanTable() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await garageAPI.getSubscriptionPlans();
            setPlans(response.data || []);
        } catch (err: any) {
            console.error('Error fetching plans:', err);
            setError(err.message || 'Failed to fetch subscription plans');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await garageAPI.deleteSubscriptionPlan(id);
            fetchPlans();
        } catch (err: any) {
            alert(err.message || 'Failed to delete plan');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Subscription Plans</h2>
                <Button onClick={() => {
                    setSelectedPlan(null);
                    setIsModalOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Plan
                </Button>
            </div>
            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Plan Name</TableHead>
                            <TableHead>Duration (Days)</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Active Garages</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No subscription plans found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => (
                                <TableRow key={plan._id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>{plan.durationDays} Days</TableCell>
                                    <TableCell>₹{plan.price}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                                            {plan.usageCount || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setSelectedPlan(plan);
                                                setIsModalOpen(true);
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(plan._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPlans}
                plan={selectedPlan}
            />
        </div>
    );
}
