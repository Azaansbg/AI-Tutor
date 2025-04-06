import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  description: string;
  icon: string;
  order: number;
  lessons: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
}, {
  timestamps: true
});

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema); 