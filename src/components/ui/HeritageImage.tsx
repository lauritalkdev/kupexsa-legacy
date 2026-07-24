"use client";

import Image from "next/image";
import { useState } from "react";

interface HeritageImageProps {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export default function HeritageImage({
  src,
  alt,
  label,
  className = "",
  imageClassName = "",
  priority = false,
}: HeritageImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const showPlaceholder = !imageLoaded || imageFailed;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 ${className}`}
    >
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-2xl text-yellow-300">
              ✦
            </div>

            <p className="font-semibold text-white">
              {label}
            </p>

            <p className="mt-2 text-sm text-blue-200">
              Add the corresponding PNG image to the public images folder.
            </p>
          </div>
        </div>
      )}

      {!imageFailed && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${imageClassName}`}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}