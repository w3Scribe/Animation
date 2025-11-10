import { Maximize2, Minimize, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const BtnIcons = {
  X: X,
  maximize: Maximize2,
  minimize: Minimize,
};

// some required Buttons
interface IBtn {
  type: 'X' | 'maximize' | 'minimize';
  className?: string;
  zIndex?: number;
  size: number;
  ctrlBtn: () => void;
}

const Btn = ({ type, className, size, zIndex, ctrlBtn }: IBtn) => {
  const Icon = BtnIcons[type];

  return (
    <button
      className={twMerge(
        'absolute top-2 right-2 cursor-pointer',
        className,
        `z-[${zIndex}]`
      )}
      onClick={() => ctrlBtn()}
    >
      <Icon size={size ?? 16} />
    </button>
  );
};

export default Btn;
