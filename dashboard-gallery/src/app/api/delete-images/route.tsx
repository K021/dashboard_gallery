import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { slug, filenames } = await req.json();

    console.log("slug", slug);
    console.log("filenames", filenames);

    if (!slug || !Array.isArray(filenames)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "public", "downloaded_images", ...slug.split("/"), "photos");
    
    const deleted: string[] = [];

    for (const filename of filenames) {
      const filePath = path.join(dirPath, filename);
      try {
        await fs.unlink(filePath);
        deleted.push(filename);
      } catch (error) {
        console.error(`❌ 삭제 실패: ${filename}`, error);
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("❌ 요청 처리 실패:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
