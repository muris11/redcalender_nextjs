"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-white pb-20">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-pink-600 to-purple-600 py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pusat Bantuan
          </h1>
          <p className="text-xl text-pink-100 mb-8">
            Temukan jawaban atas pertanyaan Anda seputar Red Calender
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari topik bantuan..."
              className="h-14 pl-12 rounded-full bg-white/95 backdrop-blur-sm border-0 shadow-lg text-lg focus-visible:ring-pink-300"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pertanyaan Umum
          </h2>
          
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
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 rounded-xl px-4 bg-gray-50/50 hover:bg-white transition-colors">
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-pink-600 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center bg-pink-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Masih butuh bantuan?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim support kami siap membantu Anda 24/7
            </p>
            <Link href="/contact">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-pink-200/50 transition-all">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
