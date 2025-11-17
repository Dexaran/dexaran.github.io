import { Formik } from "formik";
import { ChangeEvent, useRef, useState } from "react";
import { useConnect } from "wagmi";

import { keystore } from "@/config/connectors/keystore/connector";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";
import { unlockKeystore } from "@/utils/unlockKeystore";

import Button, { ButtonColor } from "../atoms/Button";
import DialogHeader from "../atoms/DialogHeader";
import DrawerDialog from "../atoms/DrawerDialog";
import Preloader from "../atoms/Preloader";
import Svg from "../atoms/Svg";
import TextField from "../atoms/TextField";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function KeystoreConnectDialog({ isOpen, setIsOpen }: Props) {
  const { setIsOpened: setConnectWalletDialogOpened } = useConnectWalletDialogStateStore();

  const fileInput = useRef<HTMLInputElement | null>(null);
  const { chainToConnect } = useConnectWalletStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [keystoreFile, setKeystore] = useState<{ [key: string]: string } | null>(null);
  const [isUnlockingKeystore, setIsUnlockingKeystore] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFileError(undefined);
    const file = event?.target?.files?.[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (e.target) {
            const fileContents: any = e.target.result;
            const parsedJson = JSON.parse(fileContents);
            setKeystore(parsedJson);
          }
        } catch (e) {
          setFileError("Unsupported file format");
        }
      };
      reader.readAsText(file);
    } else {
      setKeystore(null);
    }
  };

  const { connect } = useConnect();

  const importKeystoreFileHandler = async () => {
    setIsUnlockingKeystore(true);
    try {
      const result = await unlockKeystore(keystoreFile, password);
      const PK: any = result?.getPrivateKeyString && result?.getPrivateKeyString();

      if (PK) {
        const connector = keystore({ pk: PK });
        connect({ chainId: chainToConnect, connector });

        setIsOpen(false);
        setConnectWalletDialogOpened(false);
      } else {
        setError("Wrong password");
      }
    } catch (error) {
      console.log("importKeystoreFileHandler ~ error:", error);
      setError("Wrong password");
    } finally {
      setIsUnlockingKeystore(false);
    }
  };

  return (
    <DrawerDialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-[440px]">
        <DialogHeader onClose={() => setIsOpen(false)} title={"Import wallet with JSON file"} />

        <div className="card-spacing-x card-spacing-b">
          <Formik
            initialValues={{ name: "jared" }}
            onSubmit={(values, actions) => {
              importKeystoreFileHandler();
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e)}
                  style={{ display: "none" }}
                  ref={fileInput}
                />
                <div className="flex items-center justify-between rounded-3 bg-tertiary-bg p-5">
                  <div className="w-[120px]">
                    <Button
                      type="button"
                      onClick={() => {
                        if (fileInput.current && fileInput.current) {
                          fileInput.current.click();
                        }
                      }}
                      colorScheme={ButtonColor.LIGHT_GREEN}
                    >
                      Browse...
                    </Button>
                  </div>
                  <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-[200px] text-right">
                    {selectedFile?.name ? (
                      <span className="flex items-center gap-1">
                        <Svg className="text-tertiary-text flex-shrink-0" iconName="file" />
                        <span className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[172px] text-right">
                          {selectedFile?.name}
                        </span>
                      </span>
                    ) : (
                      <span className="text-secondary-text">Select keystore file</span>
                    )}
                  </p>
                </div>
                <div className="text-red-light text-12 mb-4 mt-0.5 h-4">
                  {fileError && fileError}
                </div>
                <div>
                  <TextField
                    disabled={!selectedFile || Boolean(fileError)}
                    label="Keystore password"
                    value={password}
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Keystore password"
                    error={error || undefined}
                    helperText={""}
                  />
                  <div className="mt-6">
                    <Button type="submit" disabled={!selectedFile || Boolean(fileError)} fullWidth>
                      {!isUnlockingKeystore ? "Unlock" : <Preloader size={30} type="awaiting" />}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </DrawerDialog>
  );
}
