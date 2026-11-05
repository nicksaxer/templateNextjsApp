'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appConfig } from '@backend/config/app.config';
import { type ReactNode, useState } from 'react';
import type { Theme } from '@frontend/utils/prefs';
import Icon from '@frontend/components/ui/elements/Icon';
import NavigationLink from '@frontend/components/ui/elements/NavigationLink';
import Button from '@frontend/components/ui/inputs/Button';
import ThemeSwitch from './ThemeSwitch';
import styles from './Shell.module.css';

const links = [
    {href: '/', label: 'Overview', icon: 'grid'},
    {href: '/#inputs', label: 'Inputs & buttons', icon: 'toggles'},
    {href: '/#feedback', label: 'Feedback & states', icon: 'chat-square-text'},
    {href: '/#motion', label: 'Motion & interaction', icon: 'layers'},
    {href: '/project', label: 'A new project', icon: 'plus-square'},
    {href: '/mail', label: 'The little details', icon: 'envelope'}
];

export default function Shell({children, initialTheme}: {children: ReactNode; initialTheme: Theme}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const current = links.find(link => link.href === pathname)?.label ?? 'Explore';
    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar} data-open={menuOpen} id="navigation">
                <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
                    <span className={styles.brandMark}>
                        <Icon name="intersect" />
                    </span>
                    {appConfig.name.toLowerCase()}<span className={styles.dot}>.</span>
                </Link>
                <div className={styles.workspace}>
                    <span className={styles.workspaceIcon}>{appConfig.name[0]}</span>
                    <div>
                        Your next chapter<small>A fresh start</small>
                    </div>
                    <Icon name="chevron-expand" />
                </div>
                <p className={styles.navLabel}>THE PLAYGROUND</p>
                <nav aria-label="Main navigation">
                    {links.map(link => (
                        <NavigationLink key={link.href} href={link.href} className={styles.navLink} data-active={link.href === pathname}
                            aria-current={link.href === pathname ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                            <Icon name={link.icon} />
                            {link.label}
                        </NavigationLink>
                    ))}
                </nav>
                <div className={styles.sidebarFoot}>
                    <span className={styles.online} />
                    Ready when you are<small>Built to make it yours.</small>
                </div>
            </aside>
            <div className={styles.frame}>
                <header className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.mobileMenu}>
                            <Button simple iconOnly bsicon="bi-list" aria-label="Toggle navigation" aria-controls="navigation" aria-expanded={menuOpen}
                                onClick={() => setMenuOpen(value => !value)} />
                        </span>
                        <span>Playground</span>
                        <Icon name="chevron-right" />
                        <strong>{current}</strong>
                    </div>
                    <div className={styles.headerActions}>
                        <span className={styles.preview}>Preview space</span>
                        <ThemeSwitch initialTheme={initialTheme} />
                        <span className={styles.avatar} aria-label="Your workspace">
                            N
                        </span>
                    </div>
                </header>
                <main id="main">{children}</main>
                <footer className={styles.footer}>
                    <span>A solid start. A little personality.</span>
                    <span>
                        Made for what’s next <Icon name="arrow-up-right" />
                    </span>
                </footer>
            </div>
        </div>
    );
}
