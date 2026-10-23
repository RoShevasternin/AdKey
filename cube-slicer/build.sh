#!/usr/bin/env sh
# Compiles src/game.jsx and inlines it into the page.
# Output: cube-slicer.html (Claude Artifact page) and index.html (standalone HTML).
set -e
cd "$(dirname "$0")"
ESBUILD="${ESBUILD:-npx --yes esbuild@0.24.0}"
$ESBUILD src/game.jsx --loader:.jsx=jsx --jsx-factory=React.createElement --jsx-fragment=React.Fragment --target=es2019 --minify --outfile=build.tmp.js
node -e '
const fs = require("fs");
const js = fs.readFileSync("build.tmp.js", "utf8").replace(/<\/script/gi, "<\\/script");
const page = fs.readFileSync("src/page.html", "utf8").replace("/*__GAME_JS__*/", () => js);
fs.writeFileSync("cube-slicer.html", page);
const head = "<!doctype html><html lang=\"uk\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\"></head><body>";
fs.writeFileSync("index.html", head + page + "</body></html>");
'
rm -f build.tmp.js
