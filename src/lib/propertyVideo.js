/** URLs de video del inmueble (YouTube, Vimeo o archivo MP4). */

export function getPropertyVideos(property) {
  if (!property) return [];
  if (Array.isArray(property.videos) && property.videos.length) {
    return property.videos.map((v) => (typeof v === "string" ? v : v?.url)).filter(Boolean);
  }
  if (property.video_url) return [property.video_url];
  return [];
}

export function hasPropertyVideo(property) {
  return getPropertyVideos(property).length > 0;
}

export function parseVideoUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed) || trimmed.includes("videos.pexels.com")) {
    return { type: "file", src: trimmed };
  }

  return null;
}

export function normalizeVideoInput(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return [];
  return [trimmed];
}
