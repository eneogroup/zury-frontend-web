# Zury Backend — API v1.9.0

API REST + WebSockets pour l'application Zury : découverte des établissements et événements.

**Stack :** Django 5.1 · DRF 3.15 · PostgreSQL · Redis · Cloudinary · Keycloak SSO · Railway

---

## Architecture

```
apps/
├── core/           — Pagination, permissions admin, recherche globale, météo, géocodage
├── etablissements/ — Établissements, catégories, quartiers, villes, médias, tags, horaires web
├── events/         — Événements par établissement
├── tracking/       — Tracking anonyme (vues, clics, partages)
├── users/          — Profil Keycloak, favoris, historique, événements sauvegardés
├── reviews/        — Avis, réponses, signalements, réservations table
├── backoffice/     — Espace partenaire (établissements, médias, menu, événements, stats)
├── loyalty/        — Points de fidélité, niveaux, récompenses, cartes tampons
├── messaging/      — Messagerie interne (REST + WebSocket)
├── ads/            — Système publicitaire (Campagnes, Factures, Stats)
└── support/        — Système de tickets (Support partenaires & utilisateurs)

config/
├── settings/
│   ├── base.py        — Configuration commune
│   ├── development.py — Surcharge dev locale
│   └── production.py  — Surcharge Railway
├── urls.py
├── asgi.py            — HTTP + WebSockets (Django Channels)
└── wsgi.py
```

---

## Variables d'environnement

Copier `.env.example` en `.env` et remplir les valeurs :

```bash
# Django
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=

# Base de données (PostgreSQL)
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432

# Redis (cache + Channel Layers)
REDIS_URL=redis://127.0.0.1:6379/1

# Cloudinary (médias)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Keycloak SSO
KEYCLOAK_URL=
KEYCLOAK_REALM=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=

# eneo-account (service profil externe)
ENEO_ACCOUNT_URL=

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=Zury <noreply@zury.app>
ADMIN_EMAIL=

# Frontend (pour les QR codes)
FRONTEND_URL=https://zury-web.vercel.app

# Firebase FCM (optionnel — notifications push)
FIREBASE_CREDENTIALS_JSON={}

# Admin API Key
ADMIN_API_KEY=
```

---

## Démarrage local

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Pour les WebSockets (messagerie temps réel), lancer avec Daphne :

```bash
daphne -p 8000 config.asgi:application
```

---

## Endpoints principaux

### Public

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/v1/establishments/` | Liste des établissements |
| GET | `/api/v1/establishments/featured/` | Établissements à la une (Ads & Tendances) |
| GET | `/api/v1/establishments/{id}/` | Détail d'un établissement |
| GET | `/api/v1/events/` | Liste des événements |
| GET | `/api/v1/search/` | Recherche globale (`?ouvert=true` filterable) |
| GET | `/api/v1/search/autocomplete/` | Autocomplétion |
| GET | `/api/v1/villes/` | Liste des villes actives |
| GET | `/api/v1/villes/pays/` | Liste des pays actifs |
| GET | `/api/v1/stats/` | Stats publiques (avec météo locale) |
| GET | `/api/v1/health/` | Health check |

### Géolocalisation & Multi-ville

L'API supporte désormais nativement le multi-ville et la détection automatique de la position. Les listes d'établissements et d'événements sont filtrées par ville et triées par proximité ultra-performante (Haversine SQL).

**Fonctionnalités "City-Aware" :**
- **Trending Local** : La vue Featured (`/api/v1/establishments/featured/`) met en avant les établissements les plus vus des 7 derniers jours dans la ville de l'utilisateur.
- **Météo Temps Réel** : L'endpoint `/api/v1/stats/` renvoie la météo locale exacte basée sur les coordonnées GPS ou la ville.
- **Géocodage Automatique** : Les villes ajoutées en backoffice récupèrent automatiquement leurs coordonnées (via Nominatim).
- **Horaires Intelligents** : L'API identifie si un lieu est ouvert au moment présent via le paramètre de recherche `ouvert=true` et renvoie des messages d'ouverture (ex: `Ouvert jusqu'à 22:00`).
- **Recherche Globale & Autocomplete** : Résultats filtrés automatiquement par ville.
- **Publicités (Ads)** : Les campagnes sponsorisées sont ciblées par ville.

**Headers de localisation :**
- `X-User-City-ID` : ID de la ville (force le filtrage sur cette ville).
- `X-User-Lat` : Latitude de l'utilisateur.
- `X-User-Lng` : Longitude de l'utilisateur.

Si aucun header n'est présent, l'API utilise la ville préférée configurée dans le profil utilisateur.

