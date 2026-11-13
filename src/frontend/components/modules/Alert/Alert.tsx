'use client';

import { type ReactNode, useId, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import AlertIcon from './AlertIcon';
import Button from '@frontend/components/ui/inputs/Button';
import styles from './Alert.module.css';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertRequest {
    id: number;
    type: AlertType;
    title: string;
    content: ReactNode;
    confirmLabel?: string;
    resolve: (confirmed: boolean) => void;
}

const listeners = new Set<() => void>();
let requests: AlertRequest[] = [];
let nextId = 0;

function notify() {
    listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {listeners.delete(listener);};
}

function getSnapshot() {
    return requests[0] ?? null;
}

function getServerSnapshot() {
    return null;
}

function enqueueAlert(type: AlertType, title: string, content: ReactNode, confirmLabel?: string): Promise<boolean> {
    if (typeof window === 'undefined') {throw new Error('Alert dialogs must be shown in the browser.');}
    return new Promise(resolve => {
        requests = [...requests, {id: nextId++, type, title, content, confirmLabel, resolve}];
        notify();
    });
}

export function showAlert(type: AlertType, title: string, content: ReactNode): Promise<void> {
    return enqueueAlert(type, title, content).then(() => undefined);
}

export function showConfirm(title: string, content: ReactNode, confirmLabel = 'Confirm'): Promise<boolean> {
    return enqueueAlert('warning', title, content, confirmLabel);
}

function dismiss(request: AlertRequest, confirmed = false) {
    if (requests[0] !== request) {return;}
    requests = requests.slice(1);
    notify();
    request.resolve(confirmed);
}

function AlertBox({request}: {request: AlertRequest}) {
    const ref = useRef<HTMLDialogElement>(null);
    const actions = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const contentId = useId();
    const close = () => dismiss(request);
    const confirming = request.confirmLabel !== undefined;
    useLayoutEffect(() => {
        const alert = ref.current;
        if (!alert) {return;}
        alert.showModal();
        actions.current?.querySelector('button')?.focus();
        return () => {if (alert.open) {alert.close();}};
    }, []);
    return (
        <dialog
            ref={ref}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={contentId}
            className={styles.alert}
            data-type={request.type}
            onKeyDown={event => {
                if (event.key !== 'Tab' || event.defaultPrevented) {return;}
                const candidates = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]');
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
                close();
            }}
            onClick={event => {
                if (event.target === event.currentTarget) {close();}
            }}
        >
            <div className={styles.inner}>
                <div className={styles.header}>
                    <Button simple iconOnly bsicon="bi-x-lg" aria-label="Close alert" onClick={close} />
                </div>
                <div className={styles.message}>
                    <AlertIcon type={request.type} />
                    <div id={titleId} className={styles.title}>{request.title}</div>
                    <div id={contentId} className={styles.content}>{request.content}</div>
                </div>
                <div ref={actions} className={styles.actions}>
                    {confirming && <Button simple onClick={close}>Cancel</Button>}
                    <Button filled simple wide={!confirming} onClick={() => dismiss(request, true)}>{request.confirmLabel ?? 'OK'}</Button>
                </div>
            </div>
        </dialog>
    );
}

export default function AlertHost() {
    const request = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    // Key each request so queued alerts get a fresh native focus lifecycle.
    return request ? <AlertBox key={request.id} request={request} /> : null;
}
