import 'server-only';
import { examplePlans } from '@backend/config/example.config';
import { ProjectModel } from '@backend/models';
import type { ProjectDraft } from '@backend/types';
import { validateProjectInput } from '../../06_utils/example.validation';
import { AppError } from '../../06_utils/error.util';

export function getExamplePlans() {
    return examplePlans.map(plan => ({...plan}));
}

export async function createProjectDraft(input: unknown): Promise<ProjectDraft> {
    const values = validateProjectInput(input);
    const project = new ProjectModel(values);
    // Exercise the persistence schema without a database write in the public showcase.
    await project.validate();
    const plan = examplePlans.find(plan => plan.id === values.plan);
    if (!plan) {throw new AppError(400, 'Choose an available plan.');}
    return {...values, id: project._id.toString(), createdAt: new Date().toISOString(), monthlyTotal: plan.price * values.seats};
}
