import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";


type Params = Promise<{ slug: string | string[] }>;

export async function GET(
  req: Request,
  { params }: { params: Params }
) {

  const { slug } = await params;
  // console.log("route.slug", slug);

  // slug가 배열이든 문자열이든 처리
  const slugArray = Array.isArray(slug) ? slug : slug.split("/");

  const folder = decodeURIComponent(slugArray.pop()!);
  const baseDir = path.join(process.cwd(), "public", "downloaded_images", ...slugArray);
  const folderPath = path.join(baseDir, folder);

  // console.log("folderPath", folderPath);
  // console.log("slugArray", slugArray);
  // console.log("folder", folder);
  // console.log("baseDir", baseDir);
  // console.log("params", params);

  if (!fs.existsSync(folderPath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const metaPath = path.join(folderPath, "meta.json");
  const hasMeta = fs.existsSync(metaPath);

  let title = folder;
  let likes: string[] = [];
  if (hasMeta) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      title = meta.title ?? folder;
      likes = meta.likes ?? [];
    } catch {
      // ignore JSON parse errors
    }
  }

  const photosDir = fs.existsSync(path.join(folderPath, "photos"))
    ? path.join(folderPath, "photos")
    : folderPath;

  const imageFiles = fs
    .readdirSync(photosDir)
    .filter((f) => f.match(/\.(jpg|jpeg|png)$/i))
    .map((filename) => {
      const relativePath = path.relative(path.join(process.cwd(), "public"), path.join(photosDir, filename));
      return `/${relativePath.replaceAll(path.sep, "/")}`;
    });

  return NextResponse.json({
    title,
    images: imageFiles,
    likes,
  });
}
