'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { garageAPI } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddGaragePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        ownerMobile: '',
        ownerEmail: '',
        address: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await garageAPI.createGarage(formData);
            toast.success("Garage has been added successfully.");
            setTimeout(() => {
                router.push('/admin/garages');
            }, 1000);
        } catch (error: any) {
            console.error('Failed to create garage:', error);
            toast.error(error.response?.data?.message || "Failed to create garage. Please try again.");
            setLoading(false);
        }
    };

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
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Register New Garage</CardTitle>
                            <CardDescription>Enter the details to add a new garage to the system.</CardDescription>
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
                                'Add Garage'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
