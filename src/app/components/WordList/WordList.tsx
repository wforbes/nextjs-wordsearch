import { WordLocation } from "../../types/game";

type WordListProps = {
  words: WordLocation[];
};

export function WordList({ words }: WordListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Words to Find:</h2>
      <div className="flex flex-col gap-2" role="list">
        {words.map((item) => (
          <div
            key={item.word}
            role="listitem"
            data-testid="word-item"
            className={`${item.found ? "line-through text-gray-400" : ""}`}
          >
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
} 