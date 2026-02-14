'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { garageAPI } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export default function EditGaragePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        ownerMobile: '',
        ownerEmail: '',
        address: ''
    });

    useEffect(() => {
        const fetchGarage = async () => {
            try {
                const data = await garageAPI.getGarage(id);
                const garage = data.garage || data;
                setFormData({
                    name: garage.name || '',
                    ownerName: garage.ownerName || '',
                    ownerMobile: garage.ownerMobile || '',
                    ownerEmail: garage.ownerEmail || '',
                    address: garage.address || ''
                });
            } catch (error: any) {
                console.error('Failed to fetch garage:', error);
                toast.error("Failed to load garage details.");
                router.push('/admin/garages');
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchGarage();
        }
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await garageAPI.editGarage(id, formData);
            toast.success("Garage updated successfully.");
            setTimeout(() => {
                router.push('/admin/garages');
            }, 1000);
        } catch (error: any) {
            console.error('Failed to update garage:', error);
            toast.error(error.response?.data?.message || "Failed to update garage. Please try again.");
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <Button
                    variant="ghost"
                    className="pl-0 hover:pl-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Garages
                </Button>
            </div>

            <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Pencil className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Edit Garage: {formData.name}</CardTitle>
                            <CardDescription>Update the details of this garage.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Garage Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Divine Auto works"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="ownerName"
                                    name="ownerName"
                                    placeholder="e.g. John Doe"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    required
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerMobile">Owner Mobile <span className="text-red-500">*</span></Label>
                                <Input
                                    id="ownerMobile"
                                    name="ownerMobile"
                                    placeholder="e.g. +91 9876543210"
                                    value={formData.ownerMobile}
                                    onChange={handleChange}
                                    required
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ownerEmail">Owner Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="ownerEmail"
                                name="ownerEmail"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={formData.ownerEmail}
                                onChange={handleChange}
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="address"
                                name="address"
                                placeholder="e.g. 123 Main St, City, Country"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="bg-background min-h-[100px] resize-none"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 bg-muted/20 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin/garages')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground min-w-[120px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Update Garage'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
