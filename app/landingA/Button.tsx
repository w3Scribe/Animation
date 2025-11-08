import type { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  icon?: boolean;
  style?: "primary" | "secondary";
  cursor?: "pointer" | "default";
}

const Button: FC<ButtonProps> = (props) => {
  const { className, icon, style = "primary", cursor, children } = props;

  const btnStyleClassName =
    style === "secondary"
      ? "text-green-600 outline outline-1 outline-green-600 bg-transparent"
      : "bg-green-600 text-white";

  const base = "capitalize rounded-full items-center font-medium px-4 py-1.5";
  const cursorClass = cursor ? `cursor-${cursor}` : "";

  return (
    <button
      type="button"
      className={twMerge(
        icon ? "flex gap-2" : "",
        base,
        btnStyleClassName,
        cursorClass,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
