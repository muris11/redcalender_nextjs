import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Red Calender",
  description:
    "Kebijakan privasi Red Calender menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-24 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-10 md:p-14">
          <Heading variant="h1" className="mb-10 text-center text-gray-900 font-bold border-b border-pink-100 pb-8">
            Kebijakan Privasi
          </Heading>
          
          <div className="prose prose-pink max-w-none">
            <Text variant="body-lg" className="text-gray-500 mb-10 italic text-center">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">1</span>
              Pendahuluan
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Red Calender ("kami") menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi dan layanan kami.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">2</span>
              Informasi yang Kami Kumpulkan
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Kami mengumpulkan informasi berikut untuk memberikan layanan terbaik bagi Anda:
            </Text>
            <ul className="list-none pl-0 mb-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600"><strong className="text-gray-900">Informasi Akun:</strong> Nama, alamat email, dan nomor telepon saat Anda mendaftar.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600"><strong className="text-gray-900">Data Kesehatan:</strong> Data siklus menstruasi, gejala, dan catatan kesehatan lainnya yang Anda masukkan.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600"><strong className="text-gray-900">Informasi Perangkat:</strong> Jenis perangkat, sistem operasi, dan pengidentifikasi unik perangkat.</Text>
              </li>
            </ul>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">3</span>
              Penggunaan Informasi
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Kami menggunakan informasi Anda untuk:
            </Text>
            <ul className="list-none pl-0 mb-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Menghitung dan memprediksi siklus menstruasi Anda.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Memberikan analisis kesehatan yang personal.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Meningkatkan fitur dan layanan aplikasi kami.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Mengirimkan notifikasi penting terkait kesehatan Anda.</Text>
              </li>
            </ul>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">4</span>
              Keamanan Data
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat untuk melindungi data Anda dari akses yang tidak sah, perubahan, atau kehilangan. Semua data sensitif dienkripsi saat transit dan saat disimpan.
            </Text>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">5</span>
              Hak Anda
            </Heading>
            <Text variant="body-md" className="mb-6 text-gray-600 leading-relaxed">
              Anda memiliki hak untuk:
            </Text>
            <ul className="list-none pl-0 mb-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Mengakses data pribadi Anda yang kami simpan.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Meminta koreksi data yang tidak akurat.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Meminta penghapusan akun dan data Anda.</Text>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0"></div>
                <Text variant="body-md" className="text-gray-600">Menarik persetujuan penggunaan data kapan saja.</Text>
              </li>
            </ul>

            <Heading variant="h2" className="mt-10 mb-6 text-gray-900 font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">6</span>
              Hubungi Kami
            </Heading>
            <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100">
              <Text variant="body-md" className="mb-2 text-gray-600">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
              </Text>
              <Text variant="body-lg" className="font-semibold text-pink-600">
                privacy@redcalender.com
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
