'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import Icon from './Icon';
import styles from './ProfilePicture.module.css';

interface ProfilePictureProps extends Pick<ImageProps, 'alt' | 'className' | 'preload'> {
    src?: ImageProps['src'] | null;
    size?: number;
}

export default function ProfilePicture({src, alt, size = 100, className = '', preload = false}: ProfilePictureProps) {
    const [failedSrc, setFailedSrc] = useState<ImageProps['src'] | null>(null);
    if (src && src !== failedSrc) {
        return <Image src={src} alt={alt} width={size} height={size} className={`${styles.image} ${className}`} unoptimized preload={preload} onError={() => setFailedSrc(src)} />;
    }
    return (
        <span className={`${styles.fallback} ${className}`} style={{width: size, height: size, fontSize: size}} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
            <Icon name="person-circle" />
        </span>
    );
}
