const fs = require("fs");
const path = require("path");
const readline = require("readline");

function createPost(title) {
  title = title.trim();
  if (!title) { console.error("Title cannot be empty."); process.exit(1); }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (!slug) { console.error("Could not create a valid slug."); process.exit(1); }

  const today = new Date().toISOString().slice(0, 10);
  const fileName = slug + ".md";
  const outputDir = path.join(process.cwd(), "src", "blog", "posts");
  const outputPath = path.join(outputDir, fileName);

  if (fs.existsSync(outputPath)) {
    console.error("Post already exists: " + outputPath);
    process.exit(1);
  }

  const lines = [
    "---",
    'title: "' + title + '"',
    'description: "Add a short summary of this article."',
    "date: " + today,
    "author: Gotham Web Dev",
    "tags:",
    "  - blog",
    "draft: true",
    "---",
    "",
    "Write your post here.",
    ""
  ];

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
  console.log("\nPost created: src/blog/posts/" + fileName);
  console.log("Set  draft: false  in the front matter when ready to publish.\n");
}

const argTitle = process.argv.slice(2).join(" ").trim();
if (argTitle) {
  createPost(argTitle);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Post title: ", function(answer) { rl.close(); createPost(answer); });
}
