import { readFileSync } from "fs";

const WORDS_FILEPATH = "./words.txt";
let wordlist: string[] | null = null;

export const getWordlist: () => string[] = () => {
  if (wordlist) {
    return wordlist;
  }

  const words = readFileSync(WORDS_FILEPATH, { encoding: "utf-8" }).split(/\s/);
  wordlist = Array.from(new Set(words)).filter((word) => word.match(/\W/));
  return wordlist;
};
