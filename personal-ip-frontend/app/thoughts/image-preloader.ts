/**
 * Preload all images from thought data and return a Map of URL → aspect ratio (w/h).
 * This allows the column distributor to make accurate height estimates before DOM render.
 */
export async function preloadImages(
  imageUrls: string[],
): Promise<Map<string, number>> {
  const ratios = new Map<string, number>()
  if (imageUrls.length === 0) return ratios

  const promises = imageUrls.map(
    (url) =>
      new Promise<{ url: string; ratio: number }>((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve({ url, ratio: img.naturalWidth / img.naturalHeight })
        }
        img.onerror = () => {
          resolve({ url, ratio: 1.5 }) // fallback aspect ratio
        }
        img.src = url
      }),
  )

  const results = await Promise.all(promises)
  for (const { url, ratio } of results) {
    ratios.set(url, ratio)
  }
  return ratios
}
