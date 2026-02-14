'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { garageAPI } from '@/lib/api-client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Phone, Mail, User, ChevronRight, Calendar, Trash, Pencil, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SubscriptionModal from '@/components/ui/SubscriptionModal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Subscription {
    _id: string;
    subscriptionId: string;
    planId: { _id: string; name: string } | null;
    durationDays: number;
    startDate: string;
    endDate: string | null;
    status: string;
}

interface Garage {
    _id: string;
    name: string;
    ownerName: string;
    ownerMobile: string;
    ownerEmail: string;
    address: string;
    logo?: string;
    status: string;
    createdAt: string;
    currentSubscriptionId?: Subscription | null;
}


export default function GarageDashboard() {
    const router = useRouter();
    const [garages, setGarages] = useState<Garage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);

    useEffect(() => {
        const fetchGaragesAndSummaries = async () => {
            try {
                setLoading(true);
                const data = await garageAPI.getAll();
                console.log(data);

                const fetchedGarages: Garage[] = Array.isArray(data) ? data : (data.garages || []);

                setGarages(fetchedGarages);


                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch garages:', err);
                setError('Failed to load garage details. Please ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchGaragesAndSummaries();
    }, []);

    const refreshGarages = async () => {
        const data = await garageAPI.getAll();
        const fetched: Garage[] = Array.isArray(data) ? data : (data.garages || []);
        setGarages(fetched);
    };

    const openSubscriptionModal = (garage: Garage) => {
        setSelectedGarage(garage);
        setSubModalOpen(true);
    };

    const handleEdit = (garage: Garage) => {
        router.push(`/admin/garages/${garage._id}/edit`);
    };

    const handleDelete = async (garage: Garage) => {
        const confirmed = window.confirm(`Are you sure you want to delete ${garage.name}?`);
        if (confirmed) {
            try {
                await garageAPI.deleteGarage(garage._id);
                setGarages(garages.filter(g => g._id !== garage._id));
            } catch (error) {
                console.error("Failed to delete garage", error);
                toast.error("Failed to delete garage");
            }
        }
    };

    if (loading) {
        return (
            <div className="mt-6 border rounded-xl overflow-hidden bg-background shadow-sm">
                <div className="p-4 border-b bg-muted/30">
                    <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <TableHead key={i}><div className="h-4 w-24 bg-muted animate-pulse rounded"></div></TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i}>
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="mt-6 border-destructive bg-destructive/10">
                <CardContent className="pt-6 text-center">
                    <p className="text-destructive font-semibold mb-2">Oops! Something went wrong</p>
                    <p className="text-destructive/80 text-sm">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (garages.length === 0) {
        return (
            <Card className="mt-6 border-dashed">
                <CardContent className="py-12 text-center text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No garage records found</p>
                    <p className="text-sm">Add your first garage to get started.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-6 border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden rounded-2xl">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold">Manage Garages</CardTitle>
                        <CardDescription>Monitor activities and performance across all registered garages.</CardDescription>
                    </div>
                    <div>
                        <Button
                            onClick={() => router.push('/admin/garages/new')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Add New Garage
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-b">
                                <TableHead className="w-[300px] font-bold text-foreground">Garage Name & ID</TableHead>
                                <TableHead className="font-bold text-foreground">Owner Contact</TableHead>
                                <TableHead className="font-bold text-foreground">Address</TableHead>
                                <TableHead className="font-bold text-foreground">Subscription</TableHead>
                                <TableHead className="text-right font-bold text-foreground">Joined At</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                                <TableHead className="text-center font-bold text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {garages.map((garage) => (
                                <TableRow key={garage._id} className="group hover:bg-muted/30 transition-colors border-b">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                                                {garage.logo ? (
                                                    <img src={garage.logo} alt="" className="h-6 w-auto object-contain" />
                                                ) : (
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{garage.name}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-medium bg-green-50 text-green-700 border-green-100 uppercase tracking-tighter">Verified</Badge>
                                                    <span className="text-[10px] text-muted-foreground font-mono">#{garage._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                {garage.ownerName}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {garage.ownerMobile}</span>
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {garage.ownerEmail}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={garage.address}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="truncate">{garage.address}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const sub = garage.currentSubscriptionId;
                                            if (!sub) return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">No Plan</Badge>;
                                            const planName = sub.planId?.name || 'No Plan';
                                            const isFree = planName === 'Free';
                                            const isExpired = sub.endDate && new Date(sub.endDate) < new Date();
                                            return (
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className={`text-xs font-semibold ${isFree ? 'bg-gray-50 text-gray-600 border-gray-200'
                                                        : isExpired ? 'bg-red-50 text-red-700 border-red-200'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                        {planName}{isExpired ? ' (Expired)' : ''}
                                                    </Badge>
                                                    {!isFree && sub.endDate && (
                                                        <span className="text-[10px] text-muted-foreground">
                                                            Exp: {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-semibold flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {new Date(garage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Joined</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Quick View">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-0.5">
                                            <button onClick={() => openSubscriptionModal(garage)} className="p-2 hover:bg-amber-50 rounded-full transition-colors" title="Subscription">
                                                <Crown className="h-4 w-4 text-amber-500" />
                                            </button>
                                            <button onClick={() => handleEdit(garage)} className="p-2 hover:bg-muted rounded-full transition-colors" title="Edit">
                                                <Pencil className="h-4 w-4 text-blue-500" />
                                            </button>
                                            <button onClick={() => handleDelete(garage)} className="p-2 hover:bg-muted rounded-full transition-colors" title="Delete">
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-4 border-t bg-muted/10 flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <p>Total Garages: <span className="text-foreground font-bold">{garages.length}</span></p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Active System</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Last update: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </CardContent>

            {selectedGarage && (
                <SubscriptionModal
                    open={subModalOpen}
                    onClose={() => { setSubModalOpen(false); setSelectedGarage(null); }}
                    garageId={selectedGarage._id}
                    garageName={selectedGarage.name}
                    currentPlan={selectedGarage.currentSubscriptionId?.planId?.name || 'Free'}
                    onSuccess={refreshGarages}
                />
            )}
        </Card>
    );
}