### Utilisateur connecté (`/api/v1/me/`)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET/PATCH | `/me/` | Profil (données Keycloak + préférences) |
| GET | `/me/favorites/` | Établissements favoris |
| POST/DELETE | `/me/favorites/{id}/` | Ajouter/retirer un favori |
| GET | `/me/history/` | Historique des 50 dernières visites |
| GET | `/me/saved-events/` | Événements sauvegardés |
| POST/DELETE | `/me/saved-events/{id}/` | Sauvegarder/retirer un événement |
| GET | `/me/bookings/` | Réservations d'événements |
| GET | `/me/table-reservations/` | Réservations de table |
| DELETE | `/me/table-reservations/{id}/` | Annuler une réservation de table |
| GET | `/me/points/` | Points fidélité + niveau + transactions |
| GET | `/me/loyalty-cards/` | Cartes de fidélité partenaires |
| GET | `/me/conversations/` | Conversations |
| POST | `/me/conversations/` | Démarrer une conversation |
| GET/POST | `/me/conversations/{id}/messages/` | Messages d'une conversation |
| PATCH | `/me/conversations/{id}/read/` | Marquer comme lus |
| POST | `/me/fcm-token/` | Enregistrer le token Firebase |
| GET/POST | `/me/support/tickets/` | Mes tickets de support |
| GET/POST | `/me/support/tickets/{id}/messages/` | Messages d'un ticket |

### Avis & Réservations

| Méthode | URL | Description |
|---------|-----|-------------|
| GET/POST | `/establishments/{id}/reviews/` | Avis (tri `?sort=recent\|best\|worst`) |
| DELETE | `/reviews/{id}/` | Supprimer son avis |
| POST | `/reviews/{id}/report/` | Signaler un avis |
| POST | `/establishments/{id}/bookings/` | Réserver un événement |
| POST | `/establishments/{id}/table-reservations/` | Réserver une table |

### Fidélité

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/rewards/` | Catalogue des récompenses |
| POST | `/rewards/{id}/redeem/` | Échanger des points |
| GET | `/establishments/{id}/loyalty-card/` | Carte fidélité d'un établissement |

### Tracking anonyme

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/establishments/{id}/track/phone/` | Clic téléphone |
| POST | `/establishments/{id}/track/direction/` | Clic itinéraire |
| POST | `/establishments/{id}/track/share/` | Partage |

### Backoffice partenaire (`/api/v1/backoffice/`)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET/POST | `/backoffice/establishments/` | Mes établissements |
| GET/PATCH | `/backoffice/establishments/{id}/` | Détail / modifier |
| GET/POST | `/backoffice/establishments/{id}/medias/` | Médias |
| PATCH/DELETE | `/backoffice/establishments/{id}/medias/{mid}/` | Modifier / supprimer média |
| GET/POST | `/backoffice/establishments/{id}/menu/` | Carte menu |
| PATCH/DELETE | `/backoffice/establishments/{id}/menu/{mid}/` | Modifier / supprimer plat |
| GET/POST | `/backoffice/establishments/{id}/events/` | Événements |
| PATCH/DELETE | `/backoffice/establishments/{id}/events/{eid}/` | Modifier / supprimer événement |
| GET | `/backoffice/establishments/{id}/stats/` | Stats globales |
| GET | `/backoffice/establishments/{id}/stats/timeline/` | Série temporelle |
| GET | `/backoffice/establishments/{id}/qrcode/` | QR code PNG |
| POST | `/backoffice/establishments/{id}/reviews/{rid}/respond/` | Répondre à un avis |
| GET | `/backoffice/establishments/{id}/reservations/` | Réservations de table |
| PATCH | `/backoffice/establishments/{id}/reservations/{rid}/` | Confirmer / refuser |
| GET/POST/PATCH | `/backoffice/establishments/{id}/loyalty-card/` | Carte fidélité |
| POST | `/backoffice/establishments/{id}/loyalty-card/stamp/{user_sub}/` | Tamponner |
| GET | `/backoffice/establishments/{id}/conversations/` | Conversations |
| GET/POST | `/backoffice/establishments/{id}/conversations/{cid}/messages/` | Messages / répondre |
| PATCH | `/backoffice/establishments/{id}/conversations/{cid}/read/` | Marquer comme lus |

### WebSocket — Messagerie temps réel

```
ws://<domain>/ws/chat/<conversation_id>/
```

Le token JWT Keycloak doit être passé dans le header `Authorization` lors de la négociation WebSocket.

---

## Authentification

Toutes les routes protégées utilisent un JWT Keycloak :

```
Authorization: Bearer <access_token>
```

Géré par `eneo-common` via `IsKeycloakAuthenticated`.

---

## Déploiement (Railway)

Configuré via `railway.toml` (builder NIXPACKS) :

```toml
[build]
builder = "NIXPACKS"
buildCommand = "python manage.py collectstatic --noinput"

[deploy]
preStartCommand = "python manage.py migrate --noinput"
startCommand = "gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 60"
healthcheckPath = "/api/v1/health/"
```

> Pour activer les WebSockets en production, remplacer le `startCommand` par `daphne config.asgi:application --bind 0.0.0.0 --port $PORT`.

---

## Documentation API interactive

- Swagger UI : `/api/docs/`
- ReDoc : `/api/redoc/`
- Schéma OpenAPI : `/api/schema/`

---

## Administration
L'interface d'administration est propulsée par **Django Jazzmin**, offrant un design moderne, un mode sombre et un tableau de bord analytique complet.
- URL : `/admin/`
- Dashboard Global : `/admin/dashboard/`

