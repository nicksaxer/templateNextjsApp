'use client';

import { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@frontend/components/ui/inputs/Button';
import TextInput from '@frontend/components/ui/inputs/TextInput';
import NumberInput from '@frontend/components/ui/inputs/NumberInput';
import SelectInput from '@frontend/components/ui/inputs/SelectInput';
import TextArea from '@frontend/components/ui/inputs/TextArea';
import Switch from '@frontend/components/ui/inputs/Switch';
import Checkbox from '@frontend/components/ui/inputs/Checkbox';
import styles from './Showcase.module.css';

export default function InputsShowcase() {
    const [clicks, setClicks] = useState(0);
    const [enabled, setEnabled] = useState(true);
    const [selection, setSelection] = useState('second');
    return (
        <>
            <section id="buttons" className={styles.section}>
                <h2>Buttons</h2>
                <div className={styles.buttonRow}>
                    <Button onClick={() => setClicks(value => value + 1)}>Default</Button>
                    <Button filled onClick={() => setClicks(value => value + 1)}>Filled</Button>
                    <Button simple onClick={() => setClicks(value => value + 1)}>Simple</Button>
                    <Button simple filled onClick={() => setClicks(value => value + 1)}>Simple filled</Button>
                    <Button bsicon="bi-plus-lg" onClick={() => setClicks(value => value + 1)}>Bootstrap icon</Button>
                    <Button icon={faPlus} onClick={() => setClicks(value => value + 1)}>Font Awesome icon</Button>
                    <Button iconOnly icon={faPlus} aria-label="Icon only" onClick={() => setClicks(value => value + 1)} />
                    <Button danger onClick={() => setClicks(value => value + 1)}>Danger</Button>
                    <Button danger filled onClick={() => setClicks(value => value + 1)}>Danger filled</Button>
                    <Button disabled>Disabled</Button>
                    <Button pending>Loading</Button>
                </div>
                <p role="status">Clicked {clicks} times</p>
            </section>
            <section id="inputs" className={styles.section}>
                <h2>Inputs</h2>
                <form onSubmit={event => event.preventDefault()} onReset={() => {setEnabled(true); setSelection('second');}}>
                    <div className={styles.examples}>
                        <div className={styles.example}>
                            <h3>TextInput</h3>
                            <TextInput label="Text" name="text" placeholder="Type something" />
                            <TextInput label="Password" type="password" defaultValue="example-password" />
                            <TextInput label="Disabled input" defaultValue="Disabled value" disabled />
                            <TextInput label="Read-only input" defaultValue="Read-only value" readOnly />
                            <TextInput label="Input with error" defaultValue="invalid@" error="Enter a valid email address." />
                            <TextInput label="Input with hint" hint="Example hint below the input." />
                            <div className={styles.row}><span>Inline:</span><TextInput label="Inline text" inline defaultValue="Edit this text" /></div>
                            <TextInput label="End adornment" endAdornment={<span className={styles.adornment}>CHF</span>} />
                        </div>
                        <div className={styles.example}>
                            <h3>NumberInput</h3>
                            <NumberInput label="Quantity" name="quantity" defaultValue={3} min={0} max={10} />
                            <NumberInput label="Decimal number" defaultValue={1.5} step={0.5} min={0} max={5} />
                            <NumberInput label="Disabled number" defaultValue={2} disabled />
                            <h3>SelectInput</h3>
                            <SelectInput label="Select an option" name="selection" value={selection} onChange={event => setSelection(event.target.value)}>
                                <option value="first">First option</option>
                                <option value="second">Second option</option>
                                <optgroup label="More options"><option value="third">Third option</option><option value="unavailable" disabled>Unavailable option</option></optgroup>
                            </SelectInput>
                            <p role="status">Selected: {selection}</p>
                            <SelectInput label="Disabled select" disabled><option>Disabled option</option></SelectInput>
                            <h3>Switch & checkbox</h3>
                            <div className={styles.row}><Switch label="Example switch" checked={enabled} onChange={setEnabled} /><span>{enabled ? 'On' : 'Off'}</span></div>
                            <div className={styles.row}><Switch label="Disabled switch" checked disabled onChange={() => {}} /><span>Disabled</span></div>
                            <Checkbox label="Example checkbox" name="checkbox" />
                            <Checkbox label="Disabled checkbox" disabled defaultChecked />
                        </div>
                        <div className={styles.example}>
                            <h3>TextArea</h3>
                            <TextArea label="Multiline text" name="notes" placeholder="Type a few lines" />
                            <TextArea label="Textarea with error" error="Example validation message." />
                        </div>
                    </div>
                    <Button type="reset" simple>Reset inputs</Button>
                </form>
            </section>
        </>
    );
}
