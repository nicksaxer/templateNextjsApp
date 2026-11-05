'use client';

import { useEffect, useRef, useState } from 'react';
import Card from '@frontend/components/ui/elements/Card';
import Alert from '@frontend/components/ui/elements/Alert';
import Badge from '@frontend/components/ui/elements/Badge';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import LoadingIndicator from '@frontend/components/ui/elements/LoadingIndicator';
import Skeleton from '@frontend/components/ui/elements/Skeleton';
import Progress from '@frontend/components/ui/elements/Progress';
import HLine from '@frontend/components/ui/elements/HLine';
import Button from '@frontend/components/ui/inputs/Button';
import delay from '@frontend/utils/delay';
import styles from './Showcase.module.css';

export default function FeedbackShowcase() {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState(0);
    const controller = useRef<AbortController | null>(null);
    useEffect(() => () => controller.current?.abort(), []);
    async function reload() {
        controller.current?.abort();
        controller.current = new AbortController();
        setLoading(true);
        setLoaded(false);
        try {
            await delay(1400, controller.current.signal);
            setLoaded(true);
        } catch {
            return;
        } finally {
            setLoading(false);
        }
    }
    return (
        <section id="feedback" className={styles.section}>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.eyebrow}>02 / A LITTLE REASSURANCE</span>
                    <h2>Keep everyone in the loop.</h2>
                    <p>For the waiting, the celebrating, and the occasional wrong turn.</p>
                </div>
                <Badge tone="success">Feedback & states</Badge>
            </div>
            <div className={styles.twoColumns}>
                <Card title="A message at the right moment">
                    <div className={styles.stack}>
                        <Alert tone="success" title="You’re all set.">
                            Your changes have found their home.
                        </Alert>
                        <Alert tone="info" title="A little heads-up.">
                            Your workspace has a few new possibilities.
                        </Alert>
                        <Alert tone="warning" title="One thing before you go.">
                            There are a couple of unsaved changes.
                        </Alert>
                        <Alert tone="danger" title="That didn’t quite work.">
                            Take a breath and give it another try.
                        </Alert>
                        <div className={styles.buttonRow}>
                            <Badge tone="success">Active</Badge>
                            <Badge>In progress</Badge>
                            <Badge tone="warning">Needs attention</Badge>
                            <Badge tone="danger">Offline</Badge>
                        </div>
                    </div>
                </Card>
                <div className={styles.stack}>
                    <Card
                        title="Worth the little wait"
                        action={
                            <Button simple bsicon="bi-arrow-clockwise" disabled={loading} onClick={reload}>
                                Try loading
                            </Button>
                        }
                    >
                        {loading ? (
                            <div aria-busy="true">
                                <LoadingIndicator label="Getting things ready…" delay={false} />
                                <Skeleton />
                            </div>
                        ) : loaded ? (
                            <Alert tone="success" title="Everything is up to date.">
                                Good things come to those who wait.
                            </Alert>
                        ) : (
                            <>
                                <LoadingIndicator label="A moment of calm…" delay={false} />
                                <Skeleton lines={2} />
                            </>
                        )}
                        <HLine />
                        <Progress label="Your next milestone" value={loaded ? 100 : loading ? 42 : 68} />
                    </Card>
                    <Card>
                        {items ? (
                            <div className={styles.addedItem}>
                                <span className={styles.itemIcon}>✦</span>
                                <div>
                                    <strong>Your first little idea</strong>
                                    <p>A good place to begin.</p>
                                </div>
                                <Button simple iconOnly bsicon="bi-trash3" aria-label="Remove idea" onClick={() => setItems(0)} />
                            </div>
                        ) : (
                            <EmptyState
                                title="Room for something good"
                                action={
                                    <Button bsicon="bi-plus-lg" onClick={() => setItems(1)}>
                                        Add an idea
                                    </Button>
                                }
                            >
                                Your first idea could be the start of it all.
                            </EmptyState>
                        )}
                    </Card>
                </div>
            </div>
        </section>
    );
}
