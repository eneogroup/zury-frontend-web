# Zury Frontend — Roadmap d'implémentation

Ce document guide l'équipe frontend (humains et agents IA) dans l'ordre d'implémentation des interfaces, en suivant exactement la logique du backend.

**Base URL de l'API :** `https://api-zury.eneogroup.site/api/v1`
**Documentation Swagger interactive :** `https://api-zury.eneogroup.site/api/docs/`

> **Légende :** ✅ Réalisé · 🔄 Partiel / En cours · ⬜ À faire

---

## Conventions globales

### Headers à envoyer sur chaque requête

```
Content-Type: application/json
```

### Headers de géolocalisation (optionnels mais recommandés)

```
X-User-City-ID: <uuid>    # ID de la ville sélectionnée par l'utilisateur
X-User-Lat: <float>       # Latitude GPS
X-User-Lng: <float>       # Longitude GPS
```

### Header d'authentification (routes protégées)

```
Authorization: Bearer <access_token_keycloak>
```

### Pagination

```json
{
  "count": 42,
  "next": "https://...?page=2",
  "previous": null,
  "results": [...]
}
```

### URL patterns importants

> Les endpoints CRUD principaux des établissements utilisent le chemin **français** `etablissements/`
> Les endpoints liés (avis, commandes, tracking, backoffice) utilisent le chemin **anglais** `establishments/`
> Toujours vérifier dans ce document l'URL exacte à utiliser.

---

## Phase 1 — Fondation publique (aucune authentification requise)

### 1.1 Initialisation de l'application ✅

Au premier lancement de l'app, enregistrer l'installation pour les analytics.

```
POST /api/v1/tracking/installation/
Body: { "device_id": "<uuid généré côté client>", "plateforme": "android|ios|web" }
```

- ✅ `device_id` généré et stocké dans `localStorage` via `getDeviceId()`
- ✅ Requête envoyée au premier lancement

---

### 1.2 Sélection de ville ⬜

```
GET /api/v1/villes/
GET /api/v1/villes/pays/
```

- ⬜ Écran de sélection de ville (onboarding ou menu)
- ⬜ Stockage de la ville choisie et injection du header `X-User-City-ID`

> **Note :** Le middleware `CityMiddleware` côté backend filtre automatiquement les résultats si ce header est présent. Ne pas l'envoyer = résultats toutes villes confondues.

---

### 1.3 Page d'accueil — Découverte ✅

```
GET /api/v1/etablissements/featured/
GET /api/v1/etablissements/
GET /api/v1/etablissements/ouverts_maintenant/
GET /api/v1/etablissements/recents/
GET /api/v1/categories/
GET /api/v1/quartiers/
GET /api/v1/stats/
```

- ✅ Hero avec slideshow d'images et barre de recherche
- ✅ Section "Établissements à la une" (`featured/`) avec cards animées
- ✅ Section "Nouveaux établissements" (`recents/`)
- ✅ Section "Événements à venir" et "Ce weekend"
- ✅ Section catégories avec liens rapides
- ✅ Stats publiques (compteurs + météo locale)
- ✅ Chips de recherche rapide (Restaurant, Bar, Hôtel, Événements)

---

### 1.4 Recherche globale & Autocomplétion ✅

```
GET /api/v1/search/autocomplete/?q=<terme>
GET /api/v1/search/?q=<terme>&latitude=<float>&longitude=<float>&rayon=<km>
```

- ✅ Endpoint `searchGlobal` dans `apiSlice`
- ✅ `EstablishmentGateway.search(q, lat, lng)` → passe les coordonnées GPS
- ✅ Thunk `searchEstablishments({ q, lat, lng })` dans le slice
- ✅ Filtre rapide **"Proche de moi"** : demande GPS via `navigator.geolocation` → injecte `lat`/`lng` dans l'URL
- ✅ Détection automatique des mots de proximité (`proche`, `près`, `near`) dans les 3 barres de recherche (Header, HomePage Hero, ExplorerPage)
- ✅ Patterns de recherche avancés supportés : `restaurant:ouvert:poto-poto`, `bar:ouvert`, `hotel luxe`, etc.
- ⬜ Autocomplétion en temps réel (debounce 300ms) sur la barre de recherche

---

### 1.5 Page de détail d'un établissement ✅

