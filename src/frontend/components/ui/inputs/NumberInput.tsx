import TextInput, { type TextInputProps } from './TextInput';

export default function NumberInput({step = 1, ...props}: Omit<TextInputProps, 'type'>) {
    return <TextInput {...props} type="number" inputMode="decimal" step={step} />;
}
