/**
 * run seed to fill the database with random values , not run on prod !!!!!!!!!!!!!
 */

import mongoose from 'mongoose';
import { UserSchema } from 'src/users/users.schema';

const adminObjectId = '69808968c7bbda1cc9078487';
const managerObjectId = '69808968c7bbda1cc9078488';
const applicantObjectId = '69808968c7bbda1cc9078489';
const userObjectId = '69808968c7bbda1cc907848a';

async function seed() {
  // Users
  const userModel = mongoose.model('User', UserSchema);
}
