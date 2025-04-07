import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupCard, GroupCardProps, GroupMeta } from "@/components/GroupCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import fs from "fs";
import path from "path";


function getGroupList(): GroupCardProps[] {
  const baseDir = path.join(process.cwd(), "public", "downloaded_images");
  const folders = fs.readdirSync(baseDir);
  const galleries: GroupCardProps[] = [];

  console.log("baseDir", baseDir);
  console.log("folders", folders);

  for (const folderName of folders) {
    const folderPath = path.join(baseDir, folderName);
    const metaPath = path.join(folderPath, "meta.json");

    if (!fs.existsSync(metaPath)) continue;

    const meta: GroupMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    // 초기 기본 이미지 탐색
    let thumbnailPath = path.join(folderPath, "thumbnail.jpg");
    if (!fs.existsSync(thumbnailPath)) {
      thumbnailPath = path.join(folderPath, "thumbnail.png");
    }
    if (!fs.existsSync(thumbnailPath)) {
      thumbnailPath = path.join(folderPath, "thumbnail.jpeg");
    }

    // 그래도 없으면 스킵
    if (!fs.existsSync(thumbnailPath)) {
      console.warn(`⚠️ 썸네일 이미지 없음: ${folderPath}`);
      continue;
    }

    const relativeThumbPath = path.relative(
      path.join(process.cwd(), "public"),
      thumbnailPath
    );
    const thumbPath = `/${relativeThumbPath.replaceAll(path.sep, "/")}`;

    galleries.push({
      group: folderName,
      meta,
      thumbPath,
    });
  }

  return galleries;
}

export default function DashboardPage() {
  const galleries = getGroupList();

  return (
    <>
      {/* ✅ 상단 고정 헤더 */}
      <div className="fixed top-0 left-0 w-full h-12 z-40 bg-background/80 backdrop-blur border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold !ml-3 !my-2.5">📁 내 이미지 갤러리</h1>
        <ThemeToggle />
      </div>
      <ScrollArea className="h-screen !pt-[72px] !px-6 !pb-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {galleries.map((item, i) => (
            <GroupCard key={i} {...item} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}