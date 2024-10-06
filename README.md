# La Réserve - Projet de Vente et Location de Véhicules

[English version below ↓](#english-version)

(After the French version)

## Installation des dépendances

Pour installer toutes les dépendances nécessaires au projet, exécutez les commandes suivantes dans le répertoire du projet :
bash
Installation des dépendances de base de Next.js
npm install
Installation de Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
Installation des dépendances pour l'internationalisation
npm install next-i18next react-i18next i18next i18next-http-backend i18next-browser-languagedetector
Installation de Recoil pour la gestion d'état
npm install recoil
Installation des dépendances pour les graphiques
npm install react-chartjs-2 chart.js
Installation des dépendances pour le calendrier
npm install react-big-calendar moment
Installation des dépendances pour la virtualisation
npm install react-window react-virtualized-auto-sizer
Installation de react-dropzone pour la gestion des uploads d'images
npm install react-dropzone

## Démarrage du projet

Après avoir installé toutes les dépendances, vous pouvez démarrer le projet en mode développement avec la commande :
bash
npm run dev

Cela lancera le serveur de développement, généralement accessible à l'adresse `http://localhost:3000`.

## Configuration

Assurez-vous d'avoir correctement configuré votre fichier `.env.local` avec les variables d'environnement nécessaires, notamment les clés Supabase.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

## Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm start` : Démarre l'application en mode production
- `npm run lint` : Exécute le linter pour vérifier le code

## Structure du projet

Le projet suit la structure standard d'une application Next.js avec quelques dossiers supplémentaires :

- `app/` : Contient les pages et les composants de l'application
- `components/` : Composants réutilisables
- `lib/` : Fonctions utilitaires et configuration (ex: Supabase, Recoil)
- `public/` : Fichiers statiques et traductions
- `hooks/` : Hooks personnalisés
- `contexts/` : Contextes React (ex: AuthContext)

## Fonctionnalités principales

- Authentification utilisateur avec Supabase
- Internationalisation (i18n) pour le support multilingue
- Gestion d'état globale avec Recoil
- Système de réservation de véhicules
- Tableau de bord administrateur avec graphiques
- Upload et gestion d'images pour les annonces de véhicules

Pour plus d'informations sur la configuration et l'utilisation du projet, veuillez consulter la documentation de chaque package installé.

---

# English Version

## La Réserve - Vehicle Sales and Rental Project

## Installing Dependencies

To install all the necessary dependencies for the project, run the following commands in the project directory:
bash
Installing Next.js core dependencies
npm install
Installing Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
Installing internationalization dependencies
npm install next-i18next react-i18next i18next i18next-http-backend i18next-browser-languagedetector
Installing Recoil for state management
npm install recoil
Installing dependencies for charts
npm install react-chartjs-2 chart.js
Installing dependencies for calendar
npm install react-big-calendar moment
Installing dependencies for virtualization
npm install react-window react-virtualized-auto-sizer
Installing react-dropzone for image upload management
npm install react-dropzone

## Starting the Project

After installing all dependencies, you can start the project in development mode with the command:
bash
npm run dev

This will launch the development server, usually accessible at `http://localhost:3000`.

## Configuration

Make sure you have properly configured your `.env.local` file with the necessary environment variables, especially the Supabase keys.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm start`: Starts the application in production mode
- `npm run lint`: Runs the linter to check the code

## Project Structure

The project follows the standard structure of a Next.js application with a few additional folders:

- `app/`: Contains the application's pages and components
- `components/`: Reusable components
- `lib/`: Utility functions and configuration (e.g., Supabase, Recoil)
- `public/`: Static files and translations
- `hooks/`: Custom hooks
- `contexts/`: React contexts (e.g., AuthContext)

## Main Features

- User authentication with Supabase
- Internationalization (i18n) for multilingual support
- Global state management with Recoil
- Vehicle reservation system
- Admin dashboard with charts
- Image upload and management for vehicle listings

For more information on configuring and using the project, please refer to the documentation of each installed package.
