'use client';

import { useState, useEffect } from 'react';
import { garageAPI } from '@/lib/api-client';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays, Crown, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SubscriptionModalProps {
    open: boolean;
    onClose: () => void;
    garageId: string;
    garageName: string;
    currentPlan?: string;
    onSuccess: () => void;
}

interface SubscriptionPlan {
    _id: string;
    name: string;
    durationDays: number;
    price: number;
    isActive: boolean;
}

export default function SubscriptionModal({
    open,
    onClose,
    garageId,
    garageName,
    currentPlan,
    onSuccess,
}: SubscriptionModalProps) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [startDate, setStartDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await garageAPI.getSubscriptionPlans();
                const activePlans = response.data.filter((p: SubscriptionPlan) => p.isActive);
                setPlans(activePlans);
                if (activePlans.length > 0) {
                    setSelectedPlanId(activePlans[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch plans', error);
                toast.error('Failed to load subscription plans');
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchPlans();
        }
    }, [open]);

    const getSelectedPlan = () => plans.find(p => p._id === selectedPlanId);

    const getExpiryDate = () => {
        const plan = getSelectedPlan();
        if (!plan || plan.durationDays === 0) return null;
        const expiry = new Date(startDate);
        expiry.setDate(expiry.getDate() + plan.durationDays);
        return expiry;
    };

    const handleSave = async () => {
        if (!selectedPlanId) return;
        setSaving(true);
        try {
            await garageAPI.createSubscription(garageId, {
                planId: selectedPlanId,
                startDate: startDate.toISOString()
            } as any);
            toast.success(`Subscription updated for ${garageName}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to save subscription', error);
            toast.error(error?.response?.data?.message || 'Failed to update subscription');
        } finally {
            setSaving(false);
        }
    };

    const expiryDate = getExpiryDate();

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Manage Subscription
                    </DialogTitle>
                    <DialogDescription>
                        Choose a subscription plan for <span className="font-semibold text-foreground">{garageName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Plan Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Select Plan</Label>
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {plans.map((plan) => (
                                    <button
                                        key={plan._id}
                                        onClick={() => setSelectedPlanId(plan._id)}
                                        className={`relative flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all text-sm font-medium cursor-pointer
                                            ${selectedPlanId === plan._id
                                                ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]'
                                                : 'border-muted hover:border-muted-foreground/30 hover:shadow-sm'
                                            } bg-card`}
                                    >
                                        <span className="font-bold text-base">{plan.name}</span>
                                        <span className="text-xs opacity-70">
                                            {plan.durationDays === 0 ? 'No expiry' : `${plan.durationDays} days access`}
                                        </span>
                                        <span className="text-xs font-semibold">₹{plan.price}</span>
                                        {selectedPlanId === plan._id && (
                                            <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                                <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            "w-full flex items-center gap-2 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted/50 focus:ring-2 focus:ring-primary/20 outline-none",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => date && setStartDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expiry Date</Label>
                            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium
                                ${expiryDate ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-700'}`}
                            >
                                <CalendarDays className="h-4 w-4" />
                                {expiryDate
                                    ? expiryDate.toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })
                                    : 'No Expiry'}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Subscription
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
