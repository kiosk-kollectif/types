import { InternalServerErrorException } from '@nestjs/common';
import { Tool } from './tools.schema';
import { ToolPublicInfo, Tool as ToolInfo, UserPublicInfo } from '../types';
import { mapUserToPublicInfo } from '../users/users.mapper';
import { User } from 'src/users/users.schema';
import { ToolsCategories } from 'src/tools-categories/tools-categories.schema';
import { WhareHouse } from 'src/warehouses/warehouses.schema';

export interface PopulatedTool
  extends Omit<Tool, 'owner_id' | 'categories' | 'location'> {
  owner_id: User;
  categories: ToolsCategories[];
  location?: WhareHouse;
  reservations?: Array<{ start_date: Date; end_date: Date }>;
}

export const mapToolToPublicInfo = (doc: PopulatedTool): ToolPublicInfo => {
  const categories: string[] = [];

  if (Array.isArray(doc.categories)) {
    doc.categories.forEach((cat) => {
      if (cat && typeof cat === 'object' && 'name' in cat) {
        categories.push(cat.name);
      }
    });
  }

  const location =
    doc.location && typeof doc.location === 'object' && 'name' in doc.location
      ? doc.location.name
      : undefined;

  let owner: UserPublicInfo;
  if (
    doc.owner_id &&
    typeof doc.owner_id === 'object' &&
    'username' in doc.owner_id
  ) {
    try {
      owner = mapUserToPublicInfo(doc.owner_id);
    } catch (error) {
      throw new InternalServerErrorException(
        "Sound like you didn't populate owner",
        error as Error,
      );
    }
  } else {
    throw new InternalServerErrorException(
      'Owner must be populated for public info',
    );
  }

  const reservations: string[][] = [];
  if (doc.reservations && Array.isArray(doc.reservations)) {
    doc.reservations.forEach((res) => {
      if (res.start_date && res.end_date) {
        reservations.push([
          new Date(res.start_date).toISOString(),
          new Date(res.end_date).toISOString(),
        ]);
      }
    });
  }

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    thumbnail: doc.thumbnail,
    categories,
    images: doc.images,
    dayprice: doc.dayprice!,
    slug: doc.slug,
    location,
    owner,
    reservations,
  };
};

export const mapToolToInfo = (doc: PopulatedTool): ToolInfo => {
  const categories: { name: string; id: string }[] = [];

  if (Array.isArray(doc.categories)) {
    doc.categories.forEach((cat) => {
      if (cat && typeof cat === 'object' && 'name' in cat) {
        const id = cat._id ? cat._id.toString() : '';
        categories.push({
          name: cat.name,
          id: id,
        });
      }
    });
  }

  return {
    ...mapToolToPublicInfo(doc),
    price: doc.price!,
    status: doc.status,
    categories,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : new Date(doc.createdAt).toISOString(),
  };
};
