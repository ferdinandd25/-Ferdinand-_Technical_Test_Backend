import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lead, LeadSchema } from './lead.schema';

@Schema({ timestamps: true })
export class LeadHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Lead' })
  lead: Types.ObjectId;

  @Prop({ type: LeadSchema })
  data: Lead;

  @Prop({ type: String })
  updatedBy: string;
}
export const LeadHistorySchema = SchemaFactory.createForClass(LeadHistory);
LeadHistorySchema.index({ lead: 1 });
LeadHistorySchema.index({ 'data.customerName': 1 });
