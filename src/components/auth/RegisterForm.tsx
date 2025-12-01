'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avgCycleLength: '28',
    avgPeriodLength: '6',
    theme: 'kucing'
  });

  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avgCycleLength: parseInt(formData.avgCycleLength),
      avgPeriodLength: parseInt(formData.avgPeriodLength),
      theme: formData.theme
    });

    if (result.success) {
      router.push('/onboarding');
    } else {
      setError(result.error || 'Registrasi gagal');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 15 - i); // Usia 15-65 tahun

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-pink-600">
            🌸 Red Calendar
          </CardTitle>
          <CardDescription>
            Daftar untuk mulai mencatat siklus menstruasi Anda
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Pribadi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Informasi Pribadi</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Keamanan Akun</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Ulangi password"
                  />
                </div>
              </div>
            </div>

            {/* Personalisasi Tema */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Personalisasi Tema</h3>
              <div className="space-y-2">
                <Label>Pilih Tema Favorit Anda</Label>
                <RadioGroup value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kucing" id="theme-kucing" />
                    <Label htmlFor="theme-kucing">🐱 Kucing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gajah" id="theme-gajah" />
                    <Label htmlFor="theme-gajah">🐘 Gajah</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unicorn" id="theme-unicorn" />
                    <Label htmlFor="theme-unicorn">🦄 Unicorn</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-pink-600 hover:bg-pink-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Sudah punya akun? </span>
            <Link href="/login" className="text-pink-600 hover:underline font-medium">
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}