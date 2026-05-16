/**
 * run seed to fill the database with random values , not run on prod !!!!!!!!!!!!!
 */

import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../users/users.schema';
import { ToolsCategoriesSchema } from '../tools-categories/tools-categories.schema';
import { ToolDocumentSchema } from '../tools/tools.schema';
import { WhareHouseSchema } from '../warehouses/warehouses.schema';
import { ReservationDocumentSchema } from '../reservations/resevations.schema';
import { UserRole, ToolRequestStatus } from '../types';
import { ReservationRequestStatus } from '../types/reservations';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/kiosk-kollectif';

// ObjectIDs prédéfinis pour maintenir les relations
const ids = {
  users: {
    admin: new mongoose.Types.ObjectId('69808968c7bbda1cc9078487'),
    manager: new mongoose.Types.ObjectId('69808968c7bbda1cc9078488'),
    user1: new mongoose.Types.ObjectId('69808968c7bbda1cc907848a'),
    user2: new mongoose.Types.ObjectId('69808968c7bbda1cc907848b'),
  },
  categories: {
    bricolage: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    jardinage: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    mecanique: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
  },
  warehouses: {
    lomeCentral: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
    agoeKiosque: new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
  },
  tools: {
    perceuse: new mongoose.Types.ObjectId('507f191e810c19729de860f1'),
    tondeuse: new mongoose.Types.ObjectId('507f191e810c19729de860f2'),
    pelle: new mongoose.Types.ObjectId('507f191e810c19729de860f3'),
  },
};

async function seed() {
  console.log('--- Démarrage du seedage ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    if (!mongoose.connection.db) {
      throw new Error(
        "La connexion à la base de données n'a pas pu être établie correctement.",
      );
    }

    // Nettoyage des collections
    const collections = [
      'users',
      'tools-categories',
      'tools',
      'warehouses',
      'reservations',
    ];
    for (const name of collections) {
      await mongoose.connection.db.collection(name).deleteMany({});
      console.log(`Collection ${name} vidée`);
    }

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Seed Categories
    const CategoryModel = mongoose.model(
      'ToolsCategories',
      ToolsCategoriesSchema,
    );
    await CategoryModel.insertMany([
      {
        _id: ids.categories.bricolage,
        name: 'Bricolage',
        description: 'Outils de construction et réparation',
      },
      {
        _id: ids.categories.jardinage,
        name: 'Jardinage',
        description: 'Entretien des espaces verts',
      },
      {
        _id: ids.categories.mecanique,
        name: 'Mécanique',
        description: 'Entretien automobile et machines',
      },
    ]);
    console.log('Catégories seedées');

    // 2. Seed Users
    const UserModel = mongoose.model('User', UserSchema);
    await UserModel.insertMany([
      {
        _id: ids.users.admin,
        username: 'admin',
        email: 'admin@kiosk.tg',
        passwordHash,
        role: UserRole.ADMIN,
        active: true,
        verified: true,
        profil: { firstname: 'Super', lastname: 'Admin', phone: '90000001' },
      },
      {
        _id: ids.users.manager,
        username: 'manager',
        email: 'manager@kiosk.tg',
        passwordHash,
        role: UserRole.ADMIN,
        active: true,
        verified: true,
        profil: {
          firstname: 'Gestionnaire',
          lastname: 'Kiosque',
          phone: '90000002',
        },
      },
      {
        _id: ids.users.user1,
        username: 'faouz',
        email: 'faouz@test.tg',
        passwordHash,
        role: UserRole.USER,
        active: true,
        verified: true,
        profil: { firstname: 'Faouzan', lastname: 'Ekouko', phone: '90000003' },
      },
      {
        _id: ids.users.user2,
        username: 'jean',
        email: 'jean@test.tg',
        passwordHash,
        role: UserRole.USER,
        active: true,
        verified: true,
        profil: { firstname: 'Jean', lastname: 'Doe', phone: '90000004' },
      },
    ]);
    console.log('Utilisateurs seedés');

    // 3. Seed Warehouses
    const WarehouseModel = mongoose.model('WhareHouse', WhareHouseSchema);
    await WarehouseModel.insertMany([
      {
        _id: ids.warehouses.lomeCentral,
        name: 'Kiosque Central Lomé',
        location: 'Quartier Administratif',
        capacity: 100,
        manager_id: ids.users.manager,
      },
      {
        _id: ids.warehouses.agoeKiosque,
        name: 'Kiosque Agoè',
        location: 'Agoè-Assiyéyé',
        capacity: 50,
        manager_id: ids.users.manager,
      },
    ]);
    console.log('Entrepôts seedés');

    // 4. Seed Tools
    const ToolModel = mongoose.model('Tool', ToolDocumentSchema);
    await ToolModel.insertMany([
      {
        _id: ids.tools.perceuse,
        name: 'Perceuse à percussion Bosch',
        owner_id: ids.users.admin,
        categories: [ids.categories.bricolage],
        description: 'Perceuse puissante pour béton et bois',
        thumbnail:
          'https://images.unsplash.com/photo-1504148455328-c376907d081c',
        images: [
          'https://images.unsplash.com/photo-1504148455328-c376907d081c',
        ],
        dayprice: 1500,
        price: 45000,
        location: ids.warehouses.lomeCentral,
        status: ToolRequestStatus.ACCEPTED,
        slug: 'perceuse-bosch',
      },
      {
        _id: ids.tools.tondeuse,
        name: 'Tondeuse à gazon électrique',
        owner_id: ids.users.admin,
        categories: [ids.categories.jardinage],
        description: 'Idéal pour petits jardins urbains',
        thumbnail:
          'https://images.unsplash.com/photo-1592419044706-39796d40f98c',
        images: [
          'https://images.unsplash.com/photo-1592419044706-39796d40f98c',
        ],
        dayprice: 2500,
        price: 85000,
        location: ids.warehouses.agoeKiosque,
        status: ToolRequestStatus.ACCEPTED,
        slug: 'tondeuse-electrique',
      },
      {
        _id: ids.tools.pelle,
        name: 'Pelle de chantier robuste',
        owner_id: ids.users.user1,
        categories: [ids.categories.bricolage, ids.categories.jardinage],
        description: 'Acier trempé, manche bois ergonomique',
        thumbnail:
          'https://images.unsplash.com/photo-1580901234832-f3900259e875',
        images: [
          'https://images.unsplash.com/photo-1580901234832-f3900259e875',
        ],
        dayprice: 500,
        price: 5000,
        location: ids.warehouses.lomeCentral,
        status: ToolRequestStatus.ACCEPTED,
        slug: 'pelle-robuste',
      },
    ]);
    console.log('Outils seedés');

    // 5. Seed Reservations
    const ReservationModel = mongoose.model(
      'Reservation',
      ReservationDocumentSchema,
    );
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await ReservationModel.insertMany([
      {
        tool_id: ids.tools.perceuse,
        renter_id: ids.users.user2,
        start_date: today,
        end_date: tomorrow,
        status: ReservationRequestStatus.COMPLETED,
      },
      {
        tool_id: ids.tools.tondeuse,
        renter_id: ids.users.user1,
        start_date: new Date(today.getTime() + 86400000 * 2),
        end_date: new Date(today.getTime() + 86400000 * 3),
        status: ReservationRequestStatus.PENDING,
      },
    ]);
    console.log('Réservations seedées');

    console.log('--- Seedage terminé avec succès ---');
  } catch (error) {
    console.error('Erreur lors du seedage :', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch(console.log);
