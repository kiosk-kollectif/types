import { User, UserRole } from './users';

export interface WhareHouseManager {
  userId: string;
  warehouseId: string;
  role: UserRole;
  assignedAt: string;
  user: User;
}

export interface WhareHouse extends WhareHousePublicInfo {
  managers?: WhareHouseManager[];
}

export interface WhareHousePublicInfo {
  id: string;
  name: string;
  location?: string;
  latitude: number;
  longitude: number;
  toolsCount?: number;
}
