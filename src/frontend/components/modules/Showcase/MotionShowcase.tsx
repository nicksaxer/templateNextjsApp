'use client';

import { useState } from 'react';
import Accordion from '@frontend/components/ui/elements/Accordion';
import Tabs, { Tab } from '@frontend/components/ui/elements/Tabs';
import SlideDown from '@frontend/components/ui/animations/SlideDown';
import FadeIn from '@frontend/components/ui/animations/FadeIn';
import Button from '@frontend/components/ui/inputs/Button';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import styles from './Showcase.module.css';
import motionStyles from './MotionShowcase.module.css';

export default function MotionShowcase() {
    const [open, setOpen] = useState(false);
    const [replay, setReplay] = useState(0);
    const [extra, setExtra] = useState(false);
    const [activeTab, setActiveTab] = useState('first');
    return (
        <section id="motion" className={styles.section}>
            <h2>Animations & interactions</h2>
            <div className={styles.examples}>
                <div className={styles.example}>
                    <h3>SlideDown</h3>
                    <Button aria-expanded={open} aria-controls="sliding-details" onClick={() => setOpen(value => !value)} bsicon={open ? 'bi-chevron-up' : 'bi-chevron-down'}>{open ? 'Close SlideDown' : 'Open SlideDown'}</Button>
                    <SlideDown open={open} id="sliding-details">
                        <div className={motionStyles.slideContent}>
                            <TextInput label="Retained value" placeholder="Type, close, and reopen" />
                            <Button simple onClick={() => setExtra(value => !value)}>{extra ? 'Remove content' : 'Add content'}</Button>
                            {extra && <p>Additional content changes the height of this panel.</p>}
                        </div>
                    </SlideDown>
                    <details className={motionStyles.disclosure}>
                        <summary>Native disclosure</summary>
                        <SlideDown id="native-disclosure">
                            <div className={motionStyles.slideContent}>
                                <TextInput label="Disclosure draft" placeholder="Type, close, and reopen" />
                            </div>
                        </SlideDown>
                    </details>
                    <h3>Accordion</h3>
                    <Accordion title="First accordion">First panel content.</Accordion>
                    <Accordion title="Second accordion">Second panel content.</Accordion>
                </div>
                <div className={styles.example}>
                    <h3>FadeIn</h3>
                    <FadeIn key={replay}><div className={motionStyles.stage}>Example content</div></FadeIn>
                    <Button simple onClick={() => setReplay(value => value + 1)}>Replay FadeIn</Button>
                    <h3>Tabs</h3>
                    <Tabs label="Example tabs" activeId={activeTab} onChange={setActiveTab} center>
                        <Tab id="first" label="First tab">
                            <p>First tab content.</p>
                            <TextInput label="Tab draft" placeholder="Type and switch tabs" />
                        </Tab>
                        <Tab id="second" label="Second tab">
                            <p>Second tab content.</p>
                        </Tab>
                        <Tab id="third" label="Third tab">
                            <p>Third tab content.</p>
                        </Tab>
                    </Tabs>
                    <Button simple onClick={() => setActiveTab('third')}>Select third tab</Button>
                </div>
            </div>
        </section>
    );
}
