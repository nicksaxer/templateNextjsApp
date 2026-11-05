import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

export default function NavigationLink({href, children, ...props}: ComponentPropsWithoutRef<'a'> & {href: string}) {
    // Native fragment links preserve the current page and its interaction state.
    if (href.includes('#')) {return <a {...props} href={href}>{children}</a>;}
    return <Link {...props} href={href}>{children}</Link>;
}
