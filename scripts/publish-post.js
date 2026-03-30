const fs = require("fs");
const path = require("path");
const readline = require("readline");

const POSTS_DIR = path.join(process.cwd(), "src", "blog", "posts");

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) fm[key.trim()] = rest.join(":").trim().replace(/^["']|["']$/g, "");
  });
  return fm;
}

function getDrafts() {
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "posts.11tydata.js")
    .filter((f) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const fm = parseFrontMatter(content);
      return fm.status === "draft";
    });
}

function publishFile(fileName) {
  const filePath = path.join(POSTS_DIR, fileName);
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(/^status:\s*draft/m, "status: published");
  if (updated === content) {
    console.error("Could not find  status: draft  in " + fileName);
    process.exit(1);
  }
  fs.writeFileSync(filePath, updated, "utf8");
  console.log("\nPublished: src/blog/posts/" + fileName);
  console.log("Run  npm run build  to include it in the site.\n");
}

const drafts = getDrafts();

if (drafts.length === 0) {
  console.log("\nNo draft posts found.\n");
  process.exit(0);
}

console.log("\n--- Publish a Draft ---\n");
drafts.forEach((f, i) => console.log("  " + (i + 1) + ". " + f));
console.log();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Enter number to publish (or q to quit): ", (answer) => {
  rl.close();
  if (answer.trim().toLowerCase() === "q") process.exit(0);
  const idx = parseInt(answer.trim(), 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= drafts.length) {
    console.error("Invalid selection.");
    process.exit(1);
  }
  publishFile(drafts[idx]);
});
