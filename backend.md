# HungryGo Backend Technical Documentation

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Validation:** Zod
- **ORM:** Prisma
- **Database:** PostgreSQL
- **API:** RESTful or GraphQL (recommendation: REST for MVP, GraphQL for advanced filtering)
- **Authentication:** Clerk (JWT/session integration)

## Architecture Overview
- Modular, service-oriented structure
- Separation of concerns: routes, controllers, services, models
- Type safety and validation at every layer
- Secure, scalable, and maintainable codebase

## Key Features & Implementation

### Authentication & Authorization
- Clerk integration for user management (signup, login, social auth)
- Middleware for protected routes
- Role-based access (customer, admin, delivery agent)

### User Management
- CRUD endpoints for user profiles
- Admin controls for user status, roles
- Data validation with Zod

### Meal Plans & Menu
- Endpoints for listing, creating, updating, deleting meal plans
- Weekly menu management (CRUD for meals, days, types)
- Prisma models for plans, meals, schedules

### Orders & Scheduling
- Order placement, update, cancellation
- Meal schedule endpoints (fetch, update, skip)
- Status tracking (pending, delivered, skipped)

### Subscription Management
- Subscription CRUD (create, pause, resume, cancel)
- Renewal logic (scheduled jobs/cron)
- Billing integration (Stripe or similar, if required)

### Payments
- Payment intent creation, status update
- Webhook handling for payment gateways
- Transaction logging and error handling

### Delivery Management
- Assigning orders to delivery agents
- Status updates (assigned, delivered, skipped)
- Delivery logs and agent management

### Feedback & Ratings
- Endpoints for submitting and retrieving feedback
- Star ratings, comments, category tags
- Admin review and moderation tools

## API Routes

**All endpoints return JSON. Status codes follow REST conventions (200/201 for success, 400 for validation errors, 401/403 for auth, 404 for not found, 500 for server errors). Input is validated with Zod; errors return a consistent error object.**

---

### Authentication
- `POST /api/auth/signup` — Register a new user
  
  **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "string",
    "name": "User Name"
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "token": "jwt_token"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Email already exists"
  }
  ```

- `POST /api/auth/login` — User login
  
  **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
  **Success Response:**
  ```json
  {
    "token": "jwt_token",
    "user": { "id": "user_id", "email": "user@example.com" }
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

- `GET /api/auth/me` — Get current user profile
  
  **Success Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Unauthorized"
  }
  ```

---

### Users
- `GET /api/users/:id` — Get user by ID
  
  **Success Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "User not found"
  }
  ```

- `PUT /api/users/:id` — Update user profile
  
  **Request:**
  ```json
  {
    "name": "New Name"
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "user_id",
    "name": "New Name"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Validation error"
  }
  ```

---

### Meal Plans & Menu
- `GET /api/meal-plans` — List meal plans
  
  **Success Response:**
  ```json
  [
    { "id": "plan1", "name": "Weekly Plan", "price": 49.99 },
    { "id": "plan2", "name": "Monthly Plan", "price": 179.99 }
  ]
  ```

- `POST /api/meal-plans` — Create meal plan (admin)
  
  **Request:**
  ```json
  {
    "name": "Weekly Plan",
    "price": 49.99
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "plan1",
    "name": "Weekly Plan",
    "price": 49.99
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Validation error"
  }
  ```

---

### Orders & Scheduling
- `POST /api/orders` — Place new order
  
  **Request:**
  ```json
  {
    "planId": "plan1",
    "startDate": "2024-06-01"
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "order1",
    "status": "pending"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Plan not found"
  }
  ```

- `GET /api/orders/:id` — Get order details
  
  **Success Response:**
  ```json
  {
    "id": "order1",
    "planId": "plan1",
    "status": "pending",
    "meals": [ ... ]
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Order not found"
  }
  ```

---

### Subscriptions
- `POST /api/subscriptions` — Create subscription
  
  **Request:**
  ```json
  {
    "planId": "plan1"
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "sub1",
    "status": "active"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Already subscribed"
  }
  ```

