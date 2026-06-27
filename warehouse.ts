import { User, UserRole } from './users';

export interface WhareHouseManager {
  userId: string;
  warehouseId: string;
  role: UserRole;
  assignedAt: string;
  user: User;
}

export interface WhareHousePublicInfo {
  id: string;
  name: string;
  location?: string;
  latitude: number;
  longitude: number;
  toolsCount?: number;
}

export interface WhareHouse extends WhareHousePublicInfo {
  managers?: WhareHouseManager[];
}

export interface WhareHouseDetails extends WhareHouse {
  activeRentalsCount: number;
  utilizationRate: number;
  totalRevenue: number;
}
