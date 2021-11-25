import classNames from "classnames";

import "./style.css";

const PART_COUNT = 7;

interface Props {
  mistakeCount: number;
}

export default function HangmanGraphic({ mistakeCount }: Props) {
  return (
    <div className="hangman-graphic">
      <div className="hangman-graphic__figure">
        {Array(PART_COUNT)
          .fill(null)
          .map((_, index) => {
            const imgUrl = new URL(
              `../../img/part${index + 1}.png`,
              import.meta.url
            ).href;

            return (
              <img
                className={classNames("hangman-graphic__part", {
                  "hangman-graphic__part--filled": index < mistakeCount
                })}
                src={imgUrl}
              />
            );
          })}
      </div>
    </div>
  );
}