---

### Payments
- `POST /api/payments/intent` — Create payment intent
  
  **Request:**
  ```json
  {
    "amount": 4999,
    "currency": "USD"
  }
  ```
  **Success Response:**
  ```json
  {
    "clientSecret": "stripe_secret"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Payment failed"
  }
  ```

---

### Delivery
- `POST /api/delivery/assign` — Assign order to agent (admin)
  
  **Request:**
  ```json
  {
    "orderId": "order1",
    "agentId": "agent1"
  }
  ```
  **Success Response:**
  ```json
  {
    "success": true
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Agent not found"
  }
  ```

---

### Feedback & Ratings
- `POST /api/feedback` — Submit feedback
  
  **Request:**
  ```json
  {
    "orderId": "order1",
    "rating": 5,
    "comment": "Great food!"
  }
  ```
  **Success Response:**
  ```json
  {
    "id": "fb1",
    "status": "received"
  }
  ```
  **Error Response:**
  ```json
  {
    "error": "Order not found"
  }
  ```

---

## Data Validation & Error Handling
- Zod schemas for all input validation
- Consistent error responses
- Logging and monitoring (recommendation: Winston, Sentry)

## Security Best Practices
- Environment variable management
- Secure password and token storage
- Input sanitization and rate limiting
- Regular dependency updates

## Deployment & Scaling
- Containerization (Docker recommended)
- CI/CD pipeline for automated testing and deployment
- Horizontal scaling with stateless services
- Database backups and migrations 

---

## Data Model & Relationships

Below are the main entities, their fields, and relationships for HungryGo backend. The schema is designed for Prisma ORM with PostgreSQL.

### Main Models & Relationships
- **User**: has many Orders, Subscriptions, Feedback
- **MealPlan**: has many Meals, Orders, Subscriptions
- **Meal**: belongs to MealPlan
- **Order**: belongs to User, MealPlan; has many Meals (through OrderMeal)
- **Subscription**: belongs to User, MealPlan
- **Payment**: belongs to User, Order
- **DeliveryAgent**: has many DeliveryLogs
- **DeliveryLog**: belongs to Order, DeliveryAgent
- **Feedback**: belongs to User, Order

### Sample Prisma Schema
```prisma
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  name        String
  role        String    // 'customer' | 'admin' | 'agent'
  status      String    // 'active' | 'inactive'
  orders      Order[]
  subscriptions Subscription[]
  feedbacks   Feedback[]
  payments    Payment[]
}

model MealPlan {
  id          String    @id @default(uuid())
  name        String
  price       Float
  description String?
  meals       Meal[]
  orders      Order[]
  subscriptions Subscription[]
}

model Meal {
  id          String    @id @default(uuid())
  name        String
  description String?
  tags        String[]
  mealPlan    MealPlan  @relation(fields: [mealPlanId], references: [id])
  mealPlanId  String
  orderMeals  OrderMeal[]
}

model Order {
  id          String    @id @default(uuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  mealPlan    MealPlan  @relation(fields: [mealPlanId], references: [id])
  mealPlanId  String
  status      String    // 'pending' | 'delivered' | 'cancelled'
  createdAt   DateTime  @default(now())
  orderMeals  OrderMeal[]
  payments    Payment[]
  deliveryLogs DeliveryLog[]
  feedbacks   Feedback[]
}

model OrderMeal {
  id        String   @id @default(uuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  meal      Meal     @relation(fields: [mealId], references: [id])
  mealId    String
  day       String   // e.g., 'Monday'
  type      String   // 'Lunch' | 'Dinner'
}

model Subscription {
  id          String    @id @default(uuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  mealPlan    MealPlan  @relation(fields: [mealPlanId], references: [id])
  mealPlanId  String
  status      String    // 'active' | 'paused' | 'cancelled'
  startDate   DateTime
  endDate     DateTime?
}

model Payment {
  id          String    @id @default(uuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  order       Order     @relation(fields: [orderId], references: [id])
  orderId     String
  amount      Float
  status      String    // 'pending' | 'completed' | 'failed'
  createdAt   DateTime  @default(now())
}

model DeliveryAgent {
  id          String    @id @default(uuid())
  name        String
  status      String    // 'active' | 'inactive'
  deliveryLogs DeliveryLog[]
}

model DeliveryLog {
  id          String    @id @default(uuid())
  order       Order     @relation(fields: [orderId], references: [id])
  orderId     String
  agent       DeliveryAgent @relation(fields: [agentId], references: [id])
  agentId     String
  status      String    // 'assigned' | 'delivered' | 'skipped'
  deliveredAt DateTime?
}

model Feedback {
  id          String    @id @default(uuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  order       Order     @relation(fields: [orderId], references: [id])
  orderId     String
  rating      Int
  comment     String?
  createdAt   DateTime  @default(now())
}
```

