import { ArticleLink } from "@/components/ArticleLink";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { createSupabaseServer } from "@/lib/supabaseServer";
import {
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/education"
              className="hover:text-primary transition-colors"
            >
              Education
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">
              {article.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left column - main article (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6 lg:p-8">
                {/* Category Badge */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {article.category.name}
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Materi Edukasi
                    </Badge>
                  </div>
                </div>

                {/* Article Title */}
                <Heading level="1" variant="display-lg" className="mb-6">
                  {article.title}
                </Heading>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
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

                {/* Featured Image */}
                {imageSrc && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={`Thumbnail materi: ${article.title}`}
                      className="w-full h-64 lg:h-96 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-base max-w-none text-gray-800 leading-relaxed">
                  <div className="whitespace-pre-wrap">
                    {article.content}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right column - latest education articles */}
          <aside className="lg:block">
            <div className="bg-white rounded-lg border p-6 sticky top-20 sm:top-24">
              {/* Header with border-b */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <Heading level="3" variant="heading-md">
                    Edukasi Terbaru
                  </Heading>
                </div>
                <Link
                  href="/education"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Lihat semua →
                </Link>
              </div>

              <div className="space-y-4">
                {latestWithSrc.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-6 w-6 text-gray-400" />
                    </div>
                    <Text variant="body-md" className="text-gray-500">
                      Belum ada materi lainnya
                    </Text>
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
