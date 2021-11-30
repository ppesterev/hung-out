import Button from "../../Button";

import "./style.css";

interface Props {
  name: string;
  score: number;
  onLeave: () => void;
}

export default function UserInfo({ name, score, onLeave }: Props) {
  return (
    <div className="user-info">
      <span class="user-info__title">
        Playing as <span className="user-info__name">{name}</span>
      </span>
      <span class="user-info__score">Current score: {score}</span>
      <Button class="user-info__leave-btn" type="button" onClick={onLeave}>
        Leave
      </Button>
    </div>
  );
}
