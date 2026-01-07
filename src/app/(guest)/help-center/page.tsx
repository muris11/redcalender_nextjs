"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white pt-40 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Heading variant="h1" className="text-white mb-6 font-bold tracking-tight">
            Pusat Bantuan
          </Heading>
          <Text variant="body-xl" className="text-white/90 mb-10 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan Anda seputar Red Calender dan pelajari cara memaksimalkan fitur kami.
          </Text>
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all duration-300"></div>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-600 z-20" />
            <Input
              type="text"
              placeholder="Cari topik bantuan..."
              className="h-14 pl-14 bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-pink-300/50 rounded-full shadow-lg text-gray-800 placeholder:text-gray-400 relative z-10 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          <Heading variant="h2" className="mb-10 text-center text-gray-900 font-bold">
            Pertanyaan Umum
          </Heading>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                question: "Bagaimana cara mengubah tema aplikasi?",
                answer: "Anda dapat mengubah tema aplikasi melalui menu Pengaturan di Dashboard. Pilih opsi 'Tampilan' dan pilih tema favorit Anda (Kucing, Gajah, atau Unicorn)."
              },
              {
                question: "Apakah data saya aman?",
                answer: "Ya, keamanan data Anda adalah prioritas kami. Semua data kesehatan dienkripsi dan disimpan dengan standar keamanan tinggi. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga tanpa izin."
              },
              {
                question: "Bagaimana cara menghitung siklus menstruasi?",
                answer: "Siklus menstruasi dihitung dari hari pertama haid hingga hari pertama haid berikutnya. Red Calender akan secara otomatis menghitung rata-rata siklus Anda berdasarkan data yang Anda masukkan."
              },
              {
                question: "Apakah aplikasi ini gratis?",
                answer: "Red Calender menyediakan fitur dasar secara gratis selamanya. Kami juga menawarkan fitur premium untuk analisis yang lebih mendalam dan konten eksklusif."
              },
              {
                question: "Bagaimana jika saya lupa password?",
                answer: "Jika Anda lupa password, klik tautan 'Lupa Password' di halaman Login. Kami akan mengirimkan instruksi reset password ke email yang terdaftar."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 rounded-xl px-6 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-pink-100">
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-pink-600 hover:no-underline py-5 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-10 shadow-sm">
            <Heading variant="h3" className="mb-3 text-gray-900 font-bold">
              Masih butuh bantuan?
            </Heading>
            <Text className="text-gray-500 mb-8 max-w-lg mx-auto">
              Tim support kami siap membantu Anda menyelesaikan masalah atau menjawab pertanyaan Anda.
            </Text>
            <Link href="/contact">
              <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-200 transition-all duration-300 font-semibold">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
