const fs = require("fs");
const zlib = require("zlib");

function decodeAscii85(input) {
  const clean = input.replace(/\s+/g, "").replace(/~>$/, "");
  const bytes = [];
  let chunk = [];

  for (const ch of clean) {
    if (ch === "z" && chunk.length === 0) {
      bytes.push(0, 0, 0, 0);
      continue;
    }
    const code = ch.charCodeAt(0);
    if (code < 33 || code > 117) continue;
    chunk.push(code - 33);
    if (chunk.length === 5) {
      let value = 0;
      for (const part of chunk) value = value * 85 + part;
      bytes.push((value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255);
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    const pad = 5 - chunk.length;
    while (chunk.length < 5) chunk.push(84);
    let value = 0;
    for (const part of chunk) value = value * 85 + part;
    const out = [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
    bytes.push(...out.slice(0, 4 - pad));
  }

  return Buffer.from(bytes);
}

function extractLiteralString(str, start) {
  let depth = 1;
  let i = start + 1;
  let out = "";
  while (i < str.length && depth > 0) {
    const ch = str[i];
    if (ch === "\\") {
      const next = str[i + 1];
      const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" };
      out += map[next] ?? next;
      i += 2;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth > 0) out += ch;
    i++;
  }
  return { text: out, end: i };
}

function decodePdfTextOperators(content) {
  let text = "";
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "(") {
      const { text: literal, end } = extractLiteralString(content, i);
      let j = end;
      while (/\s/.test(content[j] || "")) j++;
      const op2 = content.slice(j, j + 2);
      const op1 = content[j];
      if (op2 === "Tj" || op1 === "'" || op1 === "\"") {
        text += literal;
        if (op2 === "Tj") {
          i = j + 1;
        } else {
          text += "\n";
          i = j;
        }
      } else {
        i = end - 1;
      }
    } else if (content[i] === "[" && content.slice(i).match(/^\[(.|\n|\r)*?\]\s*TJ/)) {
      const endBracket = content.indexOf("]", i);
      const segment = content.slice(i + 1, endBracket);
      const matches = [...segment.matchAll(/\((?:\\.|[^\\)])*\)/g)];
      for (const match of matches) {
        const lit = match[0];
        const { text: literal } = extractLiteralString(lit, 0);
        text += literal;
      }
      i = endBracket + 2;
    } else if (content.slice(i, i + 2) === "Td" || content.slice(i, i + 2) === "TD" || content[i] === "T*") {
      text += "\n";
    }
  }
  return text;
}

const file = process.argv[2];
const raw = fs.readFileSync(file, "latin1");
const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
const pages = [];
let match;

while ((match = streamRegex.exec(raw))) {
  try {
    const decoded85 = decodeAscii85(match[1]);
    const inflated = zlib.inflateSync(decoded85).toString("latin1");
    if (inflated.includes("BT") && inflated.includes("ET")) {
      const extracted = decodePdfTextOperators(inflated)
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (extracted) pages.push(extracted);
    }
  } catch {
    // Ignore non-text streams.
  }
}

console.log(pages.map((page, index) => `--- PAGE ${index + 1} ---\n${page}`).join("\n\n"));

