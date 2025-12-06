"use client";

import { BookOpen, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ArticleLinkProps {
  id: string;
  title: string;
  createdAt: Date;
  imageSrc: string | null;
}

export function ArticleLink({
  id,
  title,
  createdAt,
  imageSrc,
}: ArticleLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/education/${id}`);
  };

  return (
    <Link
      href={`/education/${id}`}
      onClick={handleClick}
      prefetch={true}
      className="flex items-start gap-3 sm:gap-4 p-3 hover:bg-pink-50 rounded-lg sm:rounded-xl transition-all duration-300 group border-2 border-transparent hover:border-pink-200 hover:shadow-md relative"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center z-10">
          <Loader2 className="h-5 w-5 text-pink-600 animate-spin" />
        </div>
      )}
      <div className="w-16 h-14 sm:w-20 sm:h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Thumbnail materi: ${title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-pink-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold line-clamp-2 text-gray-800 group-hover:text-pink-600 transition-colors mb-1">
          {title}
        </h4>
        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}
