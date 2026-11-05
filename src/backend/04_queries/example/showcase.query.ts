import 'server-only';
import { getExamplePlans } from '@backend/services/example';
import { renderMail } from '@backend/services/system';

export async function getShowcase() {
    const plans = getExamplePlans();
    const [welcome, project] = await Promise.all([
        renderMail({type: 'welcome', name: 'Alex'}),
        renderMail({type: 'project', name: 'Sunday Studio', plan: 'Studio', seats: 3, total: 'CHF 57.00'})
    ]);
    return {plans, mails: [welcome, project]};
}
