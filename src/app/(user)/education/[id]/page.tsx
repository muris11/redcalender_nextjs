import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/db";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
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
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-pink-50 text-gray-700 hover:text-pink-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0 font-semibold group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Artikel</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - main article (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-pink-400 via-purple-400 to-pink-400"></div>

              <div className="p-8 md:p-10">
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-linear-to-r from-pink-100 to-purple-100 text-pink-700 font-bold rounded-full text-sm shadow-md">
                    📚 {article.category.name}
                  </span>
                </div>

                {/* Article Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b-2 border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-semibold">{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <span>
                      {Math.ceil(article.content.length / 1000)} menit baca
                    </span>
                  </div>
                </div>

                {/* Featured Image */}
                {imageSrc && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={imageSrc}
                      alt={`thumbnail-${article.title}`}
                      className="w-full h-72 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                  <div className="whitespace-pre-wrap text-base md:text-lg">
                    {article.content}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right column - latest articles */}
          <aside className="lg:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-0 p-6 sticky top-24">
              <div className="h-2 bg-linear-to-r from-pink-400 to-purple-400 rounded-t-xl -mx-6 -mt-6 mb-6"></div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  📰 Artikel Terbaru
                </h3>
                <Link
                  href="/education"
                  className="text-sm text-pink-600 hover:text-pink-700 font-semibold hover:underline transition-all"
                >
                  Lihat semua →
                </Link>
              </div>

              <div className="space-y-4">
                {latestWithSrc.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Belum ada artikel lainnya
                    </p>
                  </div>
                ) : (
                  latestWithSrc.map((item) => (
                    <Link
                      key={item.id}
                      href={`/education/${item.id}`}
                      className="flex items-start gap-4 p-3 hover:bg-pink-50 rounded-xl transition-all duration-300 group border-2 border-transparent hover:border-pink-200 hover:shadow-md"
                    >
                      <div className="w-20 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
                        {item.imageSrc ? (
                          <img
                            src={item.imageSrc}
                            alt={`thumb-${item.title}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-pink-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold line-clamp-2 text-gray-800 group-hover:text-pink-600 transition-colors mb-1">
                          {item.title}
                        </h4>
                        <div className="text-xs text-gray-500 font-medium">
                          📅{" "}
                          {new Date(item.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </Link>
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
