'use client';

import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import Card from '@frontend/components/ui/elements/Card';
import Dialog from '@frontend/components/ui/elements/Dialog';
import AlertBadge from '@frontend/components/ui/elements/AlertBadge';
import Badge from '@frontend/components/ui/elements/Badge';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import ErrorMessage from '@frontend/components/ui/elements/ErrorMessage';
import InfoBox from '@frontend/components/ui/elements/InfoBox';
import LoadingIndicator from '@frontend/components/ui/elements/LoadingIndicator';
import Skeleton from '@frontend/components/ui/elements/Skeleton';
import Progress from '@frontend/components/ui/elements/Progress';
import HLine from '@frontend/components/ui/elements/HLine';
import Icon from '@frontend/components/ui/elements/Icon';
import ProfilePicture from '@frontend/components/ui/elements/ProfilePicture';
import Button from '@frontend/components/ui/inputs/Button';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import delay from '@frontend/utils/delay';
import { showAlert, showConfirm } from '@frontend/components/modules/Alert';
import { formatCurrency, formatDate } from '@frontend/utils/format';
import styles from './Showcase.module.css';

export default function FeedbackShowcase() {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState(0);
    const [progress, setProgress] = useState(40);
    const [alertStatus, setAlertStatus] = useState('');
    const [alertTitle, setAlertTitle] = useState('Example alert');
    const [alertContent, setAlertContent] = useState('Example alert message.');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogName, setDialogName] = useState('');
    const controller = useRef<AbortController | null>(null);
    useEffect(() => () => controller.current?.abort(), []);
    async function reload() {
        controller.current = new AbortController();
        setLoading(true);
        setLoaded(false);
        try {await delay(1400, controller.current.signal); setLoaded(true);}
        catch {return;}
        finally {setLoading(false);}
    }
    function saveDialog(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setDialogName(String(new FormData(event.currentTarget).get('name') ?? ''));
        setDialogOpen(false);
    }
    return (
        <section id="feedback" className={styles.section}>
            <h2>UI elements</h2>
            <div className={styles.examples}>
                <div className={styles.example}>
                    <h3>InfoBox</h3>
                    <span>Hover or focus the icon <InfoBox>Example information tooltip.</InfoBox></span>
                    <h3>ErrorMessage</h3>
                    <ErrorMessage>Example error message.</ErrorMessage>
                    <h3>LoadingIndicator</h3>
                    <LoadingIndicator compact delay={false} />
                    <Button simple disabled={loading} onClick={reload}>Try loading</Button>
                    {loading && <LoadingIndicator compact label="Loading example" delay={false} />}
                    {loaded && <p role="status">Loading complete.</p>}
                    <h3>HLine</h3>
                    <HLine>Divider label</HLine>
                </div>
                <div className={styles.example}>
                    <h3>Alert badge</h3>
                    <AlertBadge tone="info">Information message</AlertBadge>
                    <AlertBadge tone="success">Success message</AlertBadge>
                    <AlertBadge tone="warning">Warning message</AlertBadge>
                    <AlertBadge tone="danger">Error message</AlertBadge>
                    <h3>Alert modal</h3>
                    <TextInput label="Alert title" value={alertTitle} onChange={event => setAlertTitle(event.target.value)} />
                    <TextArea label="Alert content" value={alertContent} onChange={event => setAlertContent(event.target.value)} />
                    <div className={styles.buttonRow}>
                        {(['info', 'warning', 'error', 'success'] as const).map(type => (
                            <Button key={type} onClick={async () => {
                                setAlertStatus('');
                                await showAlert(type, alertTitle, alertContent);
                                setAlertStatus(`${type[0].toUpperCase()}${type.slice(1)} alert dismissed.`);
                            }}>Show {type} alert</Button>
                        ))}
                        <Button simple onClick={async () => {
                            setAlertStatus('');
                            const first = showAlert('info', 'First alert', 'First queued message.');
                            const second = showAlert('success', 'Second alert', 'Second queued message.');
                            await Promise.all([first, second]);
                            setAlertStatus('Both alerts dismissed.');
                        }}>Show queued alerts</Button>
                    </div>
                    <span role="status">{alertStatus}</span>
                    <h3>Badge</h3>
                    <div className={styles.buttonRow}><Badge>Info</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="danger">Error</Badge></div>
                </div>
                <div className={styles.example}>
                    <h3>Skeleton & progress</h3>
                    <Skeleton lines={3} />
                    <Progress label="Example progress" value={progress} />
                    <label>Progress value <input aria-label="Progress value" type="range" min="0" max="100" value={progress} onChange={event => setProgress(Number(event.target.value))} /></label>
                    <h3>Formatting</h3>
                    <p>{formatCurrency(1234.5)}</p>
                    <p>{formatDate('2026-01-15T12:00:00.000Z')}</p>
                    <h3>ProfilePicture</h3>
                    <div className={styles.row}>
                        <ProfilePicture src="/favicon.ico" alt="Template icon" size={48} />
                        <ProfilePicture alt="Default profile picture" size={48} />
                    </div>
                </div>
                <div className={styles.example}>
                    <h3>Card & empty state</h3>
                    <Card title="Example card">
                        {items ? (
                            <div className={styles.row}>
                                <span>Example item</span>
                                <Button simple onClick={async () => {
                                    if (await showConfirm('Remove item?', 'Remove the example item from this card.', 'Remove')) {setItems(0);}
                                }}>Remove item</Button>
                            </div>
                        ) : <EmptyState title="No items" icon={<Icon name="box-seam" />} action={<Button onClick={() => setItems(1)}>Add item</Button>}>Example empty state.</EmptyState>}
                    </Card>
                    <h3>Dialog</h3>
                    <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
                    <p role="status">{dialogName ? `Saved name: ${dialogName}` : 'No name saved yet.'}</p>
                    {dialogOpen && (
                        <Dialog title="Example dialog" onClose={() => setDialogOpen(false)}>
                            <form onSubmit={saveDialog} className={styles.dialogForm}>
                                <TextInput label="Name" name="name" defaultValue={dialogName} required />
                                <div className={styles.buttonRow}>
                                    <Button type="submit" filled>Save</Button>
                                    <Button simple onClick={() => setDialogOpen(false)}>Cancel</Button>
                                </div>
                            </form>
                        </Dialog>
                    )}
                </div>
            </div>
        </section>
    );
}
