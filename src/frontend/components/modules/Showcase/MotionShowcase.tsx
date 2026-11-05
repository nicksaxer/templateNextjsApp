'use client';

import { useState } from 'react';
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
            <h2>Animations & interactions</h2>
            <div className={styles.examples}>
                <div className={styles.example}>
                    <h3>SlideDown</h3>
                    <Button aria-expanded={open} aria-controls="sliding-details" onClick={() => setOpen(value => !value)} bsicon={open ? 'bi-chevron-up' : 'bi-chevron-down'}>{open ? 'Close SlideDown' : 'Open SlideDown'}</Button>
                    <SlideDown open={open} id="sliding-details">
                        <div className={styles.slideContent}>
                            <TextInput label="Retained value" placeholder="Type, close, and reopen" />
                            <Button simple onClick={() => setExtra(value => !value)}>{extra ? 'Remove content' : 'Add content'}</Button>
                            {extra && <p>Additional content changes the height of this panel.</p>}
                        </div>
                    </SlideDown>
                    <h3>Accordion</h3>
                    <Accordion title="First accordion">First panel content.</Accordion>
                    <Accordion title="Second accordion">Second panel content.</Accordion>
                </div>
                <div className={styles.example}>
                    <h3>FadeIn</h3>
                    <FadeIn key={replay}><div className={styles.stage}>Example content</div></FadeIn>
                    <Button simple onClick={() => setReplay(value => value + 1)}>Replay FadeIn</Button>
                    <h3>Tabs</h3>
                    <Tabs label="Example tabs" tabs={[{label: 'First tab', content: <p>First tab content.</p>}, {label: 'Second tab', content: <p>Second tab content.</p>}]} />
                    <h3>Dialog</h3>
                    <Button onClick={() => setDialog(true)}>Open dialog</Button>
                </div>
            </div>
            <Dialog open={dialog} onClose={() => setDialog(false)} title="Example dialog">
                <p>Example dialog content.</p>
                <Button filled onClick={() => setDialog(false)}>Confirm</Button>
            </Dialog>
        </section>
    );
}
