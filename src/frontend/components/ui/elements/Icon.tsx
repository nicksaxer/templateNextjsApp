import cx from '@frontend/utils/classNames';

export default function Icon({name, className}: {name: string; className?: string}) {
    return <i className={cx('bi', `bi-${name}`, className)} aria-hidden="true" />;
}
