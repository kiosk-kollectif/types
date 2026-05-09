# Kiosk Kollectif - Backend (NestJS)

Bienvenue dans le dépôt du backend de **Kiosk Kollectif**. Cette application est construite avec le framework [NestJS](https://nestjs.com/) et sert d'API centrale pour la gestion des équipements, des utilisateurs et des réservations au sein du réseau Woelab.

## 🚀 Architecture du Projet

Le projet suit l'architecture modulaire de NestJS, facilitant la maintenance et l'évolution.

### Modules Principaux
- **[Auth](./src/auth)** : Gestion de l'authentification (JWT), des stratégies et des gardes de sécurité.
- **[Users](./src/users)** : Gestion des profils utilisateurs, rôles et mises à jour par les admins.
- **[Tools](./src/tools)** & **[Tools Categories](./src/tools-categories)** : Inventaire des équipements et classification par catégories.
- **[Reservations](./src/reservations)** : Cycle de vie des demandes d'emprunt d'outils.
- **[Applicants](./src/applicants)** : Gestion des demandes d'adhésion au kiosque.
- **[Warehouses](./src/warehouses)** : Gestion des lieux de stockage physique.
- **[Verification Codes](./src/verification-codes)** : Système de validation par code (reset password, etc.).

### 🔒 Sécurité et Permissions
Le système utilise des **Guards** personnalisés pour sécuriser les routes :
- `PermissionLevelGuard` ([voir fichier](./src/auth/permission-level.guard.ts)) : Gère l'accès en fonction du rôle (Admin, Applicant, User).
- Invalidation de token ([voir module](./src/invalides-token)) : Permet de révoquer l'accès immédiatement lors de la déconnexion.

## 🛠 Dernières Implémentations (Historique Git)

- **Vérification des permissions** : Amélioration globale de la sécurité sur les endpoints sensibles.
- **Mise à jour Utilisateurs** : Possibilité pour les admins de modifier les profils utilisateurs ([UsersService](./src/users/users.service.ts)).
- **Gestion d'images** : Utilisation de [Cloudinary](./src/common/utils/cloudinary.ts) pour les avatars et thumbnails.
- **Filtres & Pagination** : Implémentation avancée sur les listes d'utilisateurs et d'équipements.

## ⚙️ Configuration

1. **Installation**
   ```bash
   npm install
   ```

2. **Lancement**
   ```bash
   # Développement
   npm run start:dev
   
   # Production
   npm run start:prod
   ```
