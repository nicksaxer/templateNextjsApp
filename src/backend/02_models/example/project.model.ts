import 'server-only';
import mongoose, { Schema, type Model } from 'mongoose';
import type { ProjectDraftInput } from '@backend/types';
import { exampleLimits } from '@backend/config/example.config';

export interface ProjectRecord extends ProjectDraftInput {
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectRecord>({
    name: {type: String, required: true, trim: true, maxlength: exampleLimits.maxName},
    email: {type: String, required: true, lowercase: true, trim: true, maxlength: 254},
    plan: {type: String, required: true, enum: ['personal', 'studio', 'business']},
    seats: {type: Number, required: true, min: exampleLimits.minSeats, max: exampleLimits.maxSeats, validate: Number.isSafeInteger},
    notes: {type: String, default: '', maxlength: exampleLimits.maxNotes},
    updates: {type: Boolean, required: true}
}, {timestamps: true, optimisticConcurrency: true, strict: 'throw'});

export const ProjectModel: Model<ProjectRecord> = mongoose.models.ExampleProject ?? mongoose.model<ProjectRecord>('ExampleProject', projectSchema);