```
GET /api/v1/etablissements/<uuid>/
GET /api/v1/etablissements/<uuid>/statut-ouverture/
GET /api/v1/etablissements/<uuid>/similaires/
GET /api/v1/establishments/<uuid>/reviews/
GET /api/v1/establishments/<uuid>/menu/
POST /api/v1/tracking/vue-etablissement/
POST /api/v1/establishments/<uuid>/track/phone/
POST /api/v1/establishments/<uuid>/track/direction/
POST /api/v1/establishments/<uuid>/track/share/
```

- ✅ Page de détail complète (infos, photos, horaires, note, tags, adresse)
- ✅ Statut d'ouverture en temps réel (badge Ouvert/Fermé)
- ✅ Établissements similaires
- ✅ Section avis (lecture)
- ✅ Tracking de vue via `IntersectionObserver` (fire & forget)
- ✅ Throttle IP-based côté backend pour éviter les vues dupliquées
- ✅ Tracking clics téléphone, itinéraire, partage
- 🔄 Menu public de l'établissement (endpoint câblé dans `apiSlice` mais page dédiée non implémentée)

---

### 1.6 Page des événements ✅

```
GET /api/v1/events/
GET /api/v1/events/<uuid>/
POST /api/v1/tracking/vue-event/
```

- ✅ Page liste des événements à venir
- ✅ Détail d'un événement
- ✅ Tracking de vue événement
- ✅ Filtres par période (ce weekend, aujourd'hui)

---

## Phase 2 — Authentification Keycloak ✅

```
Flux OIDC Authorization Code avec PKCE via keycloak-js
```

- ✅ `KeycloakService` avec `login()`, `logout()`, `getToken()`, auto-refresh
- ✅ Token JWT injecté dans les headers via `prepareHeaders` dans `apiSlice`
- ✅ Redirection vers dashboard après login
- ✅ Redirection vers la page d'accueil après logout
- ✅ Store Redux `auth` avec `isAuthenticated`, `user`, `token`
- ✅ `ProtectedRoute` pour les routes nécessitant une authentification
- ⬜ Enregistrement du token Firebase FCM après connexion (`POST /api/v1/me/fcm-token/`)

---

## Phase 3 — Espace utilisateur connecté

### 3.1 Profil utilisateur 🔄

```
GET  /api/v1/me/
PATCH /api/v1/me/
```

- ✅ Page profil (`/profil`) avec affichage des infos Keycloak
- ✅ Endpoint `getUserProfile` et `updateUserProfile` dans `apiSlice`
- 🔄 Modification des préférences (formulaire partiel — erreur TypeScript connue sur `lastName`)

---

### 3.2 Favoris ✅

```
POST /api/v1/etablissements/<uuid>/favorite/
POST /api/v1/events/<uuid>/favorite/
GET  /api/v1/me/favorites/
```

- ✅ Bouton cœur sur chaque carte établissement et événement
- ✅ Page `/favoris` avec liste des favoris sauvegardés
- ✅ Persistance locale via `useFavorites` hook (localStorage + sync API si connecté)
- ✅ Compteur dans le header

---

### 3.3 Historique de visites ✅

```
GET /api/v1/me/history/
```

- ✅ Endpoint câblé dans `apiSlice`
- ⬜ Page dédiée `/historique` (endpoint disponible, UI non faite)

---

### 3.4 Événements sauvegardés ⬜

```
GET    /api/v1/me/saved-events/
POST   /api/v1/me/saved-events/<uuid>/
DELETE /api/v1/me/saved-events/<uuid>/
```

- ✅ Toggle favori événements via `toggleEventFavorite` dans `apiSlice`
- ⬜ Page dédiée de liste des événements sauvegardés

---

### 3.5 Avis — Écrire et gérer 🔄

```
POST   /api/v1/establishments/<uuid>/reviews/
DELETE /api/v1/reviews/<uuid>/
POST   /api/v1/reviews/<uuid>/report/
```

- ✅ Endpoints `addReview` et `deleteReview` dans `apiSlice`
- ⬜ Interface de soumission d'avis sur la page détail établissement
- ⬜ Suppression d'un avis depuis l'espace utilisateur
- ⬜ Signalement d'un avis abusif

---

### 3.6 Réservation d'événement 🔄

```
POST /api/v1/events/<uuid>/book/
GET  /api/v1/me/bookings/
```

- ✅ Endpoint `bookEvent` dans `apiSlice`
- ✅ Endpoint `getUserEventBookings` dans `apiSlice`
- ⬜ Interface de réservation (formulaire + confirmation UI)
- ⬜ Page "Mes réservations d'événements"

---

### 3.7 Réservation de table 🔄

```
POST   /api/v1/establishments/<uuid>/table-reservations/
GET    /api/v1/me/table-reservations/
DELETE /api/v1/me/table-reservations/<uuid>/
```

- ✅ Endpoints `bookTable` et `getUserTableReservations` dans `apiSlice`
- ⬜ Interface de réservation de table sur la page détail
- ⬜ Page "Mes réservations de table"

---

### 3.8 Commandes en ligne 🔄

```
POST /api/v1/establishments/<uuid>/orders/
GET  /api/v1/orders/<uuid>/
GET  /api/v1/me/orders/
POST /api/v1/orders/<uuid>/cancel/
```

- ✅ Endpoints `createOrder`, `getOrderDetails`, `getUserOrders` dans `apiSlice`
- ✅ Endpoint `getMenus` dans `apiSlice`
- ⬜ Interface de commande (menu → panier → checkout)
- ⬜ Suivi de commande en temps réel (polling)
- ⬜ Page "Mes commandes"

---

### 3.9 Fidélité — Points et récompenses ⬜

```
GET  /api/v1/me/points/
GET  /api/v1/rewards/
POST /api/v1/rewards/<uuid>/redeem/
GET  /api/v1/me/loyalty-cards/
```

- ⬜ Page tableau de bord fidélité
- ⬜ Catalogue des récompenses
- ⬜ Cartes de fidélité partenaires

---

### 3.10 Messagerie — Contacter un établissement 🔄

```
GET  /api/v1/me/conversations/
POST /api/v1/me/conversations/
GET  /api/v1/me/conversations/<uuid>/messages/
POST /api/v1/me/conversations/<uuid>/messages/
ws://<domain>/ws/chat/<conversation_id>/
```

- ✅ `MessagingPortal` et `ChatModal` composants implémentés
- ✅ Endpoints `getConversations`, `startConversation`, `getConversationMessages` dans `apiSlice`
- ✅ Bouton messagerie dans le header avec badge de messages non lus
- ⬜ WebSocket temps réel (actuellement polling REST)
- ⬜ `PATCH /me/conversations/<uuid>/read/` pour marquer comme lu

---

### 3.11 Support — Tickets ⬜

```
GET  /api/v1/support/tickets/
POST /api/v1/support/tickets/
POST /api/v1/support/tickets/<uuid>/reply/
```

- ⬜ Interface de création et suivi de tickets support

---

## Phase 4 — Backoffice partenaire

### 4.1 Vue d'ensemble — Mes établissements ⬜

```
GET /api/v1/me/establishments/
GET /api/v1/me/establishments/<uuid>/
```

- ⬜ Dashboard partenaire

---

### 4.2 Formulaire d'inscription établissement 🔄

```
POST /api/v1/etablissements/soumettre/
GET  /api/v1/formulaire/categories/
GET  /api/v1/formulaire/quartiers/
GET  /api/v1/formulaire/tags/
```

- ✅ Page `/rejoindre-zury` avec formulaire de soumission
- 🔄 Erreur TypeScript mineure sur la validation Zod (`errors` property)
- ⬜ Upload de photos lors de la soumission

---

### 4.3 Gestion des médias ⬜

```
GET    /api/v1/backoffice/establishments/<uuid>/medias/
POST   /api/v1/backoffice/establishments/<uuid>/medias/   (multipart/form-data)
PATCH  /api/v1/backoffice/establishments/<uuid>/medias/<uuid>/
DELETE /api/v1/backoffice/establishments/<uuid>/medias/<uuid>/
```

- ⬜ Galerie photo backoffice avec upload drag & drop

---

### 4.4 Gestion du menu ⬜

```
GET    /api/v1/backoffice/establishments/<uuid>/menu/
POST   /api/v1/backoffice/establishments/<uuid>/menu/
PATCH  /api/v1/backoffice/establishments/<uuid>/menu/<uuid>/
DELETE /api/v1/backoffice/establishments/<uuid>/menu/<uuid>/
```

- ⬜ Interface de gestion de la carte (plats, prix, disponibilité)

---

### 4.5 Gestion des événements ⬜

```
GET    /api/v1/backoffice/establishments/<uuid>/events/
POST   /api/v1/backoffice/establishments/<uuid>/events/
PATCH  /api/v1/backoffice/establishments/<uuid>/events/<uuid>/
DELETE /api/v1/backoffice/establishments/<uuid>/events/<uuid>/
```

- ⬜ Interface de création et gestion des événements partenaire

---

### 4.6 Gestion des commandes reçues ⬜

```
GET   /api/v1/backoffice/establishments/<uuid>/orders/
PATCH /api/v1/backoffice/establishments/<uuid>/orders/<uuid>/
GET   /api/v1/backoffice/establishments/<uuid>/orders/stats/
```

- ⬜ Dashboard commandes (en attente, en cours, terminées)
- ⬜ Flux de traitement : PENDING → CONFIRMED → PREPARING → READY → COMPLETED

---

### 4.7 Réservations de table ⬜

```
GET   /api/v1/backoffice/establishments/<uuid>/reservations/
PATCH /api/v1/backoffice/establishments/<uuid>/reservations/<uuid>/
```

- ⬜ Interface de gestion des réservations partenaire

---

### 4.8 Réponses aux avis ⬜

```
POST /api/v1/backoffice/establishments/<uuid>/reviews/<uuid>/respond/
```

- ⬜ Interface de réponse aux avis clients

---

### 4.9 Statistiques et Analytics ✅ (backend) / ⬜ (UI backoffice)

```
GET /api/v1/backoffice/establishments/<uuid>/stats/
GET /api/v1/backoffice/establishments/<uuid>/stats/timeline/
```

- ✅ Endpoints de stats disponibles côté backend avec throttle IP
- ⬜ Dashboard analytics partenaire (graphiques, métriques)

---

### 4.10 Programme de fidélité partenaire ⬜

```
GET   /api/v1/backoffice/establishments/<uuid>/loyalty-card/
POST  /api/v1/backoffice/establishments/<uuid>/loyalty-card/
POST  /api/v1/backoffice/establishments/<uuid>/loyalty-card/stamp/<user_sub>/
```

- ⬜ Configuration de la carte de fidélité
- ⬜ Interface de tamponnage client

---

### 4.11 Messagerie partenaire ⬜

```
GET   /api/v1/backoffice/establishments/<uuid>/conversations/
POST  /api/v1/backoffice/establishments/<uuid>/conversations/<uuid>/messages/
ws://<domain>/ws/chat/<conversation_id>/
```

- ⬜ Boîte de réception partenaire
- ⬜ WebSocket temps réel côté partenaire

---

### 4.12 Publicités (Ads) ⬜

```
GET  /api/v1/backoffice/ads/campaigns/
POST /api/v1/backoffice/ads/campaigns/
POST /api/v1/backoffice/ads/campaigns/<uuid>/submit/
GET  /api/v1/backoffice/ads/campaigns/<uuid>/stats/
GET  /api/v1/backoffice/ads/invoices/<uuid>/pdf/
POST /api/v1/ads/click/
```

- ⬜ Création et gestion des campagnes publicitaires
- ⬜ Tracking des clics sur les bannières sponsorisées

---

## Récapitulatif des flux de tracking passif

Ces appels sont silencieux (fire & forget) — une erreur ne doit jamais bloquer l'UX.

| Événement | Endpoint | Statut |
|-----------|----------|--------|
| Ouverture de l'app | `POST /tracking/installation/` | ✅ |
| Vue établissement | `POST /tracking/vue-etablissement/` | ✅ (avec throttle IP) |
| Vue événement | `POST /tracking/vue-event/` | ✅ |
| Recherche effectuée | `POST /tracking/recherche/` | ⬜ |
| Clic téléphone | `POST /establishments/<uuid>/track/phone/` | ✅ |
| Clic itinéraire | `POST /establishments/<uuid>/track/direction/` | ✅ |
| Clic partage | `POST /establishments/<uuid>/track/share/` | ✅ |
| Clic pub | `POST /ads/click/` | ⬜ |

---

## Phase 5 — Notifications push (Firebase FCM) ⬜

### 5.1 Enregistrement du token FCM

```
POST /api/v1/me/fcm-token/
```

- ⬜ Obtention et envoi du token FCM après connexion Keycloak

### 5.2 Notifications à recevoir et deep links

| `type` dans le payload | Redirection frontend | Statut |
|------------------------|----------------------|--------|
| `NEW_ORDER` | Backoffice → détail commande | ⬜ |
| `ORDER_STATUS` | `/orders/<id>` | ⬜ |
| `RESERVATION_CONFIRMED` | `me/table-reservations/` | ⬜ |
| `RESERVATION_REFUSED` | `me/table-reservations/` | ⬜ |
| `NEW_MESSAGE` | Conversation correspondante | ⬜ |
| `REVIEW_REPORTED` | Avis de l'établissement | ⬜ |
| `SIGNALEMENT` | Backoffice → établissement | ⬜ |

### 5.3 Gestion foreground / background ⬜

- ⬜ Toast/snackbar in-app si l'app est ouverte
- ⬜ Deep link à l'ouverture depuis background/app fermée

---

## Phase 6 — Export partenaire ⬜

> Backend non encore implémenté. Afficher les boutons en état `disabled` avec info-bulle "Bientôt disponible".

```
GET /api/v1/backoffice/establishments/<uuid>/reservations/export/?format=csv|excel
GET /api/v1/backoffice/establishments/<uuid>/reviews/export/?format=csv|excel
```

- ⬜ Boutons d'export CSV/Excel dans le backoffice (désactivés en attendant)

---

## Phase 7 — Fonctionnalités futures (backend non encore disponible) ⬜

### 7.1 Paiement en ligne ⬜

- **Backend :** Non implémenté (passerelle à choisir : Stripe / PayDunya / CinetPay)
- ⬜ Écran de paiement lors d'une réservation ou d'un événement payant
- ⬜ Gestion des remboursements sur annulation
- **À faire dès maintenant :** Ne pas hardcoder "gratuit" — toujours lire `prix` / `est_payant` depuis l'API

### 7.2 Programme de parrainage ⬜

- **Backend :** Non implémenté (prévu dans `apps/referral/`)
- ⬜ Écran "Parrainer un ami" dans le profil
- ⬜ Affichage du code de parrainage unique

### 7.3 Campagnes marketing partenaires ⬜

- **Backend :** Non implémenté (prévu dans `apps/backoffice/` — modèle `Promotion`)
- ⬜ Formulaire de création d'offre promotionnelle
- ⬜ Badge "Promo" sur la fiche établissement

---

## Ordre de développement recommandé (sprints)

| Sprint | Fonctionnalités | Statut |
|--------|----------------|--------|
| S1 | Init projet, client API, sélection ville, liste établissements, recherche | ✅ |
| S2 | Page détail établissement, avis, menu, événements, tracking passif | ✅ |
| S3 | Authentification Keycloak, profil utilisateur, favoris, historique | ✅ |
| S4 | Réservations (événement + table), avis (écriture), événements sauvegardés | 🔄 Partiel |
| S5 | Commandes en ligne (passer, suivre, historique) | ⬜ |
| S6 | Messagerie REST + WebSocket, support tickets | 🔄 REST partiel |
| S7 | Fidélité (points, récompenses, cartes tampons) | ⬜ |
| S8 | Backoffice — Établissements, médias, menu, événements | 🔄 Formulaire soumission partiel |
| S9 | Backoffice — Commandes reçues, réservations, réponses avis, stats + boutons export | ⬜ |
| S10 | Backoffice — Fidélité partenaire, messagerie partenaire, publicités | ⬜ |
| S11 | Notifications push FCM (réception, deep links, foreground/background) | ⬜ |
| S12 | Export CSV/Excel partenaire (dès disponibilité backend) | ⬜ |
| S13 | Paiement en ligne (dès disponibilité backend) | ⬜ |
| S14 | Programme de parrainage (dès disponibilité backend) | ⬜ |
| S15 | Campagnes marketing / offres promotionnelles (dès disponibilité backend) | ⬜ |

---

*Dernière mise à jour : 25 mars 2026*
