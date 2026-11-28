export default function describedBy(id: string, hint?: string, error?: string, existing?: string): string | undefined {
    return [existing, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}
