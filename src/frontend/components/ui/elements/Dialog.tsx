'use client';

import { type ReactNode, useLayoutEffect, useId, useRef } from 'react';
import Button from '../inputs/Button';
import styles from './Interactive.module.css';

export default function Dialog({open, onClose, title, children, role = 'dialog', descriptionId}: {open: boolean; onClose: () => void; title: string; children: ReactNode; role?: 'dialog' | 'alertdialog'; descriptionId?: string}) {
    const ref = useRef<HTMLDialogElement>(null);
    const id = useId();
    useLayoutEffect(() => {
        const dialog = ref.current;
        if (open && !dialog?.open) {dialog?.showModal();}
        if (!open && dialog?.open) {dialog.close();}
        return () => {if (dialog?.open) {dialog.close();}};
    }, [open]);
    return (
        <dialog
            ref={ref}
            role={role}
            aria-modal={open}
            aria-describedby={descriptionId}
            aria-labelledby={id}
            className={styles.dialog}
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}
            onClick={event => {
                if (event.target === event.currentTarget) {onClose();}
            }}
        >
            <div className={styles.dialogInner}>
                <div className={styles.dialogHeader}>
                    <h2 id={id}>{title}</h2>
                    <Button simple iconOnly bsicon="bi-x-lg" aria-label="Close dialog" onClick={onClose} />
                </div>
                {children}
            </div>
        </dialog>
    );
}
