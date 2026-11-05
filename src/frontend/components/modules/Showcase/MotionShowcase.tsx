'use client';

import { useState } from 'react';
import Card from '@frontend/components/ui/elements/Card';
import Badge from '@frontend/components/ui/elements/Badge';
import Accordion from '@frontend/components/ui/elements/Accordion';
import Dialog from '@frontend/components/ui/elements/Dialog';
import Tabs from '@frontend/components/ui/elements/Tabs';
import SlideDown from '@frontend/components/ui/animations/SlideDown';
import FadeIn from '@frontend/components/ui/animations/FadeIn';
import Button from '@frontend/components/ui/inputs/Button';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import styles from './Showcase.module.css';

export default function MotionShowcase() {
    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [replay, setReplay] = useState(0);
    const [extra, setExtra] = useState(false);
    return (
        <section id="motion" className={styles.section}>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.eyebrow}>03 / ROOM TO MOVE</span>
                    <h2>A natural next step.</h2>
                    <p>A little motion. A little delight. Everything in its place.</p>
                </div>
                <Badge tone="warning">Motion & interaction</Badge>
            </div>
            <div className={styles.twoColumns}>
                <Card title="A little more to the story" description="Open, close, and make a little room.">
                    <Button aria-expanded={open} aria-controls="sliding-details" onClick={() => setOpen(value => !value)} bsicon={open ? 'bi-chevron-up' : 'bi-chevron-down'}>
                        {open ? 'Hide the details' : 'Show the details'}
                    </Button>
                    <SlideDown open={open} id="sliding-details">
                        <div className={styles.slideContent}>
                            <p>Some things deserve a little more space. This one opens gently, keeps your place, and grows with your idea.</p>
                            <TextInput label="A detail worth keeping" placeholder="What’s on your mind?" />
                            <Button simple onClick={() => setExtra(value => !value)}>
                                {extra ? 'A little less' : 'Tell me more'}
                            </Button>
                            {extra && <p>There’s always room for one more good idea. Even when the story gets a little longer.</p>}
                        </div>
                    </SlideDown>
                    <div style={{marginTop: 28}}>
                        <Accordion title="Can I make this my own?">Absolutely. Start with a small idea, pick the details that fit, and give it your own personality.</Accordion>
                        <Accordion title="What if I prefer a little less motion?">
                            That works too. Your device’s motion preferences are respected, so the experience stays comfortable.
                        </Accordion>
                    </div>
                </Card>
                <Card title="Small moments, thoughtfully done">
                    <Tabs
                        label="Interaction examples"
                        tabs={[
                            {
                                label: 'A gentle arrival',
                                content: (
                                    <div className={styles.motionStage}>
                                        <FadeIn key={replay}>
                                            <div className={styles.motionSymbol}>✳</div>
                                            <h3>Hello, possibility.</h3>
                                            <p>A soft landing for your next idea.</p>
                                        </FadeIn>
                                        <Button simple bsicon="bi-arrow-clockwise" onClick={() => setReplay(value => value + 1)}>
                                            Once more
                                        </Button>
                                    </div>
                                )
                            },
                            {
                                label: 'A focused moment',
                                content: (
                                    <div className={styles.motionStage}>
                                        <div className={styles.motionSymbol}>◇</div>
                                        <h3>A little space to focus.</h3>
                                        <p>Some decisions deserve a moment of their own.</p>
                                        <Button onClick={() => setDialog(true)}>Open a moment</Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </Card>
            </div>
            <Dialog open={dialog} onClose={() => setDialog(false)} title="A moment for your next idea">
                <p className={styles.bodyText}>Take your time. Great things often begin with one small, thoughtful step.</p>
                <div className={styles.buttonRow}>
                    <Button filled onClick={() => setDialog(false)}>
                        Sounds good
                    </Button>
                    <Button onClick={() => setDialog(false)}>Maybe later</Button>
                </div>
            </Dialog>
        </section>
    );
}
