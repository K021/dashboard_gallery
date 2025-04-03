import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface GroupMeta {
  type: string;
  title: string;
  hash: string;
}

export interface GroupCardProps {
  group: string;
  meta: GroupMeta;
  thumbPath: string;
  imageCount?: number;
}

export function GroupCard({ group, meta, thumbPath }: GroupCardProps) {
  return (
    <Link href={`/gallery/${encodeURIComponent(group)}`} className="block">
      <Card className="max-w-[500px] rounded-xl border border-border shadow-xl 
        hover:shadow-2xl hover:ring-1 hover:ring-accent/50 transition-all 
        overflow-hidden dark:bg-zinc-900 dark:shadow-[0px_5px_20px_rgba(255,255,255,0.15)]">
        <div className="aspect-[2/3] flex items-center justify-center overflow-hidden">
          <Image
            src={thumbPath}
            alt={meta.title}
            layout="intrinsic"
            width={300}
            height={500}
            className="max-h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="">
          <div className="!m-3 text-m font-semibold text-foreground line-clamp-2 leading-tight dark:text-zinc-100">
            {meta.title}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}