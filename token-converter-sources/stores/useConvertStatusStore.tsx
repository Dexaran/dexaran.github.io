import { createOperationStatusStore } from "@/stores/factories/createOperationStatusStore";

export enum ConvertStatus {
  INITIAL,

  PENDING_APPROVE,
  LOADING_APPROVE,
  ERROR_APPROVE,

  PENDING_CONVERT,
  LOADING_CONVERT,
  ERROR_CONVERT,

  SUCCESS,
}

export enum ConvertError {
  OUT_OF_GAS,
  UNKNOWN,
}

export const useConvertStatusStore = createOperationStatusStore({
  initialStatus: ConvertStatus.INITIAL,
  operations: ["approve", "convert"],
  errorType: ConvertError.UNKNOWN,
});
