import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { slug, filename } = await req.json();

    if (!filename) {
      console.error('❌ filename이 비어 있음. 썸네일 설정 중단');
      return NextResponse.json({ success: false, message: 'filename is required' }, { status: 400 });
    }

    const folderPath = path.join(process.cwd(), 'public', 'downloaded_images', ...slug.split('/'));
    const photosPath = path.join(process.cwd(), 'public', 'downloaded_images', ...slug.split('/'), 'photos');
    const originalImagePath = path.join(photosPath, filename);
    const baseThumbnailPath = path.join(folderPath, 'thumbnail.jpg');

    if (!fs.existsSync(originalImagePath)) {
      return NextResponse.json({ success: false, message: 'original image does not exist' }, { status: 404 });
    }

    fs.copyFileSync(originalImagePath, baseThumbnailPath);
    console.log(`✅ 썸네일 이미지 복사 완료: ${originalImagePath} → ${baseThumbnailPath}`);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('❌ 에러 발생:', e);
    return NextResponse.json({ success: false, message: 'internal server error' }, { status: 500 });
  }
}
