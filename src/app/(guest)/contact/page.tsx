"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
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
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <Heading variant="h1" className="mb-4">
            <span className="text-pink-600">Hubungi</span> Kami
          </Heading>
          <Text variant="body-lg" className="text-muted-foreground max-w-2xl mx-auto">
            Kami senang mendengar dari Anda. Kirimkan pesan, pertanyaan, atau saran Anda kepada kami.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 border-none bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <Heading variant="h4" className="mb-1 text-gray-900 font-semibold">Alamat</Heading>
                    <Text variant="body-sm" className="text-gray-500 leading-relaxed">
                      Jl. Teknologi No. 123<br />
                      Jakarta Selatan, 12345<br />
                      Indonesia
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <Heading variant="h4" className="mb-1 text-gray-900 font-semibold">Email</Heading>
                    <Text variant="body-sm" className="text-gray-500 leading-relaxed">
                      support@redcalender.com<br />
                      info@redcalender.com
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <Heading variant="h4" className="mb-1 text-gray-900 font-semibold">Telepon</Heading>
                    <Text variant="body-sm" className="text-gray-500 leading-relaxed">
                      +62 812 3456 7890<br />
                      (Senin - Jumat, 09:00 - 17:00)
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-none bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
                      <Input 
                        id="name" 
                        required 
                        placeholder="Masukkan nama Anda" 
                        className="h-12 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all rounded-lg" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="nama@email.com" 
                        className="h-12 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all rounded-lg" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-medium">Subjek</Label>
                    <Input 
                      id="subject" 
                      required 
                      placeholder="Judul pesan Anda" 
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all rounded-lg" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">Pesan</Label>
                    <Textarea 
                      id="message" 
                      required 
                      placeholder="Tuliskan pesan Anda di sini..." 
                      className="min-h-[150px] resize-y border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all rounded-lg p-4" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8 py-6 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-200 transition-all duration-300 font-semibold text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : (
                      <span className="flex items-center gap-2">
                        Kirim Pesan <Send className="h-5 w-5 ml-1" />
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
