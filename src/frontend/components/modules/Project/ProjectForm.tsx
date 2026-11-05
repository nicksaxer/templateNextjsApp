'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { previewProjectAction } from '@backend/actions/example/project.actions';
import type { ExamplePlan } from '@backend/types';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import NumberInput from '@frontend/components/ui/inputs/NumberInput';
import SelectInput from '@frontend/components/ui/inputs/SelectInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import Switch from '@frontend/components/ui/inputs/Switch';
import Button from '@frontend/components/ui/inputs/Button';
import ErrorMessage from '@frontend/components/ui/elements/ErrorMessage';
import { formatCurrency } from '@frontend/utils/format';
import MailPreview from '../Mail/MailPreview';
import styles from '../Showcase/Showcase.module.css';
import projectStyles from './Project.module.css';

export default function ProjectForm({plans}: {plans: ExamplePlan[]}) {
    const [state, action, pending] = useActionState(previewProjectAction, null);
    const [draft, setDraft] = useState({name: '', email: '', notes: '', updates: true});
    const [plan, setPlan] = useState('studio');
    const [seats, setSeats] = useState('3');
    const resultRef = useRef<HTMLDivElement>(null);
    const errors = state && !state.success ? state.fieldErrors : undefined;
    useEffect(() => {if (state) {resultRef.current?.focus({preventScroll: true});}}, [state]);
    return (
        <div className={styles.twoColumns}>
            <form action={action} noValidate className={styles.stack}>
                <fieldset disabled={pending} className={projectStyles.fields}>
                    <TextInput label="Project name" name="name" required maxLength={80} placeholder="Example project" error={errors?.name} value={draft.name} onChange={event => setDraft({...draft, name: event.target.value})} />
                    <TextInput label="Your email" name="email" type="email" required maxLength={254} error={errors?.email} value={draft.email} onChange={event => setDraft({...draft, email: event.target.value})} />
                    <SelectInput label="Choose a plan" name="plan" value={plan} onChange={event => setPlan(event.target.value)} aria-invalid={!!errors?.plan} aria-describedby={errors?.plan ? 'plan-error' : undefined}>
                        {plans.map(item => <option key={item.id} value={item.id}>{item.name} · {formatCurrency(item.price)}</option>)}
                    </SelectInput>
                    <ErrorMessage id="plan-error">{errors?.plan}</ErrorMessage>
                    <NumberInput label="People" name="seats" min={1} max={50} value={seats} onChange={event => setSeats(event.target.value)} error={errors?.seats} />
                    <TextArea label="Notes" name="notes" maxLength={500} error={errors?.notes} value={draft.notes} onChange={event => setDraft({...draft, notes: event.target.value})} />
                    <div className={styles.row}><Switch label="Email updates" name="updates" checked={draft.updates} onChange={updates => setDraft({...draft, updates})} /><span>Email updates</span></div>
                </fieldset>
                <Button type="submit" filled pending={pending}>{pending ? 'Validating…' : 'Validate form'}</Button>
                <p>No data is saved and no email is sent.</p>
            </form>
            <div ref={resultRef} tabIndex={-1} aria-label="Form result" className={styles.stack}>
                {state && !state.success && <ErrorMessage>{state.message}</ErrorMessage>}
                {state?.success ? <>
                    <h3>{state.data.project.name}</h3>
                    <p role="status">Valid form · {state.data.project.seats} people · {formatCurrency(state.data.project.monthlyTotal)}</p>
                    <MailPreview mail={state.data.mail} />
                </> : <p>Submit the form to see validation messages or the result.</p>}
            </div>
        </div>
    );
}
