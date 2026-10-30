// Next 16 static export writes per-segment prefetch payloads as `__next.<seg>/__PAGE__.txt`,
// but the client router requests `__next.<seg>.__PAGE__.txt`. On a plain static host that 404s
// (prefetch only — navigation still works) and logs console errors. Write a flat copy next to each.
import { readdirSync, statSync, copyFileSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of readdirSync(p)) {
        if (statSync(join(p, f)).isFile()) copyFileSync(join(p, f), join(dir, `${name}.${f}`));
      }
    }
    walk(p);
  }
}

walk("out");
console.log("fix-export-prefetch: done");
