import clsx from "clsx";
import React, { ReactNode } from "react";

import DialogCloseButton from "@/components/atoms/DialogCloseButton";
import IconButton from "@/components/atoms/IconButton";
import Svg from "@/components/atoms/Svg";

import styles from "./DialogHeader.module.scss";

interface Props {
  onClose: () => void;
  title: string;
  paragraph?: string | ReactNode;
  onBack?: () => void;
}

export default function DialogHeader({ onClose, title, paragraph, onBack }: Props) {
  return (
    <div className={clsx(styles.dialogHeader, onBack && styles.withBack)}>
      <div className={styles.topContent}>
        {onBack && (
          <IconButton variant="default" onClick={onBack}>
            <Svg iconName="back" />
          </IconButton>
        )}
        <h2 className={styles.title}>{title}</h2>
        <DialogCloseButton handleClose={onClose} />
      </div>

      {paragraph && <p className={styles.paragraphText}>{paragraph}</p>}
    </div>
  );
}
