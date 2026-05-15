# InsightCart — JEE BigData E-Commerce Platform

Full-stack e-commerce platform with a Big Data analytics pipeline. Built with Spring Boot 3, React 19, and a Hadoop/HBase/Flume/MapReduce stack.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  React App   │────▶│ Spring Boot  │────▶│     MySQL       │
│  (Vite)      │     │  (API:9090)  │     │  (DB:3306)      │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐     ┌─────────────────┐
                    │ BigData Log  │────▶│   Apache Flume  │
                    │ (File Appender)   │  (HDFS Spool)    │
                    └──────────────┘     └────────┬────────┘
                                                  │
                    ┌─────────────────┐     ┌──────▼────────┐
                    │   HBase (NoSQL) │◀────│  MapReduce    │
                    │  Analytics DB   │     │  (Hadoop 3)   │
                    └─────────────────┘     └───────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.4, Spring Security + JWT |
| Frontend | React 19, Vite 8, Tailwind CSS 3, Recharts |
| Database | MySQL 8 (relational), HBase 2.5 (analytics) |
| Big Data | Hadoop 3.2 (HDFS), Apache Flume, MapReduce |
| Orchestration | Docker Compose |

## Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 20+ (for local frontend dev)

## Quick Start

```bash
# Clone and start everything
git clone <repo>
cd JEE-BigData-Project

# Start all services
docker compose up --build -d

# Wait ~3 min for Hadoop/HBase initialization
# Then access:
#   Frontend:  http://localhost:5173
#   API:       http://localhost:9090
#   HDFS UI:   http://localhost:9870
#   HBase UI:  http://localhost:16010
```

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | customer1@olist.com | password123 |

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/products` | List active products |
| GET | `/api/products/{id}` | Product detail |
| GET | `/api/categories` | List categories |
| GET | `/api/products/{id}/reviews` | Get product reviews |

### Authenticated
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Current user profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/orders/my-orders` | User order history |
| POST | `/api/orders` | Create order |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist/{id}` | Add to wishlist |
| POST | `/api/products/{id}/reviews` | Add review |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analytics/*` | All analytics endpoints |
| GET/POST/PUT/DELETE | `/api/products/**` | Product CRUD |
| POST/PUT/DELETE | `/api/categories/**` | Category management |
| GET | `/api/users` | List all users |
| GET/PATCH | `/api/orders/admin/**` | Order management |

## Big Data Pipeline

1. **Logging** — Order/review events are logged as JSON to `/app/logs/bigdata_events.log`
2. **Flume** — Spools logs from `archived/` directory to HDFS (`/data/realtime/`)
3. **MapReduce** — Historical jobs process Olist CSVs; realtime jobs process Flume output
4. **HBase** — Analytical results stored in 5 HBase tables for dashboard consumption
5. **Scheduler** — Every 2 min checks log file size (triggers MR at 128MB)

## Development

```bash
# Backend (local)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (local)
cd frontend-ecommerce
npm install
npm run dev
```

## Project Structure

```
├── src/                          # Spring Boot backend
│   └── main/java/com/example/demo/
│       ├── config/               # Security, HBase, data init
│       ├── controllers/          # REST API controllers
│       ├── entities/             # JPA entities
│       ├── repositories/         # Spring Data JPA repos
│       ├── services/             # Business logic
│       ├── security/             # JWT filter & util
│       ├── scheduler/            # Pipeline scheduler
│       └── dto/                  # Data transfer objects
├── frontend-ecommerce/           # React frontend
│   └── src/
│       ├── components/           # UI components
│       ├── pages/                # Page-level components
│       ├── context/              # Auth, Cart, Wishlist state
│       └── api/                  # Axios config
├── mapreduce/                    # MapReduce jobs
│   └── src/main/java/com/bigdata/
├── flume/                        # Flume configuration
├── data/                         # Olist CSV datasets
├── docker-compose.yml            # Service orchestration
└── .env                          # Environment variables
```
