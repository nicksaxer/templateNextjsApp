'use client';

import { type ComponentPropsWithoutRef, type CSSProperties, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSelectOptions } from './select-input.utils';
import styles from './SelectInput.module.css';

interface SelectInputProps extends Omit<ComponentPropsWithoutRef<'select'>, 'multiple' | 'size' | 'value' | 'defaultValue' | 'onFocus' | 'onBlur' | 'onKeyDown'> {
    label: string;
    value?: string | number;
    defaultValue?: string | number;
    onFocus?: ComponentPropsWithoutRef<'button'>['onFocus'];
    onBlur?: ComponentPropsWithoutRef<'button'>['onBlur'];
    onKeyDown?: ComponentPropsWithoutRef<'button'>['onKeyDown'];
}

export default function SelectInput({label, id, children, className = '', value, defaultValue, disabled, autoFocus, onChange, onInvalid, onFocus, onBlur, onKeyDown, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ...props}: SelectInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listId = `${inputId}-options`;
    const labelId = `${inputId}-label`;
    const errorId = `${inputId}-error`;
    const options = getSelectOptions(children);
    const initialValue = String(defaultValue ?? options[0]?.value ?? '');
    const [internalValue, setInternalValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [invalid, setInvalid] = useState(false);
    const [position, setPosition] = useState<CSSProperties>({});
    const nativeRef = useRef<HTMLSelectElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef({text: '', time: 0});
    const selectedValue = String(value ?? internalValue);
    const selected = options.findIndex(option => option.value === selectedValue);
    const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
    if (disabled && open) {setOpen(false);}
    const isOpen = open && !disabled;

    const updatePosition = useCallback(() => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) {return;}
        const below = window.innerHeight - rect.bottom - 12;
        const above = rect.top - 12;
        const flip = below < Math.min(280, options.length * 40 + 16) && above > below;
        setPosition({left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)), width: Math.min(rect.width, window.innerWidth - 16), maxHeight: Math.max(48, Math.min(280, flip ? above : below)), ...(flip ? {bottom: window.innerHeight - rect.top + 6} : {top: rect.bottom + 6})});
    }, [options.length, setPosition]);

    useEffect(() => {
        if (!isOpen) {return;}
        function outside(event: Event) {
            if (event.target instanceof Node && !wrapperRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {setOpen(false);}
        }
        document.addEventListener('pointerdown', outside);
        document.addEventListener('focusin', outside);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('focusin', outside);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => {
        if (isOpen) {document.getElementById(`${listId}-${active}`)?.scrollIntoView({block: 'nearest'});}
    }, [isOpen, active, listId]);

    useEffect(() => {
        const form = nativeRef.current?.form;
        function reset() {
            setInternalValue(initialValue);
            setInvalid(false);
            setOpen(false);
            queueMicrotask(() => {if (nativeRef.current) {nativeRef.current.value = String(value ?? initialValue);}});
        }
        form?.addEventListener('reset', reset);
        return () => form?.removeEventListener('reset', reset);
    }, [initialValue, value]);

    function show(index = selected) {
        if (nativeRef.current?.matches(':disabled')) {return;}
        triggerRef.current?.focus({preventScroll: true});
        updatePosition();
        setActive(enabled.includes(index) ? index : enabled[0] ?? -1);
        searchRef.current = {text: '', time: 0};
        setOpen(true);
    }

    function choose(index: number) {
        const input = nativeRef.current;
        const option = options[index];
        if (!input || input.matches(':disabled') || !option || option.disabled) {return;}
        input.value = option.value;
        input.dispatchEvent(new Event('change', {bubbles: true}));
        setOpen(false);
        triggerRef.current?.focus({preventScroll: true});
    }

    function keyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        onKeyDown?.(event);
        if (event.defaultPrevented) {return;}
        const key = event.key;
        if (key === 'Tab') {setOpen(false); return;}
        if (key === 'Escape') {if (isOpen) {event.preventDefault(); event.stopPropagation(); setOpen(false);} return;}
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
            event.preventDefault();
            const first = enabled[0] ?? -1;
            const last = enabled.at(-1) ?? -1;
            if (key === 'Home' || key === 'End') {show(key === 'Home' ? first : last);}
            else if (!isOpen) {show(selected >= 0 ? selected : key === 'ArrowDown' ? first : last);}
            else {
                const step = key === 'ArrowDown' ? 1 : -1;
                const index = enabled.indexOf(active);
                setActive(enabled[(index + step + enabled.length) % enabled.length] ?? -1);
            }
            return;
        }
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            if (isOpen) {choose(active);} else {show();}
            return;
        }
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            const now = Date.now();
            const search = `${now - searchRef.current.time < 700 ? searchRef.current.text : ''}${key}`.toLocaleLowerCase();
            searchRef.current = {text: search, time: now};
            const repeated = [...search].every(letter => letter === search[0]);
            const prefix = repeated ? key.toLocaleLowerCase() : search;
            const start = repeated ? enabled.indexOf(active) + 1 : 0;
            const ordered = [...enabled.slice(start), ...enabled.slice(0, start)];
            const match = ordered.find(index => options[index].label.toLocaleLowerCase().startsWith(prefix));
            if (!isOpen) {show(match); searchRef.current = {text: search, time: now};} else if (match !== undefined) {setActive(match);}
        }
    }

    const groups = options.reduce<{id?: number; label?: string; indices: number[]}[]>((result, option, index) => {
        const last = result.at(-1);
        if (!last || last.id !== option.groupId) {result.push({id: option.groupId, label: option.group, indices: [index]});}
        else {last.indices.push(index);}
        return result;
    }, []);

    return (
        <div ref={wrapperRef} className={`${styles.wrapper} ${className}`}>
            <label id={labelId} htmlFor={inputId} className={styles.label}>{label}</label>
            <select {...props} ref={nativeRef} id={`${inputId}-native`} className={styles.native} value={selected >= 0 ? selectedValue : ''} disabled={disabled} tabIndex={-1} aria-hidden="true" onChange={event => {
                if (value === undefined) {setInternalValue(event.target.value);}
                setInvalid(false);
                onChange?.(event);
            }} onInvalid={event => {event.preventDefault(); setInvalid(true); triggerRef.current?.focus(); onInvalid?.(event);}}>
                {!options.some(option => option.value === '') && <option value="" disabled hidden />}
                {children}
            </select>
            <button ref={triggerRef} id={inputId} type="button" role="combobox" className={styles.trigger} disabled={disabled} autoFocus={autoFocus} aria-labelledby={labelId} aria-controls={listId} aria-expanded={isOpen} aria-haspopup="listbox" aria-activedescendant={isOpen && active >= 0 ? `${listId}-${active}` : undefined} aria-required={props.required} aria-invalid={invalid || ariaInvalid} aria-describedby={[describedBy, invalid ? errorId : ''].filter(Boolean).join(' ') || undefined} onClick={() => isOpen ? setOpen(false) : show()} onKeyDown={keyDown} onFocus={onFocus} onBlur={onBlur}>
                <span>{options[selected]?.label || 'Choose…'}</span><FontAwesomeIcon icon={faChevronDown} aria-hidden="true" className={styles.chevron} />
            </button>
            {invalid && <span id={errorId} className={styles.error}>Please select an option.</span>}
            {isOpen && createPortal(
                <div ref={menuRef} id={listId} className={styles.menu} style={position} role="listbox" aria-labelledby={labelId} onPointerDown={event => event.preventDefault()}>
                    {groups.map((group, groupIndex) => (
                        <div key={groupIndex} role={group.label ? 'group' : 'presentation'} aria-label={group.label}>
                            {group.label && <div className={styles.group} aria-hidden="true">{group.label}</div>}
                            {group.indices.map(index => (
                                <div key={index} id={`${listId}-${index}`} role="option" aria-selected={selected === index} aria-disabled={options[index].disabled} data-active={active === index} className={styles.option} onPointerMove={() => {if (!options[index].disabled) {setActive(index);}}} onClick={() => choose(index)}>
                                    <span>{options[index].label}</span>{selected === index && <FontAwesomeIcon icon={faCheck} aria-hidden="true" />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>, document.body
            )}
        </div>
    );
}
