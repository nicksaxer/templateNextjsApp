'use client';

import { Children, isValidElement, type KeyboardEvent, type ReactElement, type ReactNode, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './Tabs.module.css';

interface TabProps {
    label: string;
    children: ReactNode;
}

export function Tab({children}: TabProps) {
    return children;
}

export default function Tabs({children, label}: {children: ReactNode; label: string}) {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLSpanElement>(null);
    const id = useId();
    const tabs = Children.toArray(children).filter((child): child is ReactElement<TabProps> => isValidElement<TabProps>(child) && typeof child.props.label === 'string');
    const active = Math.max(0, tabs.findIndex(tab => tab.key === selectedKey));

    useLayoutEffect(() => {
        const list = listRef.current;
        const highlight = highlightRef.current;
        const button = list?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
        if (!list || !highlight || !button) {return;}
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const cancelAnimation = () => highlight.getAnimations().forEach(animation => animation.cancel());

        const align = (animate: boolean) => {
            const next = {left: `${button.offsetLeft}px`, top: `${button.offsetTop}px`, width: `${button.offsetWidth}px`, height: `${button.offsetHeight}px`};
            if (Object.entries(next).every(([key, value]) => highlight.style.getPropertyValue(key) === value)) {return;}

            // Sample the visible frame so rapid switches continue from the current position.
            const {left, top, width, height, scale} = getComputedStyle(highlight);
            const move = animate && highlight.hasAttribute('data-ready') && !reducedMotion.matches;
            cancelAnimation();
            Object.assign(highlight.style, next);
            highlight.dataset.ready = '';
            if (move) {
                highlight.animate([
                    {left, top, width, height, scale},
                    {scale: '1.12 0.82', offset: 0.5},
                    {...next, scale: '1'}
                ], {duration: 320, easing: 'cubic-bezier(0.25, 0.65, 0.35, 1)'});
            }
        };

        align(true);
        const observer = new ResizeObserver(() => align(false));
        observer.observe(list);
        list.querySelectorAll('[role="tab"]').forEach(tab => observer.observe(tab));
        reducedMotion.addEventListener('change', cancelAnimation);
        return () => {
            observer.disconnect();
            reducedMotion.removeEventListener('change', cancelAnimation);
        };
    });

    function keyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        let next = index;
        if (event.key === 'ArrowRight') {next = (index + 1) % tabs.length;}
        else if (event.key === 'ArrowLeft') {next = (index - 1 + tabs.length) % tabs.length;}
        else if (event.key === 'Home') {next = 0;}
        else if (event.key === 'End') {next = tabs.length - 1;}
        else {return;}
        event.preventDefault();
        setSelectedKey(tabs[next].key);
        listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    }

    if (!tabs.length) {return null;}
    return (
        <div>
            <div ref={listRef} role="tablist" aria-label={label} className={styles.tabs}>
                <span ref={highlightRef} className={styles.highlight} aria-hidden="true" />
                {tabs.map((tab, index) => (
                    <button key={tab.key} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setSelectedKey(tab.key)} onKeyDown={event => keyDown(event, index)}>
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
