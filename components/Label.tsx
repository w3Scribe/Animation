import { twMerge } from "tailwind-merge";

interface ILabel {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<ILabel> = (a) => {
  const cssStyle = twMerge(a.className ?? " font-medium text-gray-700");

  return <span className={cssStyle}>{a.children}</span>;
};

export default Label;
