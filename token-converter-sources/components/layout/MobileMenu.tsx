import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

import { IconName } from "@/types/IconName";
import { clsxMerge } from "@/utils/clsxMerge";

import Drawer from "../atoms/Drawer";
import IconButton, { IconButtonSize } from "../atoms/IconButton";
import Svg from "../atoms/Svg";
export function MobileLink({
  href,
  iconName,
  title,
  handleClose,
  isActive,
  disabled = false,
  className = "",
  linkClassName = "",
  handleClick,
  isMenu = false,
  isExternal = false,
}: {
  href: string;
  iconName: IconName;
  title: string;
  handleClose: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  linkClassName?: string;
  handleClick?: (e: any) => void;
  isMenu?: boolean;
  isExternal?: boolean;
}) {
  if (isExternal) {
    return (
      <a
        target="_blank"
        onClick={(e) => {
          if (handleClick) {
            handleClick(e);
          }

          handleClose();
        }}
        href={href}
        className={clsxMerge(
          "flex items-center gap-2 py-3 px-4 duration-200",
          !isActive && "hover:bg-quaternary-bg text-secondary-text",
          isActive && !isMenu && "text-green pointer-events-none",
          isActive && isMenu && "bg-navigation-active-mobile text-green pointer-events-none",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        <Svg iconName={iconName} />
        {title}
      </a>
    );
  }

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Link
        onClick={(e) => {
          if (handleClick) {
            handleClick(e);
          }

          handleClose();
        }}
        href={href}
        className={clsxMerge(
          "flex items-center gap-2 py-3 px-4 duration-200 flex-grow",
          !isActive && "hover:bg-quaternary-bg text-secondary-text",
          isActive && !isMenu && "text-green pointer-events-none",
          isActive && isMenu && "bg-navigation-active-mobile text-green pointer-events-none",
          disabled && "pointer-events-none opacity-50",
          linkClassName,
        )}
      >
        <Svg iconName={iconName} />
        {title}
      </Link>
    </div>
  );
}

const mobileLinks: {
  href: string;
  iconName: IconName;
  label: string;
}[] = [
  {
    label: "Convert tokens",
    href: "/",
    iconName: "swap",
  },
  {
    label: "How it works",
    href: "/how-it-works",
    iconName: "how-it-works",
  },
  {
    label: "ERC-223",
    href: "/erc-223",
    iconName: "erc-223",
  },
  {
    label: "View address tokens",
    href: "/address-tokens",
    iconName: "view-address-tokens",
  },
];

export default function MobileMenu() {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const pathname = usePathname();

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      setMobileMenuOpened(false);
    },
  });

  return (
    <div className="xl:hidden">
      <Drawer
        handlers={handlers}
        placement="left"
        isOpen={mobileMenuOpened}
        setIsOpen={setMobileMenuOpened}
      >
        <div className="flex flex-col justify-between h-full min-w-[300px]">
          <div className="py-6 grid gap-1">
            {[
              mobileLinks.map(({ href, iconName, label }, index) => {
                return (
                  <MobileLink
                    isMenu
                    key={href}
                    href={href}
                    iconName={iconName}
                    title={label}
                    handleClose={() => setMobileMenuOpened(false)}
                    isActive={index === 0 ? pathname === href : pathname.includes(href)}
                  />
                );
              }),
            ]}
          </div>
        </div>
      </Drawer>
      <IconButton
        buttonSize={IconButtonSize.LARGE}
        iconName="menu"
        onClick={() => setMobileMenuOpened(true)}
      />
    </div>
  );
}
