import { User } from './users.schema';
import { UserPublicInfo, User as UserInfo } from '../types';

export const mapUserToPublicInfo = (doc: User): UserPublicInfo => {
  const memberSince = (
    doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
  ).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    role: doc.role,
    verified: doc.verified,
    profil: doc.profil
      ? {
          picture: doc.profil?.picture,
          thumbnail: doc.profil?.thumbnail,
        }
      : undefined,
    memberSince,
  };
};

export const mapUserToInfo = (doc: User): UserInfo => {
  const info = mapUserToPublicInfo(doc);
  return {
    active: doc.active,
    ...info,
    profil: doc.profil
      ? {
          firstname: doc.profil.firstname,
          lastname: doc.profil.lastname,
          adress: doc.profil.adress,
          phone: doc.profil.phone,
          picture: doc.profil.picture,
          thumbnail: doc.profil.thumbnail,
        }
      : undefined,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date(doc.createdAt).toISOString(),
  };
};
