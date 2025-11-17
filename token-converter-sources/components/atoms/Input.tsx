import clsx from "clsx";
import { ChangeEvent, forwardRef, InputHTMLAttributes, useRef } from "react";

import { ThemeColors } from "@/config/theme-colors.config";
import { clsxMerge } from "@/utils/clsxMerge";

import IconButton, { IconButtonVariant } from "./IconButton";
import Svg from "./Svg";

export enum InputSize {
  DEFAULT = 40,
  LARGE = 48,
}
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  isWarning?: boolean;
  inputSize?: InputSize;
  noCloseIcon?: boolean;
  colorScheme?: ThemeColors;
}

const inputSizeMap: Record<InputSize, string> = {
  [InputSize.DEFAULT]: "h-10 text-14 rounded-2",
  [InputSize.LARGE]: "h-12 text-16 rounded-2 md:rounded-3",
};

const Input = forwardRef<HTMLInputElement | null, Props>(function Input(
  {
    isError = false,
    isWarning = false,
    className,
    inputSize = InputSize.LARGE,
    colorScheme = ThemeColors.GREEN,
    ...props
  },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsxMerge(
        "duration-200 focus:outline-0 pl-4 md:pl-5 placeholder:text-tertiary-text w-full bg-secondary-bg border text-primary-text",
        inputSizeMap[inputSize],
        !isError &&
          !isWarning &&
          (colorScheme === ThemeColors.GREEN
            ? "border-transparent focus:shadow-[0px_0px_8px_0px] hover:shadow-[0px_0px_8px_0px] hover:shadow-green/60 focus:shadow-green focus:border-green"
            : "border-transparent focus:shadow-[0px_0px_8px_0px] hover:shadow-[0px_0px_8px_0px] hover:shadow-purple/60 focus:shadow-purple focus:border-purple"),
        isError &&
          "border-red-light focus:shadow-[0px_0px_8px_0px] hover:shadow-[0px_0px_8px_0px] hover:shadow-red-light-shadow/60 focus:shadow-red-light-shadow/60",
        isWarning &&
          "border-orange focus:shadow-[0px_0px_8px_0px] hover:shadow-[0px_0px_8px_0px] hover:shadow-orange/60 focus:shadow-orange/60",
        props.disabled && "opacity-50 pointer-events-none",
        props.readOnly && "pointer-events-none bg-primary-bg border-secondary-border",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;

export function SearchInput(props: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    if (props.onChange) {
      props.onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        className={clsxMerge("pr-12", props.className)}
        style={props.style ? props.style : { paddingRight: "2.5rem" }}
        ref={ref}
        {...props}
      />
      <span
        className={clsx(
          "absolute right-2 flex items-center justify-center h-full w-10 top-0",
          props.value === "" && "pointer-events-none",
        )}
      >
        {props.value === "" || ref.current?.value === "" || !!props.noCloseIcon ? (
          <Svg className="text-secondary-text" iconName="search" />
        ) : (
          <IconButton
            variant={IconButtonVariant.CLOSE}
            className="text-tertiary-text"
            handleClose={() => {
              handleClear();
              ref.current?.focus();
            }}
          />
        )}
      </span>
    </div>
  );
}

export function InputWithArrows(props: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleIncrement = () => {
    // if (props.onChange) {
    //   props.onChange({
    //     target: { value: +props.value + 1 },
    //   } as ChangeEvent<HTMLInputElement>);
    // }
  };

  const handleDecrement = () => {
    // if (props.onChange) {
    //   props.onChange({
    //     target: { value: props.value - 1 },
    //   } as ChangeEvent<HTMLInputElement>);
    // }
  };

  return (
    <div className="relative w-full">
      <Input
        className={clsxMerge("pr-12", props.className)}
        style={props.style ? props.style : { paddingRight: "2.5rem" }}
        ref={ref}
        {...props}
      />
      <span className={clsx("absolute right-2 flex items-center justify-center h-full w-10 top-0")}>
        <>
          <IconButton iconName="add" className="text-tertiary-text" onClick={handleIncrement} />
          <IconButton iconName="add" className="text-tertiary-text" onClick={handleDecrement} />
        </>
      </span>
    </div>
  );
}
