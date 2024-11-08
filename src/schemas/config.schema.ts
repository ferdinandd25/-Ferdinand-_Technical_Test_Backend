import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Config extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Object })
  config: object;
}
export const ConfigSchema = SchemaFactory.createForClass(Config);
ConfigSchema.index({ name: 1 });
