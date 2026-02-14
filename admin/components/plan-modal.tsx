'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { garageAPI } from '@/lib/api-client';

interface SubscriptionPlan {
    _id?: string;
    name: string;
    durationDays: number;
    price: number;
    isActive: boolean;
}

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan?: SubscriptionPlan | null;
}

export function PlanModal({ isOpen, onClose, onSuccess, plan }: PlanModalProps) {
    const [formData, setFormData] = useState<SubscriptionPlan>({
        name: '',
        durationDays: 0,
        price: 0,
        isActive: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                durationDays: plan.durationDays,
                price: plan.price,
                isActive: plan.isActive,
            });
        } else {
            setFormData({
                name: '',
                durationDays: 0,
                price: 0,
                isActive: true,
            });
        }
    }, [plan, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (plan?._id) {
                await garageAPI.updateSubscriptionPlan(plan._id, formData);
            } else {
                await garageAPI.createSubscriptionPlan(formData);
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to save plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{plan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Pro Monthly"
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="duration">Duration (Days)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={formData.durationDays.toString()}
                            onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })}
                            placeholder="30"
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price.toString()}
                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                            placeholder="999"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            id="isActive"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
