const fs = require("fs");
const path = require("path");

async function tree(directory, depth, currentDepth = 0, prefix = "") {
  if (currentDepth > depth) return;

  try {
    const files = await fs.promises.readdir(directory);
    const stats = await Promise.all(
      files.map((file) => fs.promises.stat(path.join(directory, file))),
    );

    let fileCount = 0;
    let dirCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stat = stats[i];
      const isLast = i === files.length - 1;
      const newPrefix = prefix + (isLast ? "    " : "│   ");

      if (stat.isDirectory()) {
        dirCount++;
        console.log(`${prefix}${isLast ? "└── " : "├── "}${file}`);

        await tree(
          path.join(directory, file),
          depth,
          currentDepth + 1,
          newPrefix,
        );
      } else {
        fileCount++;
        console.log(`${prefix}${isLast ? "└── " : "├── "}${file}`);
      }
    }

    return { dirCount, fileCount };
  } catch (err) {
    console.error(`Error reading directory: ${directory}`);
    console.error(err);
    return { dirCount: 0, fileCount: 0 };
  }
}

async function main() {
  const args = process.argv.slice(2);
  let directory = ".";
  let depth = Infinity;

  // Парсинг аргументов
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--depth" || arg === "-d") {
      depth = parseInt(args[i + 1], 10);
      i++;
    } else if (!arg.startsWith("-")) {
      directory = arg;
    }
  }

  console.log(directory);
  const result = await tree(directory, depth);
  console.log(`\n${result.dirCount} directories, ${result.fileCount} files`);
}

main().catch((err) => console.error(err));
