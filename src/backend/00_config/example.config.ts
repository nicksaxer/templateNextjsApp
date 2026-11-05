import 'server-only';
import type { ExamplePlan } from '@backend/types';

export const examplePlans: readonly ExamplePlan[] = [
    {id: 'personal', name: 'Personal', price: 9, description: 'A small space for a big idea.'},
    {id: 'studio', name: 'Studio', price: 19, description: 'Room to make something together.'},
    {id: 'business', name: 'Business', price: 39, description: 'A home for your growing team.'}
];

export const exampleLimits = {minSeats: 1, maxSeats: 50, maxName: 80, maxNotes: 500} as const;