> Adjust field types and add more fields as needed for your business logic. This schema provides a solid foundation for the HungryGo backend.

---

## Diagrams

### Entity-Relationship Diagram (ERD)
```mermaid
erDiagram
  User ||--o{ Order : has
  User ||--o{ Subscription : has
  User ||--o{ Feedback : writes
  User ||--o{ Payment : makes
  MealPlan ||--o{ Meal : includes
  MealPlan ||--o{ Order : for
  MealPlan ||--o{ Subscription : for
  Meal ||--o{ OrderMeal : in
  Order ||--o{ OrderMeal : contains
  Order ||--o{ Payment : has
  Order ||--o{ DeliveryLog : tracked_by
  Order ||--o{ Feedback : receives
  Subscription }o--|| MealPlan : subscribes_to
  Subscription }o--|| User : by
  Payment }o--|| User : by
  Payment }o--|| Order : for
  DeliveryAgent ||--o{ DeliveryLog : logs
  DeliveryLog }o--|| Order : for
  DeliveryLog }o--|| DeliveryAgent : by
  Feedback }o--|| User : by
  Feedback }o--|| Order : for
```

### High-Level Architecture Diagram
```mermaid
graph TD
  A[Client (Web/App)] -->|HTTP/REST| B(API Server)
  B -->|Prisma ORM| C[(PostgreSQL DB)]
  B --> D[Authentication (Clerk)]
  B --> E[Payment Gateway (Stripe)]
  B --> F[Monitoring (Sentry)]
  B --> G[Logging (Winston)]
```

## Authorization & Roles
- Endpoints are protected by middleware that checks user roles (customer, admin, delivery agent).
- Example: Only admins can access user management and meal plan creation endpoints; customers can access their own orders and subscriptions.
- Role is determined from the JWT/session (via Clerk).

## Webhooks
- Payment gateways (e.g., Stripe) send POST requests to `/api/payments/webhook`.
- Example payload:
```json
{
  "id": "evt_123",
  "type": "payment_intent.succeeded",
  "data": { "object": { "amount": 4999, "currency": "USD" } }
}
```
- Always verify webhook signatures using the payment provider's SDK before processing.

## Security & Rate Limiting
- Input validation: All incoming data is validated with Zod schemas.
- Rate limiting: Use libraries like `express-rate-limit` to prevent abuse.
- Input sanitization: Use `xss-clean` or similar to prevent XSS attacks.
- Store secrets in environment variables, never in code.

## Testing
- Unit tests: Use Jest for service and utility functions.
- Integration tests: Use Supertest for API endpoint testing.
- End-to-end (e2e): Optional, for full workflow validation.
- Test files are placed alongside source files or in a `/tests` directory.

## Environment Variables
- Required variables:
  - `DATABASE_URL`
  - `CLERK_SECRET`
  - `JWT_SECRET`
  - `STRIPE_SECRET_KEY`
  - `SENTRY_DSN`
