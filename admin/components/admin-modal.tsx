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

interface Admin {
    _id?: string;
    name: string;
    email: string;
    password?: string;
}

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    admin?: Admin | null;
}

export function AdminModal({ isOpen, onClose, onSuccess, admin }: AdminModalProps) {
    const [formData, setFormData] = useState<Admin>({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name,
                email: admin.email,
                password: '', // Don't show password
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
            });
        }
    }, [admin, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (admin?._id) {
                // Remove password if empty during update
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await garageAPI.updateAdmin(admin._id, updateData);
            } else {
                await garageAPI.createAdmin(formData);
            }
            onClose();
            // Call onSuccess after a small delay to ensure modal closure state is processed
            setTimeout(() => {
                onSuccess();
            }, 100);
        } catch (error: any) {
            alert(error.response?.data?.message || error.message || 'Failed to save admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{admin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                            required
                            maxLength={50}
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@example.com"
                            required
                            maxLength={50}
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">
                            Password {admin && <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required={!admin}
                            maxLength={100}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : admin ? 'Update Admin' : 'Create Admin'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
