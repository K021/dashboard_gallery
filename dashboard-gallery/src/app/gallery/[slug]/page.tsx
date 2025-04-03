import { ScrollArea } from "@/components/ui/scroll-area";
import { GalleryCard, GalleryCardProps, GalleryMeta } from "@/components/GalleryCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import fs from "fs";
import path from "path";
import Link from "next/link";


function getGalleryList(slug: string): GalleryCardProps[] {
  console.log("slug", slug);

  const baseDir = path.join(process.cwd(), "public", "downloaded_images", slug);
  const folders = fs.readdirSync(baseDir);
  const galleries: GalleryCardProps[] = [];

  for (const folderName of folders) {
    const folderPath = path.join(baseDir, folderName);
    const metaPath = path.join(folderPath, "meta.json");

    if (!fs.existsSync(metaPath)) continue;

    const meta: GalleryMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    // 초기 기본 이미지 탐색
    let thumbFolder = folderPath;
    let imageFiles = fs
      .readdirSync(thumbFolder)
      .filter((f) => f.match(/\.(jpg|jpeg|png)$/i));

    // 없으면 photos 하위 폴더 fallback
    if (imageFiles.length === 0) {
      const photosPath = path.join(folderPath, "photos");
      if (fs.existsSync(photosPath)) {
        const fallbackImages = fs
          .readdirSync(photosPath)
          .filter((f) => f.match(/\.(jpg|jpeg|png)$/i));
        if (fallbackImages.length > 0) {
          thumbFolder = photosPath;
          imageFiles = fallbackImages;
        }
      }
    }

    // 그래도 없으면 스킵
    if (imageFiles.length === 0) {
      console.warn(`⚠️ 썸네일 이미지 없음: ${folderPath}`);
      continue;
    }

    const relativeThumbPath = path.relative(
      path.join(process.cwd(), "public"),
      path.join(thumbFolder, imageFiles[0])
    );
    const thumbPath = `/${relativeThumbPath.replaceAll(path.sep, "/")}`;

    galleries.push({
      group: slug,
      meta,
      thumbPath,
      imageCount: imageFiles.length,
    });
  }

  return galleries;
}

type Params = Promise<{ slug: string }>;

export default async function DashboardPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const galleries = getGalleryList(slug);

  return (
    <>
      {/* ✅ 상단 고정 헤더 */}
      <div className="fixed top-0 left-0 w-full h-12 z-40 bg-background/80 backdrop-blur border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold !ml-3 !my-2.5"><Link href="/gallery" className="hover:underline">📁</Link> 내 이미지 갤러리</h1>
        <ThemeToggle />
      </div>
      <ScrollArea className="h-screen !pt-[72px] !px-6 !pb-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {galleries.map((item, i) => (
            <GalleryCard key={i} {...item} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}