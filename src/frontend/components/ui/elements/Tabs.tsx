'use client';

import { Children, isValidElement, type KeyboardEvent, type ReactElement, type ReactNode, useId, useRef, useState } from 'react';
import cx from '@frontend/utils/classNames';
import useSlidingHighlight from '../animations/useSlidingHighlight';
import styles from './Tabs.module.css';

interface TabProps {
    id?: string;
    label: string;
    children: ReactNode;
}

interface TabsProps {
    children: ReactNode;
    label: string;
    activeId?: string;
    onChange?: (id: string) => void;
    center?: boolean;
    className?: string;
}

export function Tab({children}: TabProps) {
    return children;
}

export default function Tabs({children, label, activeId, onChange, center = false, className}: TabsProps) {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLSpanElement>(null);
    const id = useId();
    const tabs = Children.toArray(children).filter((child): child is ReactElement<TabProps> => isValidElement<TabProps>(child) && typeof child.props.label === 'string');
    const tabIds = tabs.map((tab, index) => tab.props.id ?? String(index));
    const active = Math.max(0, activeId === undefined ? tabs.findIndex(tab => tab.key === selectedKey) : tabIds.indexOf(activeId));

    useSlidingHighlight(listRef, highlightRef, '[aria-selected="true"]', `${active}/${tabs.length}`);

    function select(index: number) {
        if (activeId === undefined) {setSelectedKey(tabs[index].key);}
        if (tabIds[index] !== (activeId ?? tabIds[active])) {onChange?.(tabIds[index]);}
    }

    function keyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        let next = index;
        if (event.key === 'ArrowRight') {next = (index + 1) % tabs.length;}
        else if (event.key === 'ArrowLeft') {next = (index - 1 + tabs.length) % tabs.length;}
        else if (event.key === 'Home') {next = 0;}
        else if (event.key === 'End') {next = tabs.length - 1;}
        else {return;}
        event.preventDefault();
        select(next);
        listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    }

    if (!tabs.length) {return null;}
    return (
        <div className={className}>
            <div ref={listRef} role="tablist" aria-label={label} className={cx(styles.tabs, center && styles.center)}>
                <span ref={highlightRef} className={styles.highlight} aria-hidden="true" />
                {tabs.map((tab, index) => (
                    <button key={tab.key} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keyDown(event, index)}>
                        <span>{tab.props.label}</span>
                    </button>
                ))}
            </div>
            {tabs.map((tab, index) => (
                <div key={tab.key} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}>
                    {tab}
                </div>
            ))}
        </div>
    );
}
