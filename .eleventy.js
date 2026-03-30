function normalizeBasePath(input) {
  if (!input || input === "/") {
    return "/";
  }

  const trimmed = String(input).trim();
  const noLeading = trimmed.replace(/^\/+/, "");
  const noTrailing = noLeading.replace(/\/+$/, "");
  return noTrailing ? `/${noTrailing}/` : "/";
}

module.exports = function (eleventyConfig) {
  const siteBase = normalizeBasePath(process.env.SITE_BASE || "/");

  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "site.webmanifest": "site.webmanifest" });
  eleventyConfig.addGlobalData("siteBase", siteBase);

  eleventyConfig.addFilter("blogDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/blog/posts/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  return {
    pathPrefix: siteBase,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
