import "./style.css";

interface Props {
  className?: string;
  mistakes: string[];
  maxMistakes: number;
}

export default function MistakeCounter({
  className,
  mistakes,
  maxMistakes
}: Props) {
  const mistakeSlots: (string | null)[] = mistakes.concat(
    Array(Math.max(0, maxMistakes - mistakes.length)).fill(null)
  );

  return (
    <ul className={`mistakes ${className || ""}`}>
      {mistakeSlots.map((mistake) => {
        return (
          <li
            className={`mistakes__item ${
              mistake ? "mistakes__item--filled" : ""
            }`}
          >
            {mistake?.slice(0, 1) || "_"}
          </li>
        );
      })}
    </ul>
  );
}
