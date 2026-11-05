export type MailValues = {type: 'welcome'; name: string} | {type: 'project'; name: string; plan: string; seats: number; total: string};

export interface RenderedMail {
    subject: string;
    html: string;
    text: string;
}

export type MailDelivery = {success: true} | {success: false; message: string};
