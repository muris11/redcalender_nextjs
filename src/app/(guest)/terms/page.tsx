import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan - Red Calender",
  description:
    "Syarat dan ketentuan penggunaan aplikasi Red Calender. Harap baca dengan seksama sebelum menggunakan layanan kami.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-24 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-10 md:p-14">
          <Heading variant="h1" className="mb-10 text-center text-gray-900 font-bold border-b border-pink-100 pb-8">
            Syarat & Ketentuan
          </Heading>
          
          <div className="prose prose-pink max-w-none">
            <Text variant="body-lg" className="text-gray-500 mb-10 italic text-center">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">1</span>
              Penerimaan Syarat
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Dengan mengakses atau menggunakan aplikasi Red Calender, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">2</span>
              Penggunaan Layanan
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda tidak boleh:
            </Text>
            <ul className="list-none pl-0 mb-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Menggunakan layanan untuk tujuan ilegal atau tidak sah.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Mencoba mengganggu atau merusak integritas atau kinerja layanan.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Mencoba mendapatkan akses tidak sah ke layanan atau sistem terkait.</Text>
              </li>
            </ul>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">3</span>
              Akun Pengguna
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Untuk menggunakan fitur tertentu, Anda harus membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">4</span>
              Konten Medis
            </Heading>
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl mb-6">
              <Text variant="body-md" className="text-orange-800 leading-relaxed">
                Informasi yang disediakan dalam aplikasi ini hanya untuk tujuan informasi umum dan edukasi. Konten ini <strong>bukan pengganti saran medis profesional</strong>, diagnosis, atau perawatan. Selalu konsultasikan dengan dokter atau tenaga kesehatan profesional untuk masalah kesehatan Anda.
              </Text>
            </div>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">5</span>
              Perubahan Layanan
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan (atau bagian mana pun darinya) kapan saja dengan atau tanpa pemberitahuan. Kami tidak akan bertanggung jawab kepada Anda atau pihak ketiga mana pun atas modifikasi, penangguhan, atau penghentian layanan.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">6</span>
              Hukum yang Berlaku
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">7</span>
              Hubungi Kami
            </Heading>
            <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100">
              <Text variant="body-md" className="mb-2 text-gray-600">
                Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
              </Text>
              <Text variant="body-lg" className="font-semibold text-pink-600">
                legal@redcalender.com
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
