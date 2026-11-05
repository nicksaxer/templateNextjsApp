'use client';

import { useEffect, useImperativeHandle, useId, useRef, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextInput, { type TextInputProps } from './TextInput';
import styles from './NumberInput.module.css';

interface NumberInputProps extends Omit<TextInputProps, 'type' | 'min' | 'max' | 'step' | 'endAdornment' | 'inline' | 'value' | 'defaultValue'> {
    min?: number;
    max?: number;
    step?: number;
    value?: string | number;
    defaultValue?: string | number;
}

export default function NumberInput({label, id, className = '', min, max, step = 1, value, defaultValue, disabled, readOnly, inputRef, onChange, inputMode = 'decimal', ...props}: NumberInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const numberRef = useRef<HTMLInputElement | null>(null);
    const [currentValue, setCurrentValue] = useState(String(defaultValue ?? ''));
    const numericValue = Number(value ?? currentValue);
    const hasValue = String(value ?? currentValue) !== '';
    const increment = Number.isFinite(step) && step > 0 ? step : 1;
    useImperativeHandle(inputRef, () => numberRef.current!, []);

    useEffect(() => {
        const form = numberRef.current?.form;
        function reset() {
            setCurrentValue(String(defaultValue ?? ''));
            if (value !== undefined) {queueMicrotask(() => {if (numberRef.current) {numberRef.current.value = String(value);}});}
        }
        form?.addEventListener('reset', reset);
        return () => form?.removeEventListener('reset', reset);
    }, [defaultValue, value]);

    function changeStep(direction: number) {
        const input = numberRef.current;
        if (!input || input.matches(':disabled') || input.readOnly) {return;}
        const previous = input.value;
        if (direction > 0) {input.stepUp();} else {input.stepDown();}
        const next = input.value;
        if (next !== previous) {
            // Use the native setter so React receives the same input event as typed edits.
            input.value = previous;
            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set?.call(input, next);
            input.dispatchEvent(new Event('input', {bubbles: true}));
        }
        input.focus({preventScroll: true});
    }

    return (
        <TextInput {...props} id={inputId} inputRef={numberRef} label={label} type="number" inputMode={inputMode} className={`${styles.wrapper} ${className}`} min={min} max={max} step={increment} value={value} defaultValue={defaultValue} disabled={disabled} readOnly={readOnly} onChange={event => {setCurrentValue(event.target.value); onChange?.(event);}} endAdornment={
            <div className={styles.stepper}>
                <button type="button" tabIndex={-1} aria-label={`Increase ${label}`} aria-controls={inputId} disabled={disabled || readOnly || (hasValue && max !== undefined && numericValue >= max)} onPointerDown={event => event.preventDefault()} onClick={() => changeStep(1)}>
                    <FontAwesomeIcon icon={faChevronUp} aria-hidden="true" />
                </button>
                <button type="button" tabIndex={-1} aria-label={`Decrease ${label}`} aria-controls={inputId} disabled={disabled || readOnly || (hasValue && min !== undefined && numericValue <= min)} onPointerDown={event => event.preventDefault()} onClick={() => changeStep(-1)}>
                    <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
                </button>
            </div>
        } />
    );
}
