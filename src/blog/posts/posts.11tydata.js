module.exports = {
  layout: "blog-post.njk",
  pageKey: "blog",
  navRoot: "../",
  eleventyComputed: {
    permalink: (data) => `/blog/${data.page.fileSlug}.html`,
    canonical: (data) => `${data.site.url}/blog/${data.page.fileSlug}.html`,
    ogType: "article",
    ogTitle: (data) => data.title,
    ogDescription: (data) => data.description,
    ogUrl: (data) => `${data.site.url}/blog/${data.page.fileSlug}.html`,
    twitterCard: "summary_large_image",
    twitterTitle: (data) => data.title,
    twitterDescription: (data) => data.description,
    breadcrumbs: (data) => [
      { label: "Home", href: "index.html" },
      { label: "Blog", href: "blog/" },
      { label: data.title },
    ],
  },
};
