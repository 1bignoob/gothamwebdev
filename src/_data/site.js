function normalizeBasePath(input) {
  if (!input || input === "/") {
    return "/";
  }

  const trimmed = String(input).trim();
  const noLeading = trimmed.replace(/^\/+/, "");
  const noTrailing = noLeading.replace(/\/+$/, "");
  return noTrailing ? `/${noTrailing}/` : "/";
}

const basePath = normalizeBasePath(process.env.SITE_BASE || "/");
const origin = "https://www.gothamwebdev.com";

module.exports = {
  name: "Gotham Web Dev",
  url: origin,
  basePath,
  fullUrl: `${origin}${basePath === "/" ? "" : basePath.slice(0, -1)}`,
};
