/**
 * One-off rebrand script: Lumora/Match → Habibar
 * Run: node scripts/rebrand-habibar.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipDirs = new Set(["node_modules", ".git", "dist", "build", ".gradle"]);
const exts = new Set([".js", ".jsx", ".html", ".json", ".txt", ".xml", ".md", ".mjs", ".ts"]);

const replacements = [
  ["LUMORA HOME", "HABIBAR"],
  ["Lumora Home", "Habibar"],
  ["LUMORA", "HABIBAR"],
  ["Lumora", "Habibar"],
  ["lumorahome", "habibar"],
  ["lumora-home", "habibar"],
  ["matchcolombia.co", "habibar.com"],
  ["hola@matchcolombia.co", "hola@habibar.com"],
  ["admin@matchcolombia.co", "admin@habibar.com"],
  ["@auth.lumorahome.app", "@auth.habibar.com"],
  ["co.matchcolombia.lumora", "com.habibar.app"],
  ["open-match-quiz", "open-habibar-quiz"],
  ["Match inteligente", "Cuestionario Habibar"],
  ["match inteligente", "cuestionario Habibar"],
  ["Iniciar match inteligente", "Iniciar cuestionario"],
  ["Empezar match inteligente", "Empezar cuestionario"],
  ["Mejor match", "Recomendados"],
  ["% match", "% encaje"],
  ["matchcolombia_", "habibar_"],
  ["lumora_onboarding", "habibar_onboarding"],
  ["lumora-chunk-reload", "habibar-chunk-reload"],
  ["matchcolombia-google-map", "habibar-google-map"],
  ["Tu match en 3 pasos", "Tu hogar en 3 pasos"],
  ["Lo nuestro", "Habibar"],
  ["#lumora-mark", "#habibar-mark"],
  ["url(#lumora-mark)", "url(#habibar-mark)"],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (exts.has(path.extname(name))) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}rebrand-habibar.mjs`)) continue;
  let text = readFileSync(file, "utf8");
  const orig = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== orig) {
    writeFileSync(file, text, "utf8");
    changed++;
    console.log("updated:", path.relative(root, file));
  }
}
console.log("Total:", changed);
