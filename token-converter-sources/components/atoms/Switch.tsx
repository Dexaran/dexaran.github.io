import clsx from "clsx";
import { ChangeEvent } from "react";

enum ThemeColors {
  GREEN,
  PURPLE,
}

interface Props {
  checked: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  small?: boolean;
  disabled?: boolean;
  colorScheme?: ThemeColors;
}

export default function Switch({
  checked,
  handleChange,
  small = false,
  disabled = false,
  colorScheme = ThemeColors.GREEN,
}: Props) {
  return (
    <label className={clsx("relative inline-block w-12 h-6")}>
      <input
        className="peer appearance-none"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        type="checkbox"
      />
      <span
        className={clsx(
          `
          bg-secondary-bg
                      absolute
                      cursor-pointer
                      w-full
                      h-full
                      top-0
                      bottom-0
                      right-0
                      left-0
                      duration-200
                      peer-checked:hover:shadow
                      border-primary-border
                      border
                      rounded-5
                      peer-checked:before:translate-x-6
                      before:content-['']
                      before:absolute
                      before:top-[2px]
                      before:left-[2px]
                      before:h-[18px]
                      before:w-[18px]
                      before:bg-primary-border
                      before:rounded-full
                      before:duration-200
                  `,
          {
            [ThemeColors.GREEN]:
              "peer-hover:before:bg-green peer-checked:before:bg-green peer-hover:border-green peer-checked:border-green peer-checked:bg-green-bg peer-checked:hover:shadow-green/60",
            [ThemeColors.PURPLE]:
              "peer-hover:before:bg-purple peer-checked:before:bg-purple peer-hover:border-purple peer-checked:border-purple peer-checked:bg-purple-bg peer-checked:hover:shadow-purple/60",
          }[colorScheme],
        )}
      />
    </label>
  );
}
