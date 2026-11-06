'use client';

import { type ReactNode, useId, useSyncExternalStore } from 'react';
import Dialog from '@frontend/components/ui/elements/Dialog';
import AlertIcon from './AlertIcon';
import Button from '@frontend/components/ui/inputs/Button';
import styles from './Alert.module.css';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertRequest {
    id: number;
    type: AlertType;
    title: string;
    content: ReactNode;
    resolve: () => void;
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

export function showAlert(type: AlertType, title: string, content: ReactNode): Promise<void> {
    if (typeof window === 'undefined') {throw new Error('showAlert must be called in the browser.');}
    return new Promise(resolve => {
        requests = [...requests, {id: nextId++, type, title, content, resolve}];
        notify();
    });
}

function dismiss(request: AlertRequest) {
    if (requests[0] !== request) {return;}
    requests = requests.slice(1);
    notify();
    request.resolve();
}

function AlertBox({request}: {request: AlertRequest}) {
    const contentId = useId();
    return (
        <div className={styles.alert} data-type={request.type}>
            <Dialog open role="alertdialog" title={request.title} descriptionId={contentId} onClose={() => dismiss(request)}>
                <div className={styles.message}>
                    <AlertIcon type={request.type} />
                    <div id={contentId} className={styles.content}>{request.content}</div>
                </div>
                <div className={styles.actions}>
                    <Button filled autoFocus onClick={() => dismiss(request)}>OK</Button>
                </div>
            </Dialog>
        </div>
    );
}

export default function AlertHost() {
    const request = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    // Key each request so queued dialogs get a fresh native focus lifecycle.
    return request ? <AlertBox key={request.id} request={request} /> : null;
}
