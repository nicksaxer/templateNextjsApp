import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { appConfig } from '@backend/config/app.config';
import { getTheme } from '@frontend/utils/prefs';
import Shell from '@frontend/components/layout/Shell/Shell';
import './globals.css';

export const metadata: Metadata = {
    title: {default: `${appConfig.name} · A fresh start`, template: `%s · ${appConfig.name}`},
    description: appConfig.description,
    robots: {index: false, follow: false}
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    const theme = getTheme((await cookies()).get('theme')?.value);
    return (
        <html lang="en" data-theme={theme}>
            <body>
                <a href="#main" className="skipLink">
                    Skip to content
                </a>
                <Shell initialTheme={theme}>{children}</Shell>
            </body>
        </html>
    );
}
