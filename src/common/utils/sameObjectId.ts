import { Types } from 'mongoose';

export const sameObjectId = (
  id1: Types.ObjectId | string,
  id2: Types.ObjectId | string,
) => id1.toString() == id2.toString();
