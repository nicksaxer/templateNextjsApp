'use client';

import { useEffect, useRef, useState } from 'react';
import Card from '@frontend/components/ui/elements/Card';
import Alert from '@frontend/components/ui/elements/Alert';
import Badge from '@frontend/components/ui/elements/Badge';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import ErrorMessage from '@frontend/components/ui/elements/ErrorMessage';
import InfoBox from '@frontend/components/ui/elements/InfoBox';
import LoadingIndicator from '@frontend/components/ui/elements/LoadingIndicator';
import Skeleton from '@frontend/components/ui/elements/Skeleton';
import Progress from '@frontend/components/ui/elements/Progress';
import HLine from '@frontend/components/ui/elements/HLine';
import Button from '@frontend/components/ui/inputs/Button';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import delay from '@frontend/utils/delay';
import { showAlert } from '@frontend/components/modules/Alert';
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
                    <h3>Alert</h3>
                    <Alert tone="info">Information message</Alert>
                    <Alert tone="success">Success message</Alert>
                    <Alert tone="warning">Warning message</Alert>
                    <Alert tone="danger">Error message</Alert>
                    <h3>Alert dialog</h3>
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
                </div>
                <div className={styles.example}>
                    <h3>Card & empty state</h3>
                    <Card title="Example card">
                        {items ? <div className={styles.row}><span>Example item</span><Button simple onClick={() => setItems(0)}>Remove item</Button></div> : <EmptyState title="No items" action={<Button onClick={() => setItems(1)}>Add item</Button>}>Example empty state.</EmptyState>}
                    </Card>
                </div>
            </div>
        </section>
    );
}
