'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { previewProjectAction } from '@backend/actions/example/project.actions';
import type {ExamplePlan} from '@backend/types';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import NumberInput from '@frontend/components/ui/inputs/NumberInput';
import SelectInput from '@frontend/components/ui/inputs/SelectInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import Switch from '@frontend/components/ui/inputs/Switch';
import Button from '@frontend/components/ui/inputs/Button';
import Card from '@frontend/components/ui/elements/Card';
import Alert from '@frontend/components/ui/elements/Alert';
import Badge from '@frontend/components/ui/elements/Badge';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import FadeIn from '@frontend/components/ui/animations/FadeIn';
import { formatCurrency, formatDate } from '@frontend/utils/format';
import MailPreview from '../Mail/MailPreview';
import styles from '../Showcase/Showcase.module.css';
import projectStyles from './Project.module.css';

export default function ProjectForm({plans}: {plans: ExamplePlan[]}) {
    const [state, action, pending] = useActionState(previewProjectAction, null);
    const [plan, setPlan] = useState('studio');
    const [seats, setSeats] = useState('3');
    const resultRef = useRef<HTMLDivElement>(null);
    const errors = state && !state.success ? state.fieldErrors : undefined;
    const selectedPlan = plans.find(item => item.id === plan) ?? plans[0];
    const estimate = selectedPlan.price * (Number(seats) || 0);
    useEffect(() => {
        if (state) {resultRef.current?.focus({preventScroll: true});}
    }, [state]);
    return (
        <div className={styles.twoColumns}>
            <Card title="Give it a little personality" description="A name, a plan, and some room to grow.">
                <form action={action} noValidate className={styles.stack}>
                    <fieldset disabled={pending} className={projectStyles.fields}>
                        <TextInput label="Project name" name="name" required maxLength={80} placeholder="Sunday Studio" error={errors?.name} />
                        <TextInput label="Your email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="alex@example.com" error={errors?.email}
                            hint="Only used in this preview. Nothing is sent or saved." />
                        <div className={styles.twoColumns}>
                            <SelectInput label="Choose a plan" name="plan" value={plan} onChange={event => setPlan(event.target.value)}
                                options={plans.map(plan => ({value: plan.id, label: `${plan.name} · ${formatCurrency(plan.price)}`}))} error={errors?.plan} />
                            <NumberInput label="People" name="seats" min={1} max={50} value={seats} onChange={event => setSeats(event.target.value)} error={errors?.seats} />
                        </div>
                        <TextArea label="What’s the idea?" name="notes" placeholder="Something worth making…" maxLength={500} error={errors?.notes} />
                        <Switch label="I’d like the occasional update" name="updates" defaultChecked />
                    </fieldset>
                    <div className={projectStyles.estimate}>
                        <div>
                            <strong>{selectedPlan.name}</strong>
                            <span>{selectedPlan.description}</span>
                        </div>
                        <div>
                            <strong>{formatCurrency(estimate)}</strong>
                            <span>per month</span>
                        </div>
                    </div>
                    <Button type="submit" filled pending={pending} bsicon="bi-arrow-right">
                        {pending ? 'Putting it together…' : 'Preview my project'}
                    </Button>
                    <p className={projectStyles.finePrint}>Just a little experiment. No account, payment, or commitment.</p>
                </form>
            </Card>
            <div ref={resultRef} tabIndex={-1} aria-label="Project preview result" className={styles.stack}>
                {state && !state.success && (
                    <Alert tone="danger" title={state.message}>
                        Check the highlighted details and try again.
                    </Alert>
                )}
                {state?.success ? (
                    <FadeIn key={state.data.project.id}>
                        <Card title="Your idea, taking shape" action={<Badge tone="success">Ready</Badge>}>
                            <div className={projectStyles.result}>
                                <span className={projectStyles.projectIcon}>✳</span>
                                <h2>{state.data.project.name}</h2>
                                <p>{state.data.project.notes || 'A fresh space for your next chapter.'}</p>
                                <dl>
                                    <div>
                                        <dt>Plan</dt>
                                        <dd>{state.data.project.plan}</dd>
                                    </div>
                                    <div>
                                        <dt>People</dt>
                                        <dd>{state.data.project.seats}</dd>
                                    </div>
                                    <div>
                                        <dt>Monthly total</dt>
                                        <dd>{formatCurrency(state.data.project.monthlyTotal)}</dd>
                                    </div>
                                    <div>
                                        <dt>Created</dt>
                                        <dd>{formatDate(state.data.project.createdAt)}</dd>
                                    </div>
                                    <div>
                                        <dt>Email updates</dt>
                                        <dd>{state.data.project.updates ? 'Yes, please' : 'Not right now'}</dd>
                                    </div>
                                </dl>
                            </div>
                            <Alert tone="success">Your project preview is ready. A nice place to start.</Alert>
                        </Card>
                        <div style={{marginTop: 22}}>
                            <MailPreview mail={state.data.mail} />
                        </div>
                    </FadeIn>
                ) : (
                    <Card>
                        <EmptyState title="Your idea goes here" icon="stars">
                            Fill in a few details. We’ll bring them together.
                        </EmptyState>
                        <div className={projectStyles.previewArt} aria-hidden="true">
                            <span>◓</span>
                            <span>✳</span>
                            <span>◇</span>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
