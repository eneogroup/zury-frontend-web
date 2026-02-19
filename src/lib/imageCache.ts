// Cache d'images en mémoire pour éviter les rechargements
const imageCache = new Map<string, boolean>();

export const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      imageCache.set(src, true);
      resolve();
    };
    img.onerror = reject;
  });
};

export const preloadImages = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.map(preloadImage));
};

export const isImageCached = (src: string): boolean => {
  return imageCache.has(src);
};