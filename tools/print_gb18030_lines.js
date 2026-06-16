const fs = require("fs");
const path = require("path");

const [filePathArg, startArg, endArg] = process.argv.slice(2);

if (!filePathArg || !startArg) {
  console.error("Usage: node tools/print_gb18030_lines.js <filePath> <startLine> [endLine]");
  process.exit(2);
}

const filePath = path.resolve(process.cwd(), filePathArg);
const start = Number(startArg);
const end = Number(endArg || startArg);

if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
  console.error("Invalid line range");
  process.exit(2);
}

const decoder = new TextDecoder("gb18030");
const lines = decoder.decode(fs.readFileSync(filePath)).split(/\r?\n/);

for (let lineNumber = start; lineNumber <= Math.min(end, lines.length); lineNumber += 1) {
  console.log(`${String(lineNumber).padStart(4, " ")}: ${lines[lineNumber - 1]}`);
}
