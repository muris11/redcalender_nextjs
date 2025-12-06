import { ArticleLink } from "@/components/ArticleLink";
import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/db";
import { createSupabaseServer } from "@/lib/supabaseServer";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
    include: { author: { select: { name: true } }, category: true },
  });

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Red Calender",
      description: "Artikel yang Anda cari tidak tersedia.",
    };
  }

  // Get thumbnail URL
  let imageSrc = article.thumbnail ?? null;
  if (imageSrc && !/^https?:\/\//i.test(imageSrc)) {
    const server = createSupabaseServer();
    if (server) {
      try {
        const expires = parseInt(
          process.env.SUPABASE_SIGNED_URL_EXPIRES || "3600",
          10
        );
        const { data } = await server.storage
          .from("articles")
          .createSignedUrl(imageSrc, expires);
        if (data?.signedUrl) imageSrc = data.signedUrl;
      } catch (err) {
        // ignore
      }
    }
  }

  const description =
    article.content?.substring(0, 155).replace(/\s+/g, " ").trim() ||
    "Artikel edukasi kesehatan menstruasi dan reproduksi wanita di Red Calender.";

  return {
    title: `${article.title} | Red Calender`,
    description,
    keywords: [
      article.title,
      article.category?.name || "kesehatan wanita",
      "menstruasi",
      "kesehatan reproduksi",
      "edukasi kesehatan",
      "Red Calender",
    ],
    authors: [{ name: article.author?.name || "Red Calender Team" }],
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author?.name || "Red Calender Team"],
      url: `https://redcalender.my.id/education/${article.id}`,
      images: imageSrc
        ? [
            {
              url: imageSrc,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
      siteName: "Red Calender",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: imageSrc ? [imageSrc] : [],
    },
    alternates: {
      canonical: `https://redcalender.my.id/education/${article.id}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
    include: { author: { select: { name: true } }, category: true },
  });

  if (!article) return notFound();

  // Compute image src - if private storage path, create signed url
  let imageSrc = article.thumbnail ?? null;
  if (imageSrc && !/^https?:\/\//i.test(imageSrc)) {
    const server = createSupabaseServer();
    if (server) {
      try {
        const expires = parseInt(
          process.env.SUPABASE_SIGNED_URL_EXPIRES || "3600",
          10
        );
        const { data, error } = await server.storage
          .from("articles")
          .createSignedUrl(imageSrc, expires);
        if (data?.signedUrl) imageSrc = data.signedUrl;
      } catch (err) {
        // ignore and keep path raw
      }
    }
  }

  // Fetch latest articles for sidebar (exclude current article)
  const latestArticles = await db.article.findMany({
    where: { published: true, NOT: { id } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { author: { select: { name: true } } },
  });

  const server = createSupabaseServer();
  const latestWithSrc = await Promise.all(
    latestArticles.map(async (a) => {
      let thumb = a.thumbnail ?? null;
      if (thumb && !/^https?:\/\//i.test(thumb) && server) {
        try {
          const expires = parseInt(
            process.env.SUPABASE_SIGNED_URL_EXPIRES || "3600",
            10
          );
          const { data } = await server.storage
            .from("articles")
            .createSignedUrl(thumb, expires);
          if (data?.signedUrl) thumb = data.signedUrl;
        } catch (err) {
          // ignore
        }
      }
      return { ...a, imageSrc: thumb };
    })
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Enhanced Back Button */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/90 hover:bg-pink-50 text-gray-700 hover:text-pink-600 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 font-semibold group backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">
              Kembali ke Materi Edukasi
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left column - main article (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <article className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="h-1 sm:h-2 bg-linear-to-r from-pink-400 via-purple-400 to-pink-400"></div>

              <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
                {/* Enhanced Category Badge */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-pink-100 to-purple-100 text-pink-700 font-bold rounded-full text-xs sm:text-sm shadow-md">
                      <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {article.category.name}
                    </span>
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <Sparkles className="h-3 w-3" />
                      Materi Edukasi
                    </div>
                  </div>
                </div>

                {/* Article Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Enhanced Meta Information */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
                    </div>
                    <span className="font-semibold truncate">
                      {article.author.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <span className="whitespace-nowrap">
                      {new Date(article.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    </div>
                    <span className="whitespace-nowrap">
                      {Math.ceil(article.content.length / 1000)} menit baca
                    </span>
                  </div>
                </div>

                {/* Featured Image with Lazy Loading */}
                {imageSrc && (
                  <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={imageSrc}
                      alt={`Thumbnail materi: ${article.title}`}
                      className="w-full h-48 sm:h-64 lg:h-72 xl:h-96 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed">
                  <div className="whitespace-pre-wrap text-sm sm:text-base lg:text-lg">
                    {article.content}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right column - latest education articles */}
          <aside className="lg:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-0 p-4 sm:p-6 sticky top-20 sm:top-24">
              <div className="h-1 sm:h-2 bg-linear-to-r from-pink-400 to-purple-400 rounded-t-lg sm:rounded-t-xl -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4 sm:mb-6"></div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                <h3 className="text-lg sm:text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                  Edukasi Terbaru
                </h3>
                <Link
                  href="/education"
                  className="text-xs sm:text-sm text-pink-600 hover:text-pink-700 font-semibold hover:underline transition-all text-center sm:text-right"
                >
                  Lihat semua →
                </Link>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {latestWithSrc.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Belum ada materi lainnya
                    </p>
                  </div>
                ) : (
                  latestWithSrc.map((item) => (
                    <ArticleLink
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      createdAt={item.createdAt}
                      imageSrc={item.imageSrc}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
