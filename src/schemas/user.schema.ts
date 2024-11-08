import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Document } from 'mongoose';

@Schema()
export class UserSuspension {
  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;
}
export const UserSuspensionSchema = SchemaFactory.createForClass(UserSuspension);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String, enum: UserRoleEnum, required: true })
  role: UserRoleEnum;

  @Prop({ type: String })
  password: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: UserSuspensionSchema, default: null })
  suspension: UserSuspension;

  @Prop({ type: [String], enum: ['Residential', 'Commercial'], default: [] })
  salesTypes: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1, role: 1 });
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password; // Always remove password when converting to JSON
    return ret;
  },
});