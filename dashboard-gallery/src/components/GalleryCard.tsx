// src/components/GalleryCard.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface GalleryMeta {
  title: string;
  hash: string;
  url?: string;
  pageCount?: number;
  type?: string;
}

export interface GalleryCardProps {
  group: string;
  meta: GalleryMeta;
  thumbPath: string;
  imageCount?: number;
}

export function GalleryCard({ group, meta, thumbPath, imageCount }: GalleryCardProps) {
  return (
    <Link href={`/gallery/${encodeURIComponent(group)}/${encodeURIComponent(meta.hash)}`} className="block">
      <Card className="
        max-w-[500px] rounded-xl border border-border shadow-xl 
        hover:shadow-2xl hover:ring-1 hover:ring-accent/50 transition-all 
        overflow-hidden dark:bg-zinc-900 dark:shadow-[0px_5px_20px_rgba(255,255,255,0.15)]
      ">
        <div className="aspect-[2/3] flex items-center justify-center overflow-hidden">
          <Image
            src={thumbPath}
            alt={meta.title}
            width={300}
            height={500}
            className="max-h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="">
          <div className="!m-2 text-sm font-semibold text-foreground line-clamp-2 leading-tight dark:text-zinc-100">
            {meta.title}
          </div>
          <div className="!m-2 text-xs text-muted-foreground mt-1 dark:text-zinc-100">
            📷 {imageCount}장 {meta.pageCount ? `· 📄 ${meta.pageCount}p` : ""}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}