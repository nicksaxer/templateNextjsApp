export interface ActionError {
    success: false;
    status: number;
    message: string;
    fieldErrors?: Record<string, string>;
}

export type ActionResult<T = null> = {success: true; data: T; message?: string} | ActionError;

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
