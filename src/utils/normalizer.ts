export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'http://' + normalized;
  }
  return normalized;
}
