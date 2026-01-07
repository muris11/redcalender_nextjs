"use client";

import { BookOpen, Calendar } from "lucide-react";
import { LoadingLink } from "@/components/ui/loading-link";

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
  return (
    <LoadingLink
      href={`/education/${id}`}
      prefetch={true}
      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-gray-200"
    >
      <div className="w-16 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Thumbnail materi: ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-primary transition-colors mb-1">
          {title}
        </h4>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </LoadingLink>
  );
}
