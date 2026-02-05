# WorkflowOS - AI-Powered Automation Platform

> Enterprise-level workflow automation made simple for small businesses

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- PostgreSQL database (Supabase recommended)
- Redis instance (Upstash recommended)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd WorkflowOS
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in all required environment variables in `.env.local`

4. **Set up the database**
```bash
npm run prisma:push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Start the Temporal worker** (in a separate terminal)
```bash
npm run worker
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
WorkflowOS/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── trpc/             # tRPC endpoints
│   │   │   ├── webhooks/         # Webhook handlers
│   │   │   ├── auth/             # OAuth callbacks
│   │   │   └── upload/           # File upload
│   │   ├── (auth)/               # Auth pages (sign-in, sign-up)
│   │   ├── (marketing)/          # Marketing pages (landing, pricing)
│   │   ├── dashboard/            # Protected dashboard pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── workflows/            # Workflow builder components
│   │   └── shared/               # Shared components
│   ├── lib/                      # Core libraries
│   │   ├── db.ts                 # Prisma client
│   │   ├── redis.ts              # Redis client
│   │   ├── security.ts           # Security utilities
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── services/             # Business logic services
│   │   │   ├── ai.service.ts     # AI/Claude integration
│   │   │   ├── email.service.ts  # Email service
│   │   │   └── stripe.service.ts # Payment service
│   │   └── integrations/         # Third-party integrations
│   │       ├── base.provider.ts  # Base provider interface
│   │       ├── registry.ts       # Provider registry
│   │       └── providers/        # Individual providers
│   ├── server/                   # tRPC server
│   │   └── api/
│   │       ├── context.ts        # Request context
│   │       ├── trpc.ts           # tRPC setup
│   │       ├── root.ts           # Root router
│   │       ├── trpc-handler.ts   # HTTP handler
│   │       └── routers/          # Feature routers
│   │           ├── user.ts
│   │           ├── workflow.ts
│   │           ├── integration.ts
│   │           ├── ai.ts
│   │           ├── analytics.ts
│   │           ├── subscription.ts
│   │           ├── template.ts
│   │           ├── webhook.ts
│   │           ├── notification.ts
│   │           └── audit.ts
│   ├── temporal/                 # Temporal workflow engine
│   │   ├── workflows.ts          # Workflow definitions
│   │   ├── activities.ts         # Activity implementations
│   │   ├── worker.ts             # Worker process
│   │   └── client.ts             # Temporal client
│   ├── hooks/                    # React hooks
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── config/                   # Configuration files
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🔐 Security Features

### ✅ Implemented Security Measures

1. **Data Encryption**
   - AES-256-GCM encryption for sensitive data (API keys, tokens)
   - Bcrypt hashing for passwords
   - Secure token generation

2. **Authentication & Authorization**
   - Clerk for user authentication
   - Role-based access control (RBAC)
   - Protected API routes with tRPC middleware

3. **Rate Limiting**
   - IP-based rate limiting
   - User-based rate limiting
   - API key rate limiting
   - Strict rate limiting for sensitive operations

4. **Security Headers**
   - HSTS (Strict-Transport-Security)
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy

5. **Audit Logging**
   - All user actions logged
   - Security events tracked
   - IP address and user agent logging

6. **Input Validation**
   - Zod schema validation on all inputs
   - XSS prevention
   - SQL injection prevention (Prisma ORM)

7. **Webhook Security**
   - HMAC signature verification
   - Webhook secrets
   - Replay attack prevention

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **API**: tRPC (type-safe API)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis (Upstash)
- **Workflow Engine**: Temporal.io
- **Job Queue**: BullMQ

### Services
- **Auth**: Clerk
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Email**: Resend
- **Payments**: Stripe
- **Storage**: Cloudflare R2
- **Monitoring**: Sentry + PostHog

---

## 🔑 Environment Variables

See `.env.example` for all required environment variables.

### Critical Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI
ANTHROPIC_API_KEY="sk-ant-..."

# Security (Generate with: openssl rand -hex 32)
ENCRYPTION_KEY="..."
```

---

## 📝 Development Workflow

### Running Locally

1. **Start the dev server**
```bash
npm run dev
```

2. **Start the Temporal worker**
```bash
npm run worker
```

3. **Start Temporal server** (if not using cloud)
```bash
npm run temporal:dev
```

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Vercel (Recommended for Frontend)

1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy

### Backend Services

- **Database**: Supabase or Neon
- **Redis**: Upstash
- **Temporal**: Temporal Cloud or self-hosted
- **File Storage**: Cloudflare R2

---

## 📊 Database Schema

The database schema includes:

- **Users & Organizations**: User management and multi-tenancy
- **Workflows**: Workflow definitions and configurations
- **Workflow Runs**: Execution history and logs
- **Integrations**: Third-party service connections
- **Templates**: Pre-built workflow templates
- **Subscriptions**: Billing and plan management
- **Audit Logs**: Security and activity tracking
- **Notifications**: In-app notifications

See `prisma/schema.prisma` for the complete schema.

---

## 🔌 API Routes

### tRPC Routes

- `/api/trpc/user.*` - User management
- `/api/trpc/workflow.*` - Workflow CRUD
- `/api/trpc/integration.*` - Integration management
- `/api/trpc/ai.*` - AI-powered features
- `/api/trpc/analytics.*` - Usage analytics
- `/api/trpc/subscription.*` - Billing management

### Webhook Routes

- `/api/webhooks/clerk` - Clerk user events
- `/api/webhooks/stripe` - Stripe payment events
- `/api/webhooks/[id]` - Custom workflow webhooks

### OAuth Routes

- `/api/auth/callback/[provider]` - OAuth callbacks

---

## 🤖 AI Features

### Workflow Generation
- Natural language to workflow conversion
- Industry-specific templates
- Smart step suggestions

### Optimization
- Workflow performance analysis
- Bottleneck detection
- Efficiency recommendations

### Error Handling
- Plain English error explanations
- Automated fix suggestions
- Proactive issue detection

---

## 🔒 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Encrypt sensitive data** - Use the security utilities
3. **Validate all inputs** - Use Zod schemas
4. **Rate limit endpoints** - Prevent abuse
5. **Audit critical actions** - Log everything
6. **Use HTTPS only** - No exceptions
7. **Keep dependencies updated** - Regular security updates

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Temporal Documentation](https://docs.temporal.io)
- [Clerk Documentation](https://clerk.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

[Your License Here]

---

## 🆘 Support

For support, email support@workflowos.com or join our Discord community.

---

**Built with ❤️ for small businesses**
