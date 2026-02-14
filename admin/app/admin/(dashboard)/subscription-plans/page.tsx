import { SubscriptionPlanTable } from '@/components/subscription-plan-table';

export default function SubscriptionPlansPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <SubscriptionPlanTable />
        </div>
    );
}
