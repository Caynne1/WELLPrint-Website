# WELLPRINT Supabase Setup Guide

This document provides step-by-step instructions to configure Supabase for the WELLPRINT printing services platform.

## Prerequisites

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Have your Supabase project URL and API keys ready

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API" → "Project URL" and "Project API keys".

## Database Schema

Run the following SQL queries in your Supabase SQL editor to create the required tables:

### 1. Users Table (for admin/staff)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'staff', -- 'admin' or 'staff'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
```

### 3. Services Table

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_is_active ON services(is_active);
```

### 4. Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT,
  delivery_method VARCHAR(50) NOT NULL, -- 'pickup' or 'delivery'
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  design_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'working', 'will_deliver', 'done'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 5. Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  customization_notes TEXT,
  design_file_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_service_id ON order_items(service_id);
```

### 6. Order Updates Table (for status updates and messages)

```sql
CREATE TABLE order_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  updated_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_updates_order_id ON order_updates(order_id);
```

### 7. Contact Messages Table

```sql
create table if not exists public.contact_messages (
  id            uuid        primary key default gen_random_uuid(),
  full_name     text        not null,
  email         text        not null,
  phone         text,
  concern_type  text        not null,
  order_id      text,
  message       text        not null,
  is_read       boolean     not null default false,
  is_resolved   boolean     not null default false,
  created_at    timestamptz not null default now()
);

-- Indexes
create index if not exists idx_contact_messages_created_at  on public.contact_messages (created_at desc);
create index if not exists idx_contact_messages_is_read     on public.contact_messages (is_read);
create index if not exists idx_contact_messages_is_resolved on public.contact_messages (is_resolved);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) can submit a message
create policy "public can insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated staff/admins can read messages
create policy "authenticated users can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Only authenticated staff/admins can mark read / resolved
create policy "authenticated users can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);
```

### 8. Fees Configuration Table

```sql
CREATE TABLE fees_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_fee DECIMAL(10, 2) DEFAULT 10.00,
  design_service_fee DECIMAL(10, 2) DEFAULT 0.00,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Storage Buckets

Create the following storage buckets in Supabase:

1. **design-uploads** - For customer design file uploads
   - Set to private (authenticated access only)
   - Max file size: 10MB

2. **product-images** - For product images
   - Set to public (read-only)
   - Max file size: 5MB

## Authentication Setup

### Enable Email/Password Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates for password reset and confirmation

### Create Admin User

Run this SQL query to create the first admin user:

```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@wellprint.com',
  crypt('admin_password_here', gen_salt('bf')),
  'Admin User',
  'admin'
);
```

**Note:** Change the email and password to your preferred credentials.

## Row Level Security (RLS)

Enable RLS on all tables and create policies:

### Users Table Policies

```sql
-- Admin can view all users
CREATE POLICY "admin_view_users" ON users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Users can view their own profile
CREATE POLICY "users_view_own" ON users
  FOR SELECT USING (auth.uid() = id);
```

### Products Table Policies

```sql
-- Anyone can view active products
CREATE POLICY "public_view_products" ON products
  FOR SELECT USING (is_active = true);

-- Admin can manage all products
CREATE POLICY "admin_manage_products" ON products
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );
```

### Orders Table Policies

```sql
-- Customers can view their own orders
CREATE POLICY "customers_view_own_orders" ON orders
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

-- Admin and staff can view all orders
CREATE POLICY "admin_staff_view_orders" ON orders
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'staff'))
  );

-- Admin and staff can manage orders
CREATE POLICY "admin_staff_manage_orders" ON orders
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'staff'))
  );
```

## Email Notifications

To send email notifications for order updates:

1. Install Supabase client library:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Set up email templates in Supabase for:
   - Order confirmation
   - Order status updates
   - Order ready for pickup/delivery

3. Create a backend function to send emails (use Supabase Edge Functions or a serverless function)

## Integration with Frontend

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

Create a Supabase client instance in your frontend:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Testing

1. Test admin login with the credentials you created
2. Create a test product through the admin dashboard
3. Add the product to cart from the public site
4. Complete a guest checkout
5. Verify order appears in admin dashboard
6. Test order status updates and email notifications

## Security Considerations

- Always use HTTPS in production
- Keep API keys secure and never commit them to version control
- Use environment variables for sensitive data
- Enable RLS on all tables
- Regularly audit user permissions
- Implement rate limiting for API endpoints
- Validate all user inputs on the backend

## Support

For more information on Supabase, visit the [official documentation](https://supabase.com/docs).
