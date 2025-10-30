# AI/Cursor Academy - Setup & Implementation Guide

## ✅ What's Been Built

### Core Infrastructure
- ✅ Next.js 16 project with TypeScript and Tailwind CSS
- ✅ Project structure with components, lib, types, and API routes
- ✅ All dependencies installed (Supabase, Stripe, PayPal, Nodemailer)
- ✅ Navigation and Footer components
- ✅ Global layout with proper structure

### Database
- ✅ Complete Supabase schema (`sql/schema.sql`)
  - Users table with authentication
  - Classes table
  - Class schedules table
  - Payments table
  - Enrollments table
  - Row Level Security (RLS) policies
  - Triggers for automatic updates
  - Indexes for performance

### Pages
- ✅ Landing page (`app/page.tsx`) - Beautiful hero, features, benefits sections
- ✅ Registration page (`app/register/page.tsx`) - Full signup form with Supabase auth
- ✅ Login page (`app/login/page.tsx`) - Authentication form

### API Routes
- ✅ Classes API (`app/api/classes/route.ts`) - Fetch all active classes
- ✅ Stripe Payment API (`app/api/payments/stripe/route.ts`) - Create checkout sessions

### Library Files
- ✅ Supabase client (`lib/supabase.ts`)
- ✅ Stripe configuration (`lib/stripe.ts`)
- ✅ PayPal configuration (`lib/paypal.ts`)
- ✅ Email templates (`lib/email.ts`) - Payment confirmation and reminder emails
- ✅ TypeScript types (`types/database.ts`)

### Documentation
- ✅ README.md with setup instructions
- ✅ Environment variables example (`.env.example`)
- ✅ SQL schema with comments

## 🚧 What Still Needs to Be Built

### Critical Pages

1. **Classes Listing Page** (`app/classes/page.tsx`)
   - Display all available classes
   - Show class details, schedules, pricing
   - "Enroll" button that redirects to payment
   - Filter by category/level

2. **User Dashboard** (`app/dashboard/page.tsx`)
   - Show enrolled classes
   - Display upcoming class schedules
   - Show class meeting links
   - Access to class materials (if any)

3. **Admin Dashboard** (`app/admin/page.tsx`)
   - Create/edit/delete classes
   - Manage class schedules
   - View all enrollments
   - View payment records
   - Send manual emails

4. **Payment Success Page** (`app/payment/success/page.tsx`)
   - Handle Stripe/PayPal redirects
   - Create enrollment record
   - Send confirmation email
   - Redirect to dashboard

5. **Class Detail Page** (`app/classes/[id]/page.tsx`)
   - Full class description
   - Available schedules
   - Enroll button

### API Routes Needed

1. **Stripe Webhook** (`app/api/payments/webhook/route.ts`)
   - Handle payment confirmations from Stripe
   - Update payment status
   - Create enrollment
   - Send email

2. **PayPal API** (`app/api/payments/paypal/route.ts`)
   - Create PayPal order
   - Handle PayPal webhook/return

3. **Enrollments API** (`app/api/enrollments/route.ts`)
   - Get user enrollments
   - Create enrollment (after payment)
   - Cancel enrollment

4. **Email API** (`app/api/email/route.ts`)
   - Send manual emails
   - Send reminders (can be cron job)

### Components Needed

1. **ClassCard Component** - Display class info in a card
2. **ScheduleSelector Component** - Let users pick a time slot
3. **PaymentButton Component** - Stripe/PayPal payment buttons
4. **EnrollmentList Component** - Show user's enrollments
5. **AdminClassForm Component** - Create/edit classes

## 📋 Setup Steps

### 1. Supabase Setup
1. Go to https://supabase.com and create a new project
2. In the SQL Editor, run the contents of `sql/schema.sql`
3. Copy your project URL and anon key
4. Get your service role key (Settings > API)

### 2. Environment Variables
Create `.env.local` with:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (optional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Add Sample Classes
In Supabase SQL Editor, add some test classes:

```sql
INSERT INTO public.classes (title, description, long_description, price, duration_hours, instructor_name, meeting_link, category, level)
VALUES 
  ('How to Build a Backend', 'Learn to build robust APIs and server-side applications', 'Comprehensive course covering Node.js, Express, databases, and deployment', 99.99, 4, 'John Doe', 'https://teams.microsoft.com/l/meetup-join/...', 'backend', 'beginner'),
  ('How to Build a Frontend', 'Master React, Next.js, and modern frontend development', 'Build beautiful, responsive user interfaces', 99.99, 4, 'Jane Smith', 'https://teams.microsoft.com/l/meetup-join/...', 'frontend', 'beginner'),
  ('UI/UX Design for Developers', 'Learn design principles and create stunning interfaces', 'Design thinking, Figma, and user experience', 149.99, 6, 'Alex Johnson', 'https://teams.microsoft.com/l/meetup-join/...', 'design', 'intermediate');

-- Add schedules
INSERT INTO public.class_schedules (class_id, start_date, start_time, end_time, timezone)
SELECT 
  id,
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  '14:00:00',
  'America/New_York'
FROM public.classes
WHERE title = 'How to Build a Backend';
```

### 4. Stripe Setup
1. Create account at https://stripe.com
2. Get test API keys from dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/payments/webhook`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`

### 5. Run Development Server
```bash
npm run dev
```

## 🎯 Next Steps Priority

1. **Classes Listing Page** - Most important for users to browse
2. **Payment Success Handler** - Complete the enrollment flow
3. **User Dashboard** - So users can see their enrollments
4. **Stripe Webhook** - Handle successful payments
5. **Email Sending** - Confirm enrollments
6. **Admin Dashboard** - Manage content

## 🔍 Testing Checklist

- [ ] User can register and login
- [ ] User can view all classes
- [ ] User can select a class and schedule
- [ ] Payment flow works (Stripe)
- [ ] Enrollment is created after payment
- [ ] Confirmation email is sent
- [ ] User can view their enrollments
- [ ] Admin can create classes

## 📝 Notes

- The database schema supports multiple payment methods (Stripe, PayPal)
- Email templates are ready but need SMTP configuration
- RLS policies ensure users can only see their own data
- Admin users can manage everything via role check

## 🚀 Deployment

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy!
5. Set up Stripe webhook URL to production

The foundation is solid - most of the infrastructure is complete. Focus on the pages and remaining API routes next!

