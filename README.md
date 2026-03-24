# CyberWatch — SSH Honeypot Dashboard

CyberWatch is a real-time cybersecurity monitoring dashboard built on a microservices architecture. It deploys a Cowrie SSH honeypot to attract attackers, collects and analyzes their behavior, and displays live attack data on an interactive dashboard.

## What problem does it solve?

Security teams need visibility into attack patterns targeting their infrastructure. CyberWatch provides a safe, isolated environment to observe real attacker behavior — credentials used, commands executed, and geographic origins — without exposing real systems.

## Technology Stack

| Service | Technology | Role |
|---------|-----------|------|
| Frontend | React + Vite + TailwindCSS + DaisyUI | Live dashboard |
| API 1 | Node.js + Express + PostgreSQL | Log ingestion from Cowrie |
| API 2 | Node.js + Express + MongoDB | IP enrichment and alerts |
| Cowrie | Official Docker image | SSH/Telnet honeypot |
| Nginx | nginx:alpine | Reverse proxy |
| Database 1 | PostgreSQL 16 | Raw event storage |
| Database 2 | MongoDB 6.0 | Alerts and analysis storage |

## Architecture
```
Internet
    │
    ▼
[Nginx :80] ──────────────────────────────────┐
    │                                          │
    ├── /          → Frontend (Vite :5173)     │
    ├── /api1/     → API 1 (:4001)             │
    └── /api2/     → API 2 (:4002)             │
                                               │
[Cowrie :22/:2222] → logs → API 1 → PostgreSQL │
                                               │
Frontend → API 2 → MongoDB                    │
```

### Network Isolation

| Network | Services |
|---------|---------|
| frontend-net | nginx, frontend, api1, api2 |
| backend1-net | api1, db1, cowrie |
| backend2-net | api2, db2 |

Databases are never directly accessible from the frontend or from each other.

## Installation

### Prerequisites

- Docker and Docker Compose installed
- Git installed

### Steps
```bash
# 1. Clone the repository
git clone https://git.zohrabi.cloud/cdof5-final-project/team-02.git
cd team-02

# 2. Create environment file
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker compose up -d --build

# 4. Access the dashboard
open http://localhost
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `cwuser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `cyberwatch123` |
| `POSTGRES_DB` | PostgreSQL database name | `cyberwatch` |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | `cwuser` |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | `cyberwatch123` |
| `MONGO_INITDB_DATABASE` | MongoDB database name | `cyberwatch` |
| `VITE_API1_URL` | API 1 URL for frontend | `http://localhost:4001` |
| `VITE_API2_URL` | API 2 URL for frontend | `http://localhost:4002` |
| `ABUSEIPDB_API_KEY` | AbuseIPDB API key for IP reputation | `your_key_here` |

## Data Flow

1. Attacker connects via SSH on port 22
2. Cowrie accepts all credentials and simulates a fake Linux server
3. Cowrie writes JSON logs to a shared Docker volume
4. API 1 detects new logs via file watcher and stores events in PostgreSQL
5. Frontend fetches events from API 1 every 5 seconds
6. Frontend sends unique IPs to API 2 for analysis
7. API 2 geolocates IPs (ip-api.com) and checks reputation (AbuseIPDB)
8. API 2 stores alerts in MongoDB
9. Dashboard displays live events, world map, attack charts and alerts

## Dashboard Features

- **Live Events Feed** — real-time SSH attack events with IP, credentials and commands
- **World Map** — geographic origin of attacks colored by intensity
- **Attacks per Hour** — bar chart of attack frequency
- **Stats Cards** — total events, unique IPs, active sessions, malicious IPs
- **Alerts Panel** — IPs flagged by AbuseIPDB with abuse score
- **Top Credentials** — most used usernames and passwords
- **Top Commands** — most executed commands by attackers

## CI/CD Pipeline

The pipeline runs on Gitea Actions on every push to `main` or `develop`:

1. **Security Scan** — Trivy scans all Docker images for MEDIUM/HIGH/CRITICAL vulnerabilities
2. **Build & Push** — Images are built and pushed to Docker Hub

Docker Hub images:
- `antoninronseray/cyberwatch-api1:latest`
- `antoninronseray/cyberwatch-api2:latest`
- `antoninronseray/cyberwatch-frontend:latest`

## Demo

The live honeypot is deployed at `http://164.92.240.36`

To simulate an attack:
```bash
ssh root@164.92.240.36
# Enter any password — Cowrie accepts everything
```

## Screenshots

*(Add screenshots here)*