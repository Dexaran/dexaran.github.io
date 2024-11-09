import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge, twMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["sm", "md", "lg", "xl", "2xl"],
      borderRadius: ["2", "3", "20"],
    },
    classGroups: {
      "font-size": [
        "text-8",
        "text-10",
        "text-12",
        "text-14",
        "text-16",
        "text-18",
        "text-20",
        "text-24",
        "text-32",
      ],
    },
  },
});

export function clsxMerge(...args: ClassValue[]) {
  return customTwMerge(clsx(args));
}
