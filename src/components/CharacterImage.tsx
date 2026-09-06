"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CHARACTER_FALLBACK_IMAGE,
  characterRemoteImageUrl,
  getCharacterName,
} from "@/lib/constants";

type Props = {
  characterId: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function CharacterImage({
  characterId,
  className = "",
  priority,
  sizes = "50vw",
}: Props) {
  const remoteUrl = characterRemoteImageUrl(characterId);
  const [src, setSrc] = useState(
    () => remoteUrl ?? CHARACTER_FALLBACK_IMAGE,
  );
  const name = getCharacterName(characterId);

  useEffect(() => {
    setSrc(characterRemoteImageUrl(characterId) ?? CHARACTER_FALLBACK_IMAGE);
  }, [characterId]);

  return (
    <Image
      src={src}
      alt={name}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized
      className={`object-cover object-top ${className}`}
      onError={() => {
        if (src !== CHARACTER_FALLBACK_IMAGE) {
          setSrc(CHARACTER_FALLBACK_IMAGE);
        }
      }}
    />
  );
}
