# AI/Cursor Academy

A comprehensive learning platform for teaching AI-assisted coding with Cursor. Built with Next.js, Supabase, Stripe, and PayPal integration.

## Features

- 🎓 **Class Management**: Create and manage coding classes
- 💳 **Payment Integration**: Stripe and PayPal support
- 📧 **Email Automation**: Automatic enrollment confirmations and reminders
- 👥 **User Dashboard**: Students can view enrolled classes
- 🔐 **Authentication**: Secure user registration and login
- 📅 **Schedule Management**: Multiple time slots per class
- 👨‍💼 **Admin Dashboard**: Manage classes, students, and schedules

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Payments**: Stripe, PayPal
- **Email**: Nodemailer with SMTP
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install很好地
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema from `sql/schema.sql` in your Supabase SQL editor
3. Copy your Supabase URL and API keys

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 4. Set Up Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhooks pointing to `https://yourdomain.com/api/payments/webhook`

### 5. Set Up PayPal (Optional)

1. Create a PayPal developer account
2. Create an app to get your Client ID
3. Add it to your environment variables

### 6. Configure Email (SMTP)

1. Use Gmail, SendGrid, or any SMTP service
2. For Gmail, create an app password
3. Add SMTP credentials to environment variables

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Database Schema

The database includes:
- `users`: User profiles
- `classes`: Course information
- `class_schedules`: Time slots for classes
- `payments`: Payment records
- `enrollments`: Student enrollments

See `sql/schema.sql` for the complete schema.

## Project Structure

```
ai-cursor-academy/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── classes/           # Classes listing
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utility libraries
├── types/                 # TypeScript types
├── sql/                   # Database schema
└── public/                # Static assets
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Adding Classes

Classes can be added via:
1. Supabase dashboard (direct SQL insert)
2. Admin dashboard (coming soon)
3. API endpoint (for programmatic creation)

## Features to Build

- [x] Landing page
- [x] Authentication (register/login)
- [x] Supabase setup
- [ ] Classes listing page
- [ ] Payment integration (Stripe)
- [ ] Payment integration (PayPal)
- [ ] User dashboard
- [ ] Admin dashboard
- [ ] Email automation
- [ ] Class enrollment flow
- [ ] Vercel deployment config

## License

Private - Attendee to limit
