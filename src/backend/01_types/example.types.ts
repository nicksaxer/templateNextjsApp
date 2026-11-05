import type { RenderedMail } from './mail.types';

export type PlanID = 'personal' | 'studio' | 'business';

export interface ExamplePlan {
    id: PlanID;
    name: string;
    price: number;
    description: string;
}

export interface ProjectDraftInput {
    name: string;
    email: string;
    plan: PlanID;
    seats: number;
    notes: string;
    updates: boolean;
}

export interface ProjectDraft extends ProjectDraftInput {
    id: string;
    createdAt: string;
    monthlyTotal: number;
}

export interface ProjectPreview {
    project: ProjectDraft;
    mail: RenderedMail;
}
