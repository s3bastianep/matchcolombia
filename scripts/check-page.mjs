import { chromium } from "playwright";

const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(`PAGE: ${e.message}`));
p.on("console", (m) => {
  if (m.type() === "error") errs.push(`CON: ${m.text().slice(0, 400)}`);
});

for (const url of ["http://localhost:5173/", "http://localhost:4173/"]) {
  errs.length = 0;
  try {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await p.waitForTimeout(5000);
    const text = await p.evaluate(() => document.body?.innerText?.trim().slice(0, 150) || "EMPTY");
    const rootHtml = await p.evaluate(() => document.getElementById("root")?.innerHTML?.length || 0);
    console.log("---", url);
    console.log("root_children_len:", rootHtml);
    console.log("body:", text.replace(/\s+/g, " "));
    console.log("errors:", errs);
  } catch (e) {
    console.log("---", url, "FAIL:", e.message);
  }
}

await b.close();
