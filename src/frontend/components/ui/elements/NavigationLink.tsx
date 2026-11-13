'use client';

import Link, { useLinkStatus } from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './NavigationLink.module.css';

interface NavigationLinkProps extends ComponentPropsWithoutRef<'a'> {
    href: string;
    prefetch?: ComponentPropsWithoutRef<typeof Link>['prefetch'];
    showPending?: boolean;
}

export default function NavigationLink({href, children, prefetch, showPending = false, ...props}: NavigationLinkProps) {
    // Native fragment links preserve the current page and its interaction state.
    if (href.includes('#')) {return <a {...props} href={href}>{children}</a>;}
    return <Link {...props} href={href} prefetch={prefetch}>{children}{showPending && <LinkPendingHint />}</Link>;
}

function LinkPendingHint() {
    const {pending} = useLinkStatus();
    return <span className={styles.hint} data-pending={pending} aria-hidden="true" />;
}
