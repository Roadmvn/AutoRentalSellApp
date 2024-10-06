# Aperçu du projet

Ce projet consiste en une application web de vente et de location de voitures et de motos, développée avec les technologies suivantes :

## Technologies utilisées

- Frontend : Next.js 14, React, ShadCN, Tailwind CSS, Lucid Icon
- Backend : Supabase
- Base de données : PostgreSQL (via Supabase)
- API : API RESTful fournie par Supabase

## Fonctionnalités principales

1. Catalogue de véhicules
2. Authentification utilisateur
3. Publication d'annonces
4. Système de réservation et d'achat
5. Gestion des paiements
6. Avis et évaluations
7. Notifications en temps réel

## Détails des fonctionnalités

### 1. Catalogue de véhicules
- Recherche avancée avec filtres
- Catégorisation des véhicules
- Affichage détaillé des véhicules
- Disponibilité en temps réel
- Comparaison de véhicules
- Liste de favoris

### 2. Authentification utilisateur
- Inscription et connexion
- Réinitialisation du mot de passe
- Gestion du profil utilisateur
- Sécurité du compte

### 3. Publication d'annonces
- Création et gestion d'annonces
- Statistiques des annonces
- Planification de disponibilité
- Options de promotion

### 4. Système de réservation et d'achat
- Processus de réservation et d'achat
- Confirmation et suivi des transactions
- Annulation et remboursement
- Gestion des contrats et documents

### 5. Gestion des paiements
- Intégration de passerelles de paiement sécurisées
- Gestion des factures
- Historique des transactions
- Gestion des commissions et remboursements

### 6. Avis et évaluations
- Système de notation
- Gestion des commentaires
- Réponses des vendeurs
- Filtrage et modération des avis

### 7. Notifications en temps réel
- Notifications pour diverses activités
- Canaux de notification multiples
- Centre de notifications
- Paramètres de notification personnalisables

## Structure du projet actuel

LA_RESERVE/
│
├── app/
├── components/
├── hooks/
├── lib/
├── node_modules/
├── .eslintrc.json
├── .gitignore
├── components.json
├── frontend_instructions.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

Règles de structure du projet :

1. Composants :
   - Emplacement : dossier /components
   - Nomenclature : example-component.tsx (sauf indication contraire)

2. Pages :
   - Emplacement : dossier /app
