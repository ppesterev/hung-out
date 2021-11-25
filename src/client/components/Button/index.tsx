import classNames from "classnames";

import "./style.css";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {}

export default function Button({ className, children, ...restProps }: Props) {
  return (
    <button className={classNames("btn", className)} {...{ ...restProps }}>
      {children}
    </button>
  );
}
