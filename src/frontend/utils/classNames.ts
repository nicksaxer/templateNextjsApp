// Joins the class names that are set, so optional modifiers don't leave stray spaces.
export default function cx(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}
