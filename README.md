# 📸 Dashboard Gallery

개인 이미지 갤러리를 로컬에서 탐색하고 관리할 수 있는 Next.js 기반 대시보드 앱입니다.

## 주요 기능

- `public/downloaded_images` 폴더 내 이미지 그룹 자동 탐색
- `meta.json` 메타데이터 기반 갤러리 제목, 링크, 좋아요 기능 지원
- 썸네일 이미지 자동 인식 (`thumbnail.jpg`, `.png`, `.jpeg`)
- 각 갤러리 상세 보기에서 이미지 뷰어 제공
- 이미지 좋아요/해제 → `meta.json`에 자동 반영
- 다크 모드 지원 및 토글 버튼
- 로컬 Finder에서 해당 폴더 열기 지원 (macOS)

## 사용법

1. `public/downloaded_images` 경로에 갤러리 폴더 생성  
   예: `public/downloaded_images/gallery_group/0e2b58c4/...`

2. 각 갤러리 폴더에 `meta.json` 파일을 추가  
   ```json
   {
     "title": "갤러리 제목",
     "url": "https://example.com",
     "hash": "0e2b58c4",
     "likes": []
   }
   ```

3. `thumbnail.jpg` 과 `photos/` 폴더를 갤러리 폴더에 추가  
   - `thumbnail.jpg`는 썸네일 이미지로 사용됩니다. 없을 경우 `photos/` 폴더 내 첫 번째 이미지가 사용됩니다.
   - `photos/` 폴더에는 갤러리의 모든 이미지가 포함되어야 합니다.

4. 앱 실행:

   ```bash
   npm install
   npm run dev
   ```

   또는 프로덕션 빌드 후 실행:

   ```bash
   npm run build
   npm run start
   ```

## 요구사항

- Node.js 18 이상
- macOS (Finder 열기 기능은 macOS 전용)

## TODO

- 이미지 정렬/검색 기능
- 클라우드 연동 기능
- 사용자별 설정 저장
