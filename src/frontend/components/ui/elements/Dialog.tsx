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
            onKeyDown={event => {
                if (event.key !== 'Tab' || event.defaultPrevented) {return;}
                const dialog = event.currentTarget;
                const candidates = dialog.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]');
                const controls = [...candidates].filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && !node.closest('[inert], [hidden]') && node.getClientRects().length > 0);
                const first = controls[0];
                const last = controls.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }}
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
