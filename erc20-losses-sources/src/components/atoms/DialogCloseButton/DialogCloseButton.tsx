import React from "react";

import Svg from "../Svg/Svg";
import styles from "./DialogCloseButton.module.scss";

interface Props {
  handleClose: any;
}

export default function DialogCloseButton({ handleClose }: Props) {
  return (
    <button className={styles.closeButton} onClick={handleClose}>
      <Svg iconName="close" />
    </button>
  );
}
