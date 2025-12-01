'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  BookOpen, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Heart,
  Brain,
  Apple
} from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

export default function EducationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load articles (mock data for now)
    loadArticles();
    setIsLoading(false);
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Filter articles based on search and category
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory]);

  const loadArticles = () => {
    // Mock articles data
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'Memahami Siklus Menstruasi: Panduan Lengkap',
        excerpt: 'Pelajari tentang 4 fase siklus menstruasi, hormon yang terlibat, dan bagaimana tubuh Anda berubah setiap bulannya.',
        content: 'Konten lengkap tentang siklus menstruasi...',
        thumbnail: '🩸',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Sarah Wijaya, Sp.OG',
        publishedAt: '2024-06-15',
        readTime: 8,
        tags: ['siklus', 'menstruasi', 'hormon', 'fase']
      },
      {
        id: '2',
        title: '10 Tips Mengatasi Nyeri Haid Secara Alami',
        excerpt: 'Temukan cara alami untuk mengurangi kram menstruasi tanpa obat-obatan, mulai dari teh herbal hingga yoga.',
        content: 'Tips lengkap untuk mengatasi nyeri haid...',
        thumbnail: '🌿',
        category: 'tips_pms',
        authorName: 'Dr. Anita Putri, Sp.OG',
        publishedAt: '2024-06-10',
        readTime: 6,
        tags: ['nyeri', 'kram', 'alami', 'tips']
      },
      {
        id: '3',
        title: 'Nutrisi Terbaik untuk Kesehatan Reproduksi',
        excerpt: 'Makanan apa yang harus dikonsumsi dan dihindari untuk menjaga keseimbangan hormon dan kesehatan reproduksi.',
        content: 'Panduan nutrisi untuk kesehatan reproduksi...',
        thumbnail: '🥗',
        category: 'nutrisi',
        authorName: 'Nutritionist Maya Sari',
        publishedAt: '2024-06-08',
        readTime: 10,
        tags: ['nutrisi', 'makanan', 'hormon', 'diet']
      },
      {
        id: '4',
        title: 'Mendeteksi Masa Subur Anda dengan Akurat',
        excerpt: 'Pelajari tanda-tanda ovulasi dan cara menghitung masa subur untuk planning kehamilan atau kontrasepsi.',
        content: 'Panduan lengkap mendeteksi masa subur...',
        thumbnail: '🌸',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Rina Permata, Sp.OG',
        publishedAt: '2024-06-05',
        readTime: 7,
        tags: ['ovulasi', 'masa subur', 'kesuburan', 'planning']
      },
      {
        id: '5',
        title: 'Mengenal PCOS: Gejala dan Pengobatan',
        excerpt: 'Semua yang perlu Anda ketahui tentang Sindrom Ovarium Polikistik, dari gejala hingga opsi pengobatan.',
        content: 'Informasi lengkap tentang PCOS...',
        thumbnail: '⚕️',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Lisa Chen, Sp.OG',
        publishedAt: '2024-06-01',
        readTime: 12,
        tags: ['PCOS', 'hormon', 'pengobatan', 'gejala']
      },
      {
        id: '6',
        title: 'Exercise Terbaik Selama Menstruasi',
        excerpt: 'Jenis olahraga yang aman dan bermanfaat dilakukan saat menstruasi untuk mengurangi gejala PMS.',
        content: 'Panduan exercise saat menstruasi...',
        thumbnail: '🏃‍♀️',
        category: 'tips_pms',
        authorName: 'Fitness Coach Diana',
        publishedAt: '2024-05-28',
        readTime: 5,
        tags: ['olahraga', 'fitness', 'PMS', 'kesehatan']
      },
      {
        id: '7',
        title: 'Cara Menjaga Kebersihan Saat Menstruasi',
        excerpt: 'Panduan lengkap tentang kebersihan pribadi saat menstruasi untuk mencegah infeksi dan kenyamanan.',
        content: 'Tips kebersihan saat menstruasi...',
        thumbnail: '🧼',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Siti Nurhaliza, Sp.OG',
        publishedAt: '2024-05-25',
        readTime: 6,
        tags: ['kebersihan', 'menstruasi', 'infeksi', 'kesehatan']
      },
      {
        id: '8',
        title: 'Tanda-tanda Gangguan Menstruasi yang Perlu Diwaspadai',
        excerpt: 'Kenali gejala-gejala gangguan menstruasi seperti amenorea, menoragia, dan kapan harus ke dokter.',
        content: 'Informasi tentang gangguan menstruasi...',
        thumbnail: '⚠️',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Ahmad Fauzi, Sp.OG',
        publishedAt: '2024-05-20',
        readTime: 9,
        tags: ['gangguan', 'amenorea', 'menoragia', 'dokter']
      },
      {
        id: '9',
        title: 'Makanan yang Membantu Mengurangi Gejala PMS',
        excerpt: 'Daftar makanan yang dapat membantu mengurangi kram, mood swings, dan gejala PMS lainnya.',
        content: 'Makanan untuk mengurangi PMS...',
        thumbnail: '🍓',
        category: 'nutrisi',
        authorName: 'Nutritionist Budi Santoso',
        publishedAt: '2024-05-15',
        readTime: 7,
        tags: ['PMS', 'makanan', 'nutrisi', 'gejala']
      },
      {
        id: '10',
        title: 'Stres dan Dampaknya pada Siklus Menstruasi',
        excerpt: 'Bagaimana stres mempengaruhi hormon menstruasi dan tips mengelola stres untuk siklus yang lebih teratur.',
        content: 'Hubungan stres dan menstruasi...',
        thumbnail: '🧘‍♀️',
        category: 'tips_pms',
        authorName: 'Dr. Ratna Dewi, Sp.OG',
        publishedAt: '2024-05-10',
        readTime: 8,
        tags: ['stres', 'hormon', 'siklus', 'kesehatan mental']
      },
      {
        id: '11',
        title: 'Panduan Tidur yang Baik untuk Kesehatan Reproduksi',
        excerpt: 'Kualitas tidur yang mempengaruhi kesehatan reproduksi dan tips untuk tidur yang lebih nyenyak.',
        content: 'Panduan tidur sehat...',
        thumbnail: '😴',
        category: 'tips_pms',
        authorName: 'Sleep Specialist Dr. Indah',
        publishedAt: '2024-05-05',
        readTime: 6,
        tags: ['tidur', 'kesehatan', 'reproduksi', 'hormon']
      },
      {
        id: '12',
        title: 'Vitamin dan Mineral Penting untuk Kesehatan Wanita',
        excerpt: 'Vitamin dan mineral yang dibutuhkan tubuh wanita, sumbernya, dan dosis yang direkomendasikan.',
        content: 'Vitamin dan mineral untuk wanita...',
        thumbnail: '💊',
        category: 'nutrisi',
        authorName: 'Dr. Citra Dewi, Sp.GK',
        publishedAt: '2024-04-28',
        readTime: 10,
        tags: ['vitamin', 'mineral', 'nutrisi', 'kesehatan']
      },
      {
        id: '13',
        title: 'Cara Melakukan SADARI (Periksa Payudara Sendiri) dengan Benar',
        excerpt: 'Langkah-langkah SADARI yang benar, kapan harus dilakukan, dan apa yang harus diwaspadai.',
        content: 'Panduan SADARI lengkap...',
        thumbnail: '🔍',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Fitri Handayani, Sp.OG',
        publishedAt: '2024-04-25',
        readTime: 7,
        tags: ['SADARI', 'payudara', 'kanker', 'deteksi dini']
      },
      {
        id: '14',
        title: 'Kontrasepsi: Pilihan dan Efek Sampingnya',
        excerpt: 'Berbagai pilihan kontrasepsi, kelebihan, kekurangan, dan cara memilih yang tepat untuk Anda.',
        content: 'Panduan kontrasepsi lengkap...',
        thumbnail: '🛡️',
        category: 'kesehatan_reproduksi',
        authorName: 'Dr. Yuni Kartika, Sp.OG',
        publishedAt: '2024-04-20',
        readTime: 11,
        tags: ['kontrasepsi', 'KB', 'keluarga berencana', 'pilihan']
      },
      {
        id: '15',
        title: 'Yoga dan Meditasi untuk Mengurangi Gejala Menstruasi',
        excerpt: 'Gerakan yoga dan teknik meditasi yang membantu mengurangi nyeri haid dan menyeimbangkan hormon.',
        content: 'Yoga untuk menstruasi...',
        thumbnail: '🧘‍♀️',
        category: 'tips_pms',
        authorName: 'Yoga Instructor Maya',
        publishedAt: '2024-04-15',
        readTime: 8,
        tags: ['yoga', 'meditasi', 'nyeri', 'relaksasi']
      }
    ];

    setArticles(mockArticles);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'kesehatan_reproduksi': return <Heart className="h-4 w-4" />;
      case 'tips_pms': return <Brain className="h-4 w-4" />;
      case 'nutrisi': return <Apple className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kesehatan_reproduksi': return 'bg-pink-100 text-pink-700';
      case 'tips_pms': return 'bg-purple-100 text-purple-700';
      case 'nutrisi': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'kesehatan_reproduksi': return 'Kesehatan Reproduksi';
      case 'tips_pms': return 'Tips PMS';
      case 'nutrisi': return 'Nutrisi';
      default: return 'Umum';
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat artikel edukasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Edukasi Kesehatan</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hai, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Pelajari Kesehatan Reproduksi Anda
            </h2>
            <p className="text-lg text-pink-100 mb-6">
              Dapatkan informasi terpercaya dari tenaga kesehatan profesional tentang 
              kesehatan menstruasi, tips PMS, dan nutrisi untuk keseimbangan hormon.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{articles.length} Artikel</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Expert Authors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari artikel, topik, atau tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="kesehatan_reproduksi">Kesehatan Reproduksi</SelectItem>
                  <SelectItem value="tips_pms">Tips PMS</SelectItem>
                  <SelectItem value="nutrisi">Nutrisi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredArticles.length} dari {articles.length} artikel
            {selectedCategory !== 'all' && ` dalam kategori "${getCategoryName(selectedCategory)}"`}
            {searchTerm && ` untuk "${searchTerm}"`}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{article.thumbnail}</span>
                  <Badge className={getCategoryColor(article.category)}>
                    {getCategoryIcon(article.category)}
                    <span className="ml-1">{getCategoryName(article.category)}</span>
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>{article.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime} menit</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Baca Selengkapnya
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-gray-600 mb-4">
              Coba ubah kata kunci pencarian atau pilih kategori lain
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Butuh Informasi Lebih Spesifik?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim medis kami siap membantu menjawab pertanyaan tentang kesehatan reproduksi Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                Konsultasi dengan Dokter
              </Button>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Lihat Semua Artikel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}