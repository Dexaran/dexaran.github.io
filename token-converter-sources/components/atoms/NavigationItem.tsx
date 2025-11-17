import clsx from "clsx";
import Link from "next/link";

interface Props {
  href: string;
  title: string;
  active?: boolean;
  id?: string;
}
export default function NavigationItem({ href, title, active, id }: Props) {
  return (
    <span className="relative">
      <Link
        className={clsx(
          "px-3 py-5 duration-200 inline-flex",
          active
            ? "bg-navigation-active text-green shadow-green/60 text-shadow"
            : "hover:bg-navigation-hover hover:text-green hover:shadow-green/60 hover:text-shadow text-secondary-text",
        )}
        href={href}
      >
        {title}
      </Link>
    </span>
  );
}
