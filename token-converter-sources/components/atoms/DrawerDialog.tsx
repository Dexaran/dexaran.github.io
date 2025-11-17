import React, { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";
import { useSwipeable } from "react-swipeable";

import Dialog from "./Dialog";
import Drawer from "./Drawer";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export default function DrawerDialog({ isOpen, children, setIsOpen }: PropsWithChildren<Props>) {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const handlers = useSwipeable({
    onSwipedDown: (eventData) => {
      setIsOpen(false);
    },
    delta: { down: 200 },
  });

  return (
    <>
      {isMobile ? (
        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
          {children}
        </Drawer>
      ) : (
        <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
          {children}
        </Dialog>
      )}
    </>
  );
}
