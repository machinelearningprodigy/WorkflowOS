# WorkflowOS - Architecture & Operational Guide

## 📚 1. Complete File Structure & Inventory

**Total Estimated Files: ~650+**
**Total Directories: ~120+**

### 🧠 **backend (API & Engine)**
*   **Infrastructure (~40 files)**
    *   `src/lib/db.ts` - Database connection
    *   `src/lib/redis.ts` - Queue storage
    *   `src/lib/temporal.ts` - Workflow orchestration
    *   `src/lib/sentry.ts` - Error tracking
    *   `src/config/*.ts` - Environment specific configs (Auth, DB, App)
*   **Workflow Engine ("The Brain") (~15 files)**
    *   `src/lib/workflow-engine/variable-parser.ts` - Resolves `{{steps.1.data}}`
    *   `src/lib/workflow-engine/condition-evaluator.ts` - Logic (IF/ELSE)
    *   `src/lib/workflow-engine/step-runner.ts` - Executes individual nodes
    *   `src/lib/workflow-engine/code-sandbox.ts` - Safe JS execution
*   **API Routes (~130 files)**
    *   `src/app/api/workflows/*` - CRUD, Execute, Pause, Resume
    *   `src/app/api/integrations/*` - Connect, List, Refresh
    *   `src/app/api/auth/*` - Clerk & OAuth Callbacks
    *   `src/app/api/webhooks/*` - Incoming triggers (Stripe, Clerk)
*   **Services (~20 files)**
    *   `src/lib/services/*.service.ts` - Business logic layers (Billing, Email, User)
*   **Workers (~10 files)**
    *   `src/workers/*` - Background job processors (Email, Cleanup, Execution)

### 🎨 **Frontend (UI & UX)**
*   **Core Components (~50 files)**
    *   `src/components/ui/*` - Atomic UI (Button, Card, Inputs, Dialog)
*   **Workflow Builder (~25 files)**
    *   `src/components/workflows/builder/*` - Canvas, Custom Nodes, Edges, Sidebar
    *   `src/components/workflows/nodes/*` - Visuals for Trigger/Action/Logic nodes
*   **Features (~80 files)**
    *   `src/components/auth/*` - Login/Signup forms
    *   `src/components/billing/*` - Pricing tables, Usage bars
    *   `src/components/settings/*` - Profile, Security, Teams
    *   `src/components/analytics/*` - Charts, Graphs, Stats
    *   `src/components/logs/*` - Live consoles, Log viewers
*   **Pages (~50 files)**
    *   `src/app/dashboard/*` - Main app screens
    *   `src/app/(marketing)/*` - Landing page, Pricing, Blog
    *   `src/app/auth/*` - Auth screens

### ⚙️ **Configuration & Types (~50 files)**
*   `src/types/*.types.ts` - TypeScript definitions (User, Workflow, Node)
*   `src/lib/validations/*.schema.ts` - Zod schemas for input validation
*   `prisma/schema.prisma` - Database schema

---

## 🚀 2. How the Platform Works (Architecture)

### **The Core Loop: Trigger → Process → Action**

1.  **Trigger Event**:
    *   A **Webhook** hits `POST /api/webhooks/trigger/[id]`
    *   OR a **Cron Job** fires (via Temporal/Cron)
    *   OR a **User** clicks "Test Run" in the UI.

2.  **Ingestion (API Layer)**:
    *   The API validates the request.
    *   A `WorkflowRun` record is created in Postgres with status `PENDING`.
    *   A job is pushed to the **Redis Queue** (BullMQ/Temporal).

3.  **Processing (Worker Layer)**:
    *   The **Worker** picks up the job.
    *   It loads the `Workflow` definition (JSON) from the database.
    *   It initializes the **Step Runner**.

4.  **Execution (The Engine)**:
    *   **Step 1 (Trigger)**: Parses input data.
    *   **Step 2 (Action)**: 
        *   **Variable Parsing**: The engine scans for `{{steps.trigger.body.email}}`.
        *   **Resolution**: It looks up the value from the Trigger step's output.
        *   **Execution**: It calls the Integration Provider (e.g., SendGrid API).
    *   **Logic (IF/ELSE)**: The **Condition Evaluator** checks if data matches criteria to decide the next path.

5.  **Completion**:
    *   The final outputs are saved to Postgres.
    *   If successful, status -> `COMPLETED`.
    *   If failed, status -> `FAILED` (and potentially retries based on policy).

---

## 👤 3. User Journey & Scenarios

### **Scenario A: User Creating a Workflow**
1.  **User Action**: User clicks "New Workflow" and selects "Webhook Trigger".
2.  **System**: Creates a draft workflow in DB. Generates a unique Webhook URL.
3.  **User Action**: Drags a "Send Email" node onto the canvas and connects it to the Trigger.
4.  **System**: Updates the workflow graph JSON.
5.  **User Action**: Clicks on "Send Email" node options.
6.  **System**: Shows the **Properties Panel**.
7.  **User Action**: In the "To" field, types `{{` and selects `Trigger > Body > Email` from the **Variable Picker**.
8.  **System**: Inserts the variable token.
9.  **User Action**: Clicks "Publish".
10. **System**: Validates the graph (no disconnected nodes). Sets `is_active = true`.

### **Scenario B: Integration Authentication**
1.  **User Action**: User goes to "Integrations" and clicks "Connect Google Sheets".
2.  **System**: Redirects to `/api/auth/google/authorize`.
3.  **User Action**: Approves permissions on Google's consent screen.
4.  **System**:
    *   Receives OAuth code on `/api/auth/callback/google`.
    *   Exchanges code for **Access Token** & **Refresh Token**.
    *   Encrypts tokens using `AES-256`.
    *   Saves to `IntegrationCredential` table in DB.
5.  **Result**: The user can now use "Add Row to Sheet" steps in their workflows without re-authenticating.

### **Scenario C: Handling High Traffic (Scaling)**
1.  **Situation**: 10,000 webhooks hit the system in 1 second.
2.  **API Layer**: Next.js Serverless Functions scale up to handle ingestion. They assume the requests and push 10,000 jobs to Redis almost instantly.
3.  **Queue**: Redis holds the jobs safely.
4.  **Worker Layer**:
    *   If running on a single worker, it processes them sequentially.
    *   **Auto-scaling**: We spin up 50 more Worker instances.
    *   They drain the queue in parallel.
5.  **Database**: Connection pooling (`PgBouncer` or Prisma) ensures the DB isn't overwhelmed by 50 workers writing logs simultaneously.

### **Scenario D: AI Optimization**
1.  **User Action**: User has a complex, messy workflow and clicks "AI Optimize".
2.  **System**:
    *   Serializes the workflow JSON.
    *   Sends prompt to Claude/OpenAI: *"Simplify this logic, merge redundant steps..."*
    *   Receives optimized JSON structure.
3.  **Front-end**: Displays a **Diff View** (Before vs. After).
4.  **User Action**: Clicks "Apply".
5.  **System**: Overwrites the workflow definition with the AI-improved version.

---

## 🛠️ Technology Stack Summary
*   **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, React Flow.
*   **Backend**: Next.js API Routes, tRPC.
*   **Database**: PostgreSQL (Prisma ORM).
*   **Caching/Queue**: Redis (Upstash).
*   **Orchestration**: Temporal .
*   **Auth**: Clerk (User Mgmt), OAuth 2.0 (Integrations).
*   **Testing**: Jest, React Testing Library, MSW.

