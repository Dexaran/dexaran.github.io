import { create } from "zustand";

interface GasModeStore {
  isAdvanced: boolean;
  setIsAdvanced: (isAdvanced: boolean) => void;
}

type GasModeData = Pick<GasModeStore, "isAdvanced">;

const initialGasMode: GasModeData = { isAdvanced: false };
export const createGasModeStore = (initialData: GasModeData = initialGasMode) =>
  create<GasModeStore>((set, get) => ({
    isAdvanced: initialData.isAdvanced,
    setIsAdvanced: (isAdvanced) => set({ isAdvanced }),
  }));
