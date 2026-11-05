'use server';

import { createProjectDraft } from '@backend/services/example';
import { renderMail } from '@backend/services/system';
import type { ActionResult, ProjectPreview } from '@backend/types';
import { getRequiredString, getOptionalString, getCheckbox, sendActionError } from '@backend/utils';

export async function previewProjectAction(_previousState: ActionResult<ProjectPreview> | null, formData: FormData): Promise<ActionResult<ProjectPreview>> {
    try {
        const project = await createProjectDraft({
            name: getRequiredString(formData, 'name', 'Project name'),
            email: getRequiredString(formData, 'email', 'Email'),
            plan: getRequiredString(formData, 'plan', 'Plan'),
            seats: Number(getRequiredString(formData, 'seats', 'People')),
            notes: getOptionalString(formData, 'notes', 'Note'),
            updates: getCheckbox(formData, 'updates')
        });
        const total = new Intl.NumberFormat('en-CH', {style: 'currency', currency: 'CHF'}).format(project.monthlyTotal);
        const mail = await renderMail({type: 'project', name: project.name, plan: project.plan, seats: project.seats, total});
        return {success: true, data: {project, mail}, message: 'Your project preview is ready.'};
    }
    catch (error) {
        return sendActionError(error);
    }
}
