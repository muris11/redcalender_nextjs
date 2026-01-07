"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-white pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami senang mendengar dari Anda. Kirimkan pesan, pertanyaan, atau saran Anda kepada kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Alamat</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Jl. Teknologi No. 123<br />
                      Jakarta Selatan, 12345<br />
                      Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Email</h3>
                    <p className="text-gray-600">support@redcalender.com</p>
                    <p className="text-gray-600">info@redcalender.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Telepon</h3>
                    <p className="text-gray-600">+62 812 3456 7890</p>
                    <p className="text-gray-600 text-sm mt-1">(Senin - Jumat, 09:00 - 17:00)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                        Nama Lengkap
                      </Label>
                      <Input id="name" required placeholder="Masukkan nama Anda" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                        Email
                      </Label>
                      <Input id="email" type="email" required placeholder="nama@email.com" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-base font-semibold text-gray-700">
                      Subjek
                    </Label>
                    <Input id="subject" required placeholder="Judul pesan Anda" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-base font-semibold text-gray-700">
                      Pesan
                    </Label>
                    <Textarea 
                      id="message" 
                      required 
                      placeholder="Tuliskan pesan Anda di sini..." 
                      className="min-h-[150px] rounded-xl bg-gray-50 border-gray-200 resize-y" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : (
                      <span className="flex items-center gap-2">
                        Kirim Pesan <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
