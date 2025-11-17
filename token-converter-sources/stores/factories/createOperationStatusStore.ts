import { Address } from "viem";
import { create, StateCreator } from "zustand";

export function createOperationStatusStore<StatusEnum, ErrorEnum, Op extends string>({
  initialStatus,
  errorType,
  operations,
}: {
  initialStatus: StatusEnum;
  errorType: ErrorEnum;
  operations: Op[];
}) {
  type HashKeys = `${Op}Hash`;
  type SetterKeys = `set${Capitalize<Op>}Hash`;

  type HashFields = {
    [K in HashKeys]: Address | undefined;
  };

  type SetterFields = {
    [K in SetterKeys]: (hash: Address) => void;
  };

  type StaticStoreFields = {
    status: StatusEnum;
    errorType: ErrorEnum;
    setStatus: (status: StatusEnum) => void;
    setErrorType: (errorType: ErrorEnum) => void;
  };

  type Store = StaticStoreFields & HashFields & SetterFields;

  const storeCreator: StateCreator<Store, [], []> = (set, get) => {
    const hashFields = Object.fromEntries(
      operations.map((key) => [`${key}Hash`, undefined]),
    ) as HashFields;

    const hashSetters = Object.fromEntries(
      operations.map((key) => {
        const fnName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}Hash`;
        const fieldName = `${key}Hash`;
        const fn = (hash: Address) => set({ [fieldName]: hash } as Partial<Store>);
        return [fnName, fn];
      }),
    ) as SetterFields;

    const staticStoreFields: StaticStoreFields = {
      status: initialStatus,
      errorType,
      setStatus: (status) => {
        if (status === initialStatus) {
          set({ ...hashFields, status } as Partial<Store>);
        } else {
          set({ status } as Partial<Store>);
        }
      },
      setErrorType: (errorType) => set({ errorType } as Partial<Store>),
    };

    return {
      ...staticStoreFields,
      ...hashFields,
      ...hashSetters,
    };
  };

  return create<Store>(storeCreator);
}
