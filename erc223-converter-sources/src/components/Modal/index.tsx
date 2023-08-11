import React, { useEffect, useRef } from "react";
import ReactPortal from "./ReactPortal";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { manrope } from "@/pages";
import { ConverterIcons } from "../ConverterIcons";

export const Modal = ({ children, isOpen, handleClose, title }) => {
	const nodeRef = useRef(null);
	useEffect(() => {
		const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
		document.body.addEventListener("keydown", closeOnEscapeKey);
		return () => {
			document.body.removeEventListener("keydown", closeOnEscapeKey);
		};
	}, [handleClose]);

	return (
		<ReactPortal wrapperId="react-portal-modal-container">
			{ isOpen ? (
				<div
					className={clsx(styles.modal, manrope.className)}
					ref={nodeRef}
				>
					<div className={styles.modalContent}>
						<div className={styles.modalHeaderContainer}>
							<span className={styles.modalHeaderTitle}>
								{title}
							</span>
							<div className={styles.modalHeaderClose} onClick={handleClose}>
								<ConverterIcons name="close" fill="#C3D8D5" />
							</div>
						</div>

						{children}
					</div>
			</div>
		) : null }
		</ReactPortal>
	);
}
export default Modal;
