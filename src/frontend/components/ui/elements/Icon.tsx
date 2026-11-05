export default function Icon({name, className = ''}: {name: string; className?: string}) {
    return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
