'use client';

import { type ReactNode, useId } from 'react';
import Button from '../inputs/Button';
import styles from './Dialog.module.css';

// A modal for forms. Notices and confirmations use `showAlert`/`showConfirm` instead.
// Render it while open and unmount it to close; Escape and the close button call `onClose`.
export default function Dialog({title, onClose, children}: {title: string; onClose: () => void; children: ReactNode}) {
    const titleId = useId();

    return (
        <dialog ref={dialog => {if (dialog && !dialog.open) {dialog.showModal();}}} className={styles.dialog} aria-labelledby={titleId} onCancel={event => {event.preventDefault(); onClose();}}>
            <header className={styles.header}>
                <h2 id={titleId}>{title}</h2>
                <Button simple iconOnly bsicon="bi-x-lg" aria-label="Close" onClick={onClose} />
            </header>
            {children}
        </dialog>
    );
}
