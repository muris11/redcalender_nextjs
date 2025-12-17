import { Metadata } from "next";

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
    <div className="min-h-screen bg-gray-50 pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Syarat & Ketentuan
          </h1>
          
          <div className="prose prose-pink max-w-none text-gray-600">
            <p className="lead text-lg text-gray-700 mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Penerimaan Syarat</h2>
            <p className="mb-4">
              Dengan mengakses atau menggunakan aplikasi Red Calender, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Penggunaan Layanan</h2>
            <p className="mb-4">
              Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda tidak boleh:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Menggunakan layanan untuk tujuan ilegal atau tidak sah.</li>
              <li>Mencoba mengganggu atau merusak integritas atau kinerja layanan.</li>
              <li>Mencoba mendapatkan akses tidak sah ke layanan atau sistem terkait.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Akun Pengguna</h2>
            <p className="mb-4">
              Untuk menggunakan fitur tertentu, Anda harus membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Konten Medis</h2>
            <p className="mb-4">
              Informasi yang disediakan dalam aplikasi ini hanya untuk tujuan informasi umum dan edukasi. Konten ini <strong>bukan pengganti saran medis profesional</strong>, diagnosis, atau perawatan. Selalu konsultasikan dengan dokter atau tenaga kesehatan profesional untuk masalah kesehatan Anda.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Perubahan Layanan</h2>
            <p className="mb-4">
              Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan (atau bagian mana pun darinya) kapan saja dengan atau tanpa pemberitahuan. Kami tidak akan bertanggung jawab kepada Anda atau pihak ketiga mana pun atas modifikasi, penangguhan, atau penghentian layanan.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Hukum yang Berlaku</h2>
            <p className="mb-4">
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Hubungi Kami</h2>
            <p className="mb-4">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
              <br />
              <strong>Email:</strong> legal@redcalender.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
