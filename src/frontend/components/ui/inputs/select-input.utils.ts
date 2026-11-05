import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export interface SelectOption {
    value: string;
    label: string;
    disabled: boolean;
    group?: string;
    groupId?: number;
}

export function getSelectOptions(children: ReactNode): SelectOption[] {
    const options: SelectOption[] = [];
    let nextGroup = 0;
    function text(content: ReactNode): string {
        return Children.toArray(content).map(child => isValidElement<{children?: ReactNode}>(child) ? text(child.props.children) : String(child)).join('');
    }
    function visit(content: ReactNode, group?: string, groupId?: number, disabled = false) {
        Children.forEach(content, child => {
            if (!isValidElement<{value?: string | number; label?: string; disabled?: boolean; children?: ReactNode}>(child)) {return;}
            if (child.type === 'option') {
                const content = text(child.props.children);
                const label = child.props.label ?? content;
                options.push({value: String(child.props.value ?? content), label, disabled: disabled || !!child.props.disabled, group, groupId});
            }
            else if (child.type === 'optgroup') {visit(child.props.children, child.props.label, nextGroup++, disabled || !!child.props.disabled);}
            else if (child.type === Fragment) {visit(child.props.children, group, groupId, disabled);}
        });
    }
    visit(children);
    return options;
}
