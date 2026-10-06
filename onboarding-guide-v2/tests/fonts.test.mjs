import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const faces = [
  ["AECOMSans-Light.woff2", "300"],
  ["AECOMSans-Regular.woff2", "400"],
  ["AECOMSans-Bold.woff2", "700"],
  ["AECOMSans-XBold.woff2", "800"],
];

test("AECOM Sans webfont files exist and are registered", () => {
  for (const [file, weight] of faces) {
    assert.ok(fs.existsSync(path.join(root, "assets", "fonts", file)), file);
    assert.match(css, new RegExp(`url\\(["']?\\./assets/fonts/${file.replace(".", "\\.")}`));
    assert.match(css, new RegExp(`font-weight:\\s*${weight}`));
  }
  assert.match(css, /font-family:\s*["']AECOM Sans["']/);
  assert.match(css, /font-display:\s*swap/);
});

test("guide does not use synthesized numeric weights", () => {
  const numericWeights = [...css.matchAll(/font-weight:\s*(\d{3})/g)].map(match => Number(match[1]));
  const invalid = [...new Set(numericWeights.filter(weight => ![300, 400, 700, 800].includes(weight)))];
  assert.deepEqual(invalid, []);
});

test("root font stack uses AECOM Sans with system fallbacks", () => {
  assert.match(css, /font-family:\s*["']AECOM Sans["'],\s*Aptos,\s*["']Segoe UI["'],\s*Arial,\s*sans-serif/);
});
