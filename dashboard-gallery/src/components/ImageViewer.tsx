"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface ImageViewerProps {
  slug: string[];
  images: string[];
  likes: string[]; // 추가
  initialIndex: number;
  onClose?: (updatedLikes: string[]) => void;
}

export default function ImageViewer({
  slug,
  images,
  likes,
  initialIndex,
  onClose = () => {},
}: ImageViewerProps) {
  const [likesState, setLikes] = useState(likes);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(() =>
    likesState.includes(images[initialIndex].split("/").pop() || "")
  );

  useEffect(() => {
    setLiked(likesState.includes(images[currentIndex].split("/").pop() || ""));
  }, [currentIndex, images, likesState]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "Escape") {
        onClose(likesState);
      }
    },
    [images.length, onClose, likesState]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const sensitivity = 12; // 민감도 조절 값. 값을 증가시키면 스크롤 시 빠르게 이미지가 변경됩니다.
      if (e.deltaY > sensitivity) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.deltaY < -sensitivity) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    },
    [images.length]
  );

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);

    const filename = images[currentIndex].split("/").pop() || "";
    let updatedLikes: string[] = [];

    if (newLiked) {
      updatedLikes = [...likesState, filename];
    } else {
      updatedLikes = likesState.filter((f) => f !== filename);
    }

    setLikes(updatedLikes);

    console.log("slug", slug);
    console.log("filename", filename);
    console.log("liked", newLiked);
    console.log("likes", updatedLikes);

    await fetch("/api/save-meta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, filename, liked: newLiked }),
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={() => onClose(likesState)}
    >
      <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => onClose(likesState)}>
        ×
      </button>
      <button
        className="absolute left-4 text-white text-4xl"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}
      >
        ←
      </button>
      <div className="relative max-h-[100vh] max-w-[100vw]">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          layout="intrinsic"
          width={4000}
          height={4000}
          className="object-contain w-full max-h-[100vh]"
        />
      </div>
      <button
        className="absolute right-4 text-white text-4xl"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }}
      >
        →
      </button>

      {/* 좋아요 버튼 */}
      <button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-2xl"
        onClick={(e) => {
          e.stopPropagation(); // 이 부분이 클릭 이벤트 전파를 막아줍니다.
          toggleLike(); // 좋아요 토글
        }}
      >
        {liked ? "❤️" : "🤍"}
      </button>
      <button
        title="Finder에서 열기"
        className="absolute bottom-4 right-4 text-white text-xl hover:text-gray-300 transition"
        onClick={(e) => {
          e.stopPropagation();
          console.log("slug", slug);
          const filename = images[currentIndex].split("/").pop() || "";
          const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
          const filePath = `/downloaded_images/${slugPath}/photos/${filename}`;
          fetch("/api/open-in-finder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: filePath }),
          });
        }}
      >
        📂
      </button>
    </div>,
    document.body
  );
}