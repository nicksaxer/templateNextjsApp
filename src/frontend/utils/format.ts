export function formatCurrency(value: number, currency = 'CHF', locale = 'en-CH'): string {
    return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(value);
}

export function formatDate(value: string | Date, locale = 'en-CH'): string {
    return new Intl.DateTimeFormat(locale, {dateStyle: 'medium', timeZone: 'UTC'}).format(new Date(value));
}
