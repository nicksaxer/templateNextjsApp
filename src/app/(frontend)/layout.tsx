import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { config } from '@fortawesome/fontawesome-svg-core';
import { appConfig } from '@backend/config/app.config';
import { getTheme } from '@frontend/utils/prefs';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fontsource-variable/rubik';
import './globals.css';

config.autoAddCss = false;

export const metadata: Metadata = {title: {default: appConfig.name, template: `%s · ${appConfig.name}`}, description: appConfig.description, robots: {index: false, follow: false}};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    const theme = getTheme((await cookies()).get('theme')?.value);
    return (
        <html lang="en" data-theme={theme} data-scroll-behavior="smooth">
            <body>
                <a href="#main" className="skipLink">Skip to content</a>
                <main id="main">{children}</main>
            </body>
        </html>
    );
}
