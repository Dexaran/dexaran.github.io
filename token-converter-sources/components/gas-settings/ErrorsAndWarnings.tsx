import React from "react";

import Alert from "../atoms/Alert";

export default function ErrorsAndWarnings({
  errors,
  warnings,
}: {
  errors?: string[];
  warnings?: string[];
}) {
  return (
    <>
      {(!!errors?.length || !!warnings?.length) && (
        <div className="flex flex-col gap-5 mt-4">
          {errors?.map((err) => (
            <Alert key={err} text={err} type="error" />
          ))}
          {warnings?.map((war) => (
            <Alert key={war} text={war} type="warning" />
          ))}
        </div>
      )}
    </>
  );
}
