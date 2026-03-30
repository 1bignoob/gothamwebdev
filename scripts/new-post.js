const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  console.log("\n--- New Blog Post ---\n");

  const title = (await ask("Title: ")).trim();
  if (!title) { console.error("Title is required."); rl.close(); process.exit(1); }

  const slug = slugify(title);
  if (!slug) { console.error("Could not generate a valid slug."); rl.close(); process.exit(1); }

  const description = (await ask("Description (one sentence summary): ")).trim()
    || "Add a short summary of this article.";

  const tagsInput = (await ask("Tags (comma-separated, e.g. seo, web design): ")).trim();
  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : ["blog"];

  const publishAnswer = (await ask("Publish now? (y/n): ")).trim().toLowerCase();
  const status = publishAnswer === "y" || publishAnswer === "yes" ? "published" : "draft";

  rl.close();

  const today = new Date().toISOString().slice(0, 10);
  const fileName = slug + ".md";
  const outputDir = path.join(process.cwd(), "src", "blog", "posts");
  const outputPath = path.join(outputDir, fileName);

  if (fs.existsSync(outputPath)) {
    console.error("\nPost already exists: " + outputPath);
    process.exit(1);
  }

  const tagLines = tags.map((t) => "  - " + t).join("\n");
  const lines = [
    "---",
    'title: "' + title + '"',
    'description: "' + description + '"',
    "date: " + today,
    "author: Gotham Web Dev",
    "tags:\n" + tagLines,
    "status: " + status,
    "---",
    "",
    "Write your post here.",
    "",
  ];

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

  console.log("\nPost created: src/blog/posts/" + fileName);
  if (status === "draft") {
    console.log("Status: DRAFT — run  npm run publish-post  when ready to go live.\n");
  } else {
    console.log("Status: PUBLISHED — rebuild to include it in the site.\n");
  }
}

main().catch((err) => { console.error(err); rl.close(); process.exit(1); });
