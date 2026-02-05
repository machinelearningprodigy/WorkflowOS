# WorkflowOS Setup Guide

## 🎯 Complete Setup Instructions

### Step 1: Prerequisites

Ensure you have:
- Node.js 18.17.0+ installed
- npm 9.0.0+ installed
- Git installed
- A code editor (VS Code recommended)

### Step 2: Clone & Install

```bash
cd c:\Users\Asus\Downloads\WorkflowOS
npm install
```

### Step 3: Set Up Free Services

#### 3.1 Supabase (Database)
1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

#### 3.2 Upstash (Redis)
1. Go to https://upstash.com
2. Sign up and create a Redis database
3. Copy the REST URL and token
4. Add to `.env.local`:
```env
UPSTASH_REDIS_REST_URL="https://[your-url].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[your-token]"
```

#### 3.3 Clerk (Authentication)
1. Go to https://clerk.com
2. Sign up and create an application
3. Copy the API keys
4. Add to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_[...]"
CLERK_SECRET_KEY="sk_test_[...]"
```

#### 3.4 Anthropic (AI)
1. Go to https://console.anthropic.com
2. Sign up (get $5 free credit)
3. Create an API key
4. Add to `.env.local`:
```env
ANTHROPIC_API_KEY="sk-ant-[...]"
```

#### 3.5 Resend (Email)
1. Go to https://resend.com
2. Sign up and verify your domain (or use test domain)
3. Create an API key
4. Add to `.env.local`:
```env
RESEND_API_KEY="re_[...]"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### 3.6 Cloudflare R2 (File Storage)
1. Go to https://cloudflare.com/r2
2. Sign up and create an R2 bucket
3. Get access credentials
4. Add to `.env.local`:
```env
R2_ACCOUNT_ID="[...]"
R2_ACCESS_KEY_ID="[...]"
R2_SECRET_ACCESS_KEY="[...]"
R2_BUCKET_NAME="workflowos-files"
```

#### 3.7 Stripe (Payments)
1. Go to https://stripe.com
2. Sign up and get test API keys
3. Add to `.env.local`:
```env
STRIPE_SECRET_KEY="sk_test_[...]"
STRIPE_PUBLISHABLE_KEY="pk_test_[...]"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_[...]"
```

### Step 4: Generate Security Keys

```bash
# Generate encryption key (Windows PowerShell)
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[BitConverter]::ToString($bytes).Replace("-","").ToLower()
```

Add to `.env.local`:
```env
ENCRYPTION_KEY="[generated-key]"
JWT_SECRET="[another-generated-key]"
```

### Step 5: Configure App URLs

Add to `.env.local`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

### Step 6: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### Step 7: Install Temporal (Optional for Local Development)

**Option A: Use Temporal Cloud (Recommended)**
1. Go to https://temporal.io
2. Sign up for free tier
3. Get connection details
4. Add to `.env.local`:
```env
TEMPORAL_ADDRESS="[your-namespace].tmprl.cloud:7233"
TEMPORAL_NAMESPACE="[your-namespace]"
```

**Option B: Run Temporal Locally**
```bash
# Install Temporal CLI
# Windows: Download from https://github.com/temporalio/cli/releases

# Start Temporal server
npm run temporal:dev
```

Add to `.env.local`:
```env
TEMPORAL_ADDRESS="localhost:7233"
TEMPORAL_NAMESPACE="default"
TEMPORAL_TASK_QUEUE="workflowos-tasks"
```

### Step 8: Run the Application

**Terminal 1: Next.js Dev Server**
```bash
npm run dev
```

**Terminal 2: Temporal Worker**
```bash
npm run worker
```

Open http://localhost:3000

### Step 9: Install UI Components

```bash
# Install shadcn/ui components
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tooltip
```

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Supabase project is active
- Ensure IP is whitelisted in Supabase

### Redis Connection Issues
- Verify Upstash credentials
- Check if Redis instance is active
- Test connection in Upstash console

### Clerk Authentication Issues
- Verify API keys are correct
- Check if Clerk application is active
- Ensure redirect URLs are configured

### Temporal Issues
- Ensure Temporal server is running
- Check worker is connected
- Verify task queue name matches

---

## 📝 Complete .env.local Template

```env
# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Redis
UPSTASH_REDIS_REST_URL="https://[your-url].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[your-token]"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_[...]"
CLERK_SECRET_KEY="sk_test_[...]"
CLERK_WEBHOOK_SECRET="whsec_[...]"

# AI
ANTHROPIC_API_KEY="sk-ant-[...]"
OPENAI_API_KEY="sk-[...]"

# Email
RESEND_API_KEY="re_[...]"
RESEND_FROM_EMAIL="noreply@workflowos.com"

# SMS
TWILIO_ACCOUNT_SID="AC[...]"
TWILIO_AUTH_TOKEN="[...]"
TWILIO_PHONE_NUMBER="+1234567890"

# File Storage
R2_ACCOUNT_ID="[...]"
R2_ACCESS_KEY_ID="[...]"
R2_SECRET_ACCESS_KEY="[...]"
R2_BUCKET_NAME="workflowos-files"
R2_PUBLIC_URL="https://files.workflowos.com"

# Payments
STRIPE_SECRET_KEY="sk_test_[...]"
STRIPE_PUBLISHABLE_KEY="pk_test_[...]"
STRIPE_WEBHOOK_SECRET="whsec_[...]"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_[...]"

# Monitoring
SENTRY_DSN="https://[...]@sentry.io/[...]"
NEXT_PUBLIC_POSTHOG_KEY="phc_[...]"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"

# Security (Generate with: openssl rand -hex 32)
ENCRYPTION_KEY="[generate-32-byte-key]"
JWT_SECRET="[generate-secret]"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"

# Temporal
TEMPORAL_ADDRESS="localhost:7233"
TEMPORAL_NAMESPACE="default"
TEMPORAL_TASK_QUEUE="workflowos-tasks"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS="true"
NEXT_PUBLIC_MAINTENANCE_MODE="false"

# OAuth Integrations
GOOGLE_CLIENT_ID="[...]"
GOOGLE_CLIENT_SECRET="[...]"
MICROSOFT_CLIENT_ID="[...]"
MICROSOFT_CLIENT_SECRET="[...]"

# Webhook URLs
WEBHOOK_BASE_URL="https://api.workflowos.com/webhooks"
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] `npm run dev` starts without errors
- [ ] Database connection works (check Prisma Studio)
- [ ] Redis connection works
- [ ] Clerk authentication loads
- [ ] Can access http://localhost:3000
- [ ] Temporal worker connects (if using)
- [ ] No console errors in browser
- [ ] Environment variables all set

---

## 🚀 Next Steps After Setup

1. **Create First User**
   - Sign up through Clerk
   - Verify user appears in database

2. **Test Database**
   - Open Prisma Studio: `npm run prisma:studio`
   - Verify tables exist

3. **Test API**
   - Open http://localhost:3000/api/trpc
   - Should see tRPC endpoint

4. **Start Building**
   - Implement landing page
   - Build workflow builder
   - Create dashboard UI

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Temporal Docs](https://docs.temporal.io)

---

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages carefully
3. Check environment variables
4. Verify all services are running
5. Check service status pages

---

**Setup Time: ~30 minutes**
**Difficulty: Intermediate**
**Cost: $0/month (free tiers)**
