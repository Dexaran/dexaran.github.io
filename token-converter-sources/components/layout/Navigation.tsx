import { usePathname } from "next/navigation";

import NavigationItem from "../atoms/NavigationItem";

const menuItems: Array<{ label: any; href: string }> = [
  {
    label: "Convert tokens",
    href: "/",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "ERC-223",
    href: "/erc-223",
  },
  {
    label: "View address tokens",
    href: "/address-tokens",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <ul className="hidden xl:flex items-center">
      {menuItems.map((menuItem, index) => {
        return (
          <li key={menuItem.label}>
            <NavigationItem
              id={menuItem.label}
              title={menuItem.label}
              href={menuItem.href}
              active={index === 0 ? pathname === menuItem.href : pathname.includes(menuItem.href)}
            />
          </li>
        );
      })}
    </ul>
  );
}
