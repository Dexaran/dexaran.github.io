import React, { useEffect, useRef } from "react";
import ReactPortal from "./ReactPortal";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { manrope } from "@/pages";
import { Icons } from "../Icons";

export const Modal = ({
  children,
  isOpen,
  handleClose,
  title,
  large,
  id = "react-portal-modal-container",
}: {
  children: any;
  isOpen: boolean;
  handleClose: any;
  title?: string;
  large?: boolean;
  id?: string;
}) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  return (
    <ReactPortal wrapperId={id}>
      {isOpen ? (
        <div className={clsx(manrope.className, styles.modal)} ref={nodeRef}>
          <div className={clsx(styles.modalContent, large && styles.large)}>
            <div
              className={clsx(
                styles.modalHeaderContainer,
                !title && styles.modalHeaderWithoutTitle,
              )}
            >
              <span className={styles.modalHeaderTitle}>{title}</span>
              <div className={styles.modalHeaderClose} onClick={handleClose}>
                <Icons name="close" fill="#C3D8D5" />
              </div>
            </div>

            {children}
          </div>
        </div>
      ) : null}
    </ReactPortal>
  );
};
export default Modal;
