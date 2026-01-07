import { Metadata } from "next";

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
    <div className="min-h-screen bg-gray-50 pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Kebijakan Privasi
          </h1>
          
          <div className="prose prose-pink max-w-none text-gray-600">
            <p className="lead text-lg text-gray-700 mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Pendahuluan</h2>
            <p className="mb-4">
              Red Calender ("kami") menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi dan layanan kami.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Informasi yang Kami Kumpulkan</h2>
            <p className="mb-4">
              Kami mengumpulkan informasi berikut untuk memberikan layanan terbaik bagi Anda:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Informasi Akun:</strong> Nama, alamat email, dan nomor telepon saat Anda mendaftar.</li>
              <li><strong>Data Kesehatan:</strong> Data siklus menstruasi, gejala, dan catatan kesehatan lainnya yang Anda masukkan.</li>
              <li><strong>Informasi Perangkat:</strong> Jenis perangkat, sistem operasi, dan pengidentifikasi unik perangkat.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Penggunaan Informasi</h2>
            <p className="mb-4">
              Kami menggunakan informasi Anda untuk:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Menghitung dan memprediksi siklus menstruasi Anda.</li>
              <li>Memberikan analisis kesehatan yang personal.</li>
              <li>Meningkatkan fitur dan layanan aplikasi kami.</li>
              <li>Mengirimkan notifikasi penting terkait kesehatan Anda.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Keamanan Data</h2>
            <p className="mb-4">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat untuk melindungi data Anda dari akses yang tidak sah, perubahan, atau kehilangan. Semua data sensitif dienkripsi saat transit dan saat disimpan.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Hak Anda</h2>
            <p className="mb-4">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Mengakses data pribadi Anda yang kami simpan.</li>
              <li>Meminta koreksi data yang tidak akurat.</li>
              <li>Meminta penghapusan akun dan data Anda.</li>
              <li>Menarik persetujuan penggunaan data kapan saja.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Hubungi Kami</h2>
            <p className="mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
              <br />
              <strong>Email:</strong> privacy@redcalender.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
