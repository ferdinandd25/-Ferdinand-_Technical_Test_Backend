import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LeadStatusEnum } from 'src/enums/leads-status.enum';
import { Document, Types } from 'mongoose';

@Schema()
export class LeadStatusHistory {
  @Prop({ type: String, enum: LeadStatusEnum })
  status: LeadStatusEnum;

  @Prop({ type: String })
  updatedBy: string;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}
export const LeadStatusHistorySchema = SchemaFactory.createForClass(LeadStatusHistory);

@Schema({ timestamps: true })
export class Lead extends Document {
  @Prop({ required: true })
  customerName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({
    type: String,
    enum: LeadStatusEnum,
    default: LeadStatusEnum.NEW_LEAD,
  })
  status: LeadStatusEnum;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedSalesperson: Types.ObjectId;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: [LeadStatusHistorySchema] })
  status_history: LeadStatusHistory[];

  @Prop({ type: [String], default: [] }) // Array to store image paths
  surveyImages: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ assignedSalesperson: 1 });
