import { API_URL } from "../apiConfig";

export function resolveImageUrl(raw) {
  if (!raw) return "";

  const base = API_URL.replace(/\/api$/, "");
  const normalized = String(raw).replace(/\\/g, "/");
  const marker = "/wwwroot/images/";

  if (normalized.includes(marker)) {
    const fileName = normalized.split(marker).pop();
    return fileName ? `${base}/images/${fileName}` : "";
  }

  if (normalized.startsWith("data:") || normalized.startsWith("http")) {
    return normalized;
  }

  if (normalized.startsWith("/images/")) return `${base}${normalized}`;
  if (normalized.startsWith("images/")) return `${base}/${normalized}`;
  if (normalized.startsWith("/wwwroot/images/")) return `${base}${normalized.replace("/wwwroot", "")}`;
  if (normalized.startsWith("wwwroot/images/")) return `${base}/${normalized.replace("wwwroot/", "")}`;
  if (normalized.startsWith("/")) return `${base}${normalized}`;

  return `${base}/images/${normalized}`;
}