- Example `.env.example`:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/hungrygo
CLERK_SECRET=your-clerk-secret
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-key
SENTRY_DSN=your-sentry-dsn
```

## Migrations & Seeding
- Run migrations: `npx prisma migrate deploy` (production) or `npx prisma migrate dev` (development).
- Seed database: `npx prisma db seed` (if a seed script is provided).

## Monitoring & Logging
- Winston is used for structured logging (info, warn, error levels).
- Sentry is integrated for error monitoring and alerting.
- Logs are output to console and/or files; errors are reported to Sentry.

## Getting Started
1. Clone the repo and install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in secrets.
3. Run migrations: `npx prisma migrate dev`
4. Start the server: `npm run dev`
5. Run tests: `npm test`

## Recommended Production Folder Structure

A scalable, maintainable Node.js backend project structure for HungryGo:

```
/backend
│
├── src/                  # Main source code
│   ├── routes/           # Express route definitions (userRoutes.ts, mealRoutes.ts, ...)
│   ├── controllers/      # Request handlers (userController.ts, ...)
│   ├── services/         # Business logic, service classes (userService.ts, ...)
│   ├── models/           # Prisma models and database access (prisma/, custom models)
│   ├── middlewares/      # Express middlewares (auth, error handling, validation)
│   ├── validators/       # Zod schemas for input validation
│   ├── utils/            # Utility functions, helpers
│   ├── config/           # Configuration files (env, db, etc.)
│   ├── jobs/             # Scheduled jobs, cron tasks
│   ├── types/            # Custom TypeScript type definitions
│   └── index.ts          # App entry point
│
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma     # Prisma schema definition
│   └── migrations/       # Database migration files
│
├── public/               # Static files (if needed)
│
├── .env                  # Environment variables
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Containerization config (if used)
└── ...
```

### Folder Descriptions
- **src/**: All application source code.
- **routes/**: API route definitions, grouped by resource.
- **controllers/**: Logic for handling requests and responses.
- **services/**: Business logic, database interaction, external APIs.
- **models/**: Prisma models and any custom data models.
- **middlewares/**: Express middleware for auth, error handling, etc.
- **validators/**: Zod schemas for validating request data.
- **utils/**: Helper functions and utilities.
- **config/**: App configuration, environment, and database setup.
- **jobs/**: Scheduled/recurring background jobs.
- **types/**: Custom TypeScript types and interfaces.
- **prisma/**: Prisma schema and migration files.
- **public/**: Static files (if serving any).
- **.env**: Environment variables for secrets and config.

> For large projects, consider feature-based subfolders (e.g., `src/modules/user/` with its own routes, controllers, services, etc.). Adjust as needed for your team's workflow and scale. 

---

## Backend Development Phases Plan

### Phase 1: Core API & User Flows
- **Goal:** Deliver essential backend APIs and logic to support core customer and admin flows.
- **Key Deliverables:**
  - User authentication & authorization (Clerk integration, JWT/session)
  - User management endpoints (CRUD, roles)
  - Meal plans & menu endpoints (CRUD)
  - Orders & scheduling endpoints (place, update, fetch)
  - Subscription management (create, pause, resume, cancel)
  - Feedback submission endpoint
  - Basic error handling & validation (Zod)
  - PostgreSQL schema (Prisma models)
  - Seed data for development

### Phase 2: Admin, Payments & Delivery
- **Goal:** Enable admin workflows, payment processing, and delivery management.
- **Key Deliverables:**
  - Admin endpoints (user, meal, plan, feedback moderation)
  - Payments integration (Stripe or similar, payment intent, webhooks)
  - Delivery management endpoints (assign, update status, logs)
  - Role-based access control (middleware)
  - Enhanced error logging & monitoring (Winston, Sentry)
  - Rate limiting & security hardening

### Phase 3: Optimization, Testing & Scaling
- **Goal:** Refine, test, and prepare backend for production scale.
- **Key Deliverables:**
  - Comprehensive unit/integration tests (Jest, Supertest)
  - Performance optimization (query tuning, caching if needed)
  - CI/CD pipeline for automated testing/deployment
  - Containerization (Docker)
  - Documentation (API docs, onboarding)
  - Database backup & migration scripts
  - Monitoring & alerting setup

> Adjust phases as needed based on team velocity and business priorities. 