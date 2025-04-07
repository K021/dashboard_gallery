"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import ImageViewer from "@/components/ImageViewer";
import Link from "next/link";  // Add the import at the top
import Image from "next/image";
import Selecto from "react-selecto"; // 상단 import 추가

export default function GalleryDetailPage() {
  const { slug } = useParams<{ slug: string[] }>();
  const [images, setImages] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!slug || !Array.isArray(slug)) return;

    console.log("page.slug", slug);

    const load = async () => {
      try {
        const res = await fetch(`/api/gallery/${slug.join("/")}`);
        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await res.json();
        setImages(data.images);
        setLikes(data.likes || []);
        setTitle(data.title);
        setSelectedImages([]);
      } catch (err: any) {
        setError(err.message || "Error loading gallery");
      }
    };

    load();
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && selectedImages.length > 0) {
        if (confirm(`${selectedImages.length}개 이미지를 삭제할까요?`)) {
          fetch("/api/delete-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: slug.join("/"),
              filenames: selectedImages.map((src) => src.split("/").pop()),
            }),
          }).then(() => {
            setImages((prev) => prev.filter((img) => !selectedImages.includes(img)));
            setSelectedImages([]);
          });
        }
      } else if (e.key === "Escape") {
        console.log("Escape key pressed");
        setSelectedImages([]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImages]);

  useEffect(() => {
    console.log("✅ likes 변경됨:", likes);
  }, [likes]);

  if (error) {
    return <div className="p-6 text-center text-destructive">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">이미지가 없습니다.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="fixed top-0 left-0 w-full h-12 z-40 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold !ml-3 !my-2.5 flex items-center gap-2">
          <Link href="#" onClick={() => history.back()} title="뒤로 가기" className="hover:underline">🏠</Link>
          {title}
        </h1>
        <ThemeToggle />
      </div>
      <div tabIndex={0} id="focus-catcher" className="sr-only" />
      {selectedImages.length > 0 && (
        <button
          onClick={async () => {
            if (confirm(`${selectedImages.length}개 이미지를 삭제할까요?`)) {
              await fetch("/api/delete-images", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  slug: slug.join("/"),
                  filenames: selectedImages.map((src) => src.split("/").pop()),
                }),
              });
              setImages((prev) => prev.filter((img) => !selectedImages.includes(img)));
              setSelectedImages([]);
            }
          }}
          className="fixed bottom-2 right-2 z-50 bg-destructive text-white px-3 py-1 rounded shadow hover:opacity-80"
        >
          <div className="inline-block !my-1.5 !mx-2">
            삭제하기
          </div>
        </button>
      )}
      <div className="relative">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 !pt-[62px] !px-4 !pb-4"
          id="image-grid"
        >
          {images.map((src, i) => (
            <div className="relative group selectable" key={i} data-src={src}>
              <input
                type="checkbox"
                checked={selectedImages.includes(src)}
                onChange={() => {
                  setSelectedImages((prev) =>
                    prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
                  );
                }}
                className="absolute top-2 left-2 z-10 w-5 h-5"
              />
              <Image
                src={src}
                alt={`Image ${i + 1}`}
                width={800}
                height={1200}
                className="w-full h-auto rounded-lg shadow cursor-pointer object-contain"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImages((prev) =>
                      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
                    );
                  } else {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById("focus-catcher")?.focus();
                    setCurrentIndex(i);
                    setViewerOpen(true);
                  }
                }}
              />
              {likes.includes(src.split("/").pop()!) && (
                <div className="absolute top-2 right-2 text-red-500 text-xl">❤️</div>
              )}
            </div>
          ))}
        </div>

        <Selecto
          container={typeof window !== "undefined" ? document.body : undefined}
          selectableTargets={[".selectable"]}
          hitRate={30}
          selectByClick={false}
          selectFromInside={false}
          toggleContinueSelect={["shift"]}
          onSelectEnd={(e) => {
            const selected = e.selected.map((el) => el.getAttribute("data-src")!).filter(Boolean);
            setSelectedImages(selected);
          }}
        />
      </div>
      {viewerOpen && (
        <ImageViewer
          key={currentIndex} // This forces re-mount when image changes
          slug={slug}
          images={images}
          initialIndex={currentIndex}
          onClose={(updatedLikes) => {
            setViewerOpen(false);
            console.log("Updated likes:", updatedLikes);
            console.log("Old likes:", likes);
            setLikes(updatedLikes);
          }}
          likes={likes}
        />
      )}
    </div>
  );
}