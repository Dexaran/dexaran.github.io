import { create } from "zustand";

export interface DialogStateStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function createDialogStateStore() {
  return create<DialogStateStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
  }));
}
