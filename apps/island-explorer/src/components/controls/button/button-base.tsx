import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function ButtonBase({
  children,
  primary = false,
  ...props
}: React.PropsWithChildren<Props>) {
  const classNames = ["button"];
  if (primary) {
    classNames.push("primary");
  }

  return (
    <button {...props} className={classNames.join(" ")}>
      {children}
    </button>
  );
}

// export default Button;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  primary?: boolean;
}
