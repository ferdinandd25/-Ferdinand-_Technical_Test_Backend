import { ObjectId, Document } from 'mongoose';

export interface ReadUserDto extends Document {
  _id: string | ObjectId;
  email: string;
  full_name?: string;
  role?: string;
  status?: boolean;
  salesTypes?: string[];
}
