'use client';

import { type RefObject, useLayoutEffect } from 'react';

// Moves `highlight` onto the element matching `activeSelector` inside `list`, squashing briefly on the way.
// `activeKey` changes whenever the active element does.
export default function useSlidingHighlight(listRef: RefObject<HTMLElement | null>, highlightRef: RefObject<HTMLElement | null>, activeSelector: string, activeKey: string) {
    useLayoutEffect(() => {
        const list = listRef.current;
        const highlight = highlightRef.current;
        const active = list?.querySelector<HTMLElement>(activeSelector);
        if (!list || !highlight || !active) {return;}
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const cancelAnimation = () => highlight.getAnimations().forEach(animation => animation.cancel());

        const align = (animate: boolean) => {
            const next = {left: `${active.offsetLeft}px`, top: `${active.offsetTop}px`, width: `${active.offsetWidth}px`, height: `${active.offsetHeight}px`};
            if (Object.entries(next).every(([property, value]) => highlight.style.getPropertyValue(property) === value)) {return;}

            // Start from the visible frame so rapid switches continue from the current position.
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
        Array.from(list.children).forEach(child => {if (child !== highlight) {observer.observe(child);}});
        reducedMotion.addEventListener('change', cancelAnimation);
        return () => {
            observer.disconnect();
            reducedMotion.removeEventListener('change', cancelAnimation);
        };
    }, [listRef, highlightRef, activeSelector, activeKey]);
}
