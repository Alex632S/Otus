import { createReadStream, promises as fs } from 'node:fs';
import { Transform, pipeline } from 'node:stream';
import { promisify } from 'node:util';

const pipelineAsync = promisify(pipeline);

class TextProcessor {
  static #cleanText(text) {
    return text.replace(/[^a-zA-Zа-яА-Я\s]/g, ' ')
              .split(/\s+/)
              .filter(Boolean);
  }

  static createSplitAndFilterStream() {
    return new Transform({
      objectMode: true,
      transform(chunk, _, callback) {
        try {
          const words = TextProcessor.#cleanText(chunk.toString());
          this.push(words);
          callback();
        } catch (error) {
          callback(error);
        }
      }
    });
  }
}

class WordStatsCollector extends Transform {
  #wordCounts = new Map();
  #allWords = new Set();

  constructor() {
    super({ objectMode: true });
  }

  _transform(words, _, callback) {
    words.forEach(word => {
      this.#allWords.add(word);
      this.#wordCounts.set(word, (this.#wordCounts.get(word) || 0) + 1);
    });
    callback();
  }

  _flush(callback) {
    this.push({
      wordCounts: this.#wordCounts,
      allWords: this.#allWords
    });
    callback();
  }

  get stats() {
    return {
      wordCounts: this.#wordCounts,
      allWords: this.#allWords
    };
  }
}

async function processTextFile(inputFile, outputFile) {
  try {
    const collector = new WordStatsCollector();
    
    await pipelineAsync(
      createReadStream(inputFile, { encoding: 'utf8' }),
      TextProcessor.createSplitAndFilterStream(),
      collector
    );

    const sortedWords = [...collector.stats.allWords].sort();
    const resultVector = sortedWords.map(word => collector.stats.wordCounts.get(word));

    await fs.writeFile(outputFile, JSON.stringify(resultVector, null, 2));
    console.log(`Результат сохранен в ${outputFile}`);
    return { success: true, outputFile };
  } catch (error) {
    console.error(`Ошибка обработки файла: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function parseCliArgs() {
  const [input, output] = process.argv.slice(2);
  return {
    inputFile: input || 'input.txt',
    outputFile: output || 'output.json'
  };
}

async function main() {
  const { inputFile, outputFile } = parseCliArgs();
  await processTextFile(inputFile, outputFile);
}

main().catch(console.error);