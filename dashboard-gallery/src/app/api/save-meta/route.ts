import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const { slug, filename, liked } = await request.json(); // 클라이언트에서 보내온 slug, filename, liked 상태

  const metaFilePath = path.join(process.cwd(), "public", "downloaded_images", ...slug, "meta.json");

  // 부모 디렉토리가 존재하는지 확인
  const folderPath = path.dirname(metaFilePath);
  if (!fs.existsSync(folderPath)) {
    return NextResponse.json({ error: "Invalid slug path" }, { status: 400 });
  }

  // 기존 meta.json 파일을 불러와서 업데이트
  let metaData: { likes: string[]; [key: string]: any } = { likes: [] };
  if (fs.existsSync(metaFilePath)) {
    const fileContent = fs.readFileSync(metaFilePath, "utf-8");
    metaData = JSON.parse(fileContent);
  }

  if (!metaData.likes) metaData.likes = [];

  metaData.likes = metaData.likes.filter((f: string) => f !== filename);
  if (liked) {
    metaData.likes.push(filename);
  }

  // 새로운 meta.json 파일로 저장
  fs.writeFileSync(metaFilePath, JSON.stringify(metaData, null, 2));

  return NextResponse.json({ success: true });
}