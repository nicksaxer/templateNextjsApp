'use client';

import { useRef, useState } from 'react';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import NumberInput from '@frontend/components/ui/inputs/NumberInput';
import SelectInput from '@frontend/components/ui/inputs/SelectInput';
import Switch from '@frontend/components/ui/inputs/Switch';
import Checkbox from '@frontend/components/ui/inputs/Checkbox';
import Button from '@frontend/components/ui/inputs/Button';
import Card from '@frontend/components/ui/elements/Card';
import InfoBox from '@frontend/components/ui/elements/InfoBox';
import Badge from '@frontend/components/ui/elements/Badge';
import styles from './Showcase.module.css';

export default function InputsShowcase() {
    const [message, setMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <section id="inputs" className={styles.section}>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.eyebrow}>01 / THE EVERYDAY ESSENTIALS</span>
                    <h2>Make yourself understood.</h2>
                    <p>Little interactions that feel right from the first click.</p>
                </div>
                <Badge>Inputs & buttons</Badge>
            </div>
            <div className={styles.twoColumns}>
                <Card title="A place for every detail" description="Go ahead. Fill something in.">
                    <form
                        ref={formRef}
                        onSubmit={event => {
                            event.preventDefault();
                            setMessage('Looking good. Your details are ready.');
                        }}
                        className={styles.stack}
                    >
                        <div className={styles.twoColumns}>
                            <TextInput label="Your name" name="name" placeholder="Alex Morgan" />
                            <TextInput label="Email address" name="email" type="email" placeholder="alex@example.com" />
                        </div>
                        <TextInput label="Password" type="password" name="password" autoComplete="new-password" placeholder="A little secret"
                            hint="You can take a peek with the eye icon." />
                        <div className={styles.twoColumns}>
                            <SelectInput
                                label="Your workspace"
                                name="workspace"
                                defaultValue="studio"
                                options={[
                                    {value: 'personal', label: 'Personal'},
                                    {value: 'studio', label: 'Studio'},
                                    {value: 'business', label: 'Business'}
                                ]}
                            />
                            <NumberInput label="People" name="people" min={1} max={50} defaultValue={3} />
                        </div>
                        <TextArea label="A little about your idea" name="idea" placeholder="Every good thing starts somewhere…" maxLength={500} />
                        <div className={styles.rowBetween}>
                            <Switch label="Keep me in the loop" name="updates" defaultChecked />
                            <InfoBox>Just the occasional update. You can change your mind anytime.</InfoBox>
                        </div>
                        <Checkbox label="I’m ready to make something good" name="ready" />
                        <div className={styles.buttonRow}>
                            <Button filled type="submit" bsicon="bi-check2">
                                Save details
                            </Button>
                            <Button
                                onClick={() => {
                                    formRef.current?.reset();
                                    setMessage('');
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                        <span className={styles.smallStatus} role="status">
                            {message}
                        </span>
                    </form>
                </Card>
                <div className={styles.stack}>
                    <Card title="The right action" description="A little emphasis, exactly where it belongs.">
                        <div className={styles.buttonRow}>
                            <Button filled bsicon="bi-plus-lg" onClick={() => setMessage('A new beginning. Nice choice.')}>
                                Create new
                            </Button>
                            <Button onClick={() => setMessage('Your changes are ready to save.')}>Secondary</Button>
                            <Button simple bsicon="bi-arrow-up-right" onClick={() => setMessage('You’re all set to explore.')}>
                                Explore
                            </Button>
                        </div>
                        <div className={styles.buttonRow} style={{marginTop: 16}}>
                            <Button danger bsicon="bi-trash3" onClick={() => setMessage('Example removed. You can start again anytime.')}>
                                Remove
                            </Button>
                            <Button disabled>Unavailable</Button>
                            <Button pending>Working</Button>
                            <Button iconOnly aria-label="Add to favorites" bsicon="bi-heart" onClick={() => setMessage('Added to your favorites.')} />
                        </div>
                    </Card>
                    <Card title="A helping hand" description="A clear nudge when something needs attention.">
                        <div className={styles.stack}>
                            <TextInput label="Email address" type="email" defaultValue="alex@" error="That email looks incomplete. Give it another try." />
                            <TextInput label="Your invitation code" defaultValue="FOUNDATION-2026" disabled hint="This one’s already taken care of." />
                        </div>
                    </Card>
                    <div className={styles.note}>
                        <span>GOOD DESIGN IS IN THE DETAILS</span>
                        <p>
                            A clear label. A helpful hint.
                            <br />
                            One less thing to think about.
                        </p>
                        <span className={styles.noteStar} aria-hidden="true">
                            ✳
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
