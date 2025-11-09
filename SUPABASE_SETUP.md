# Senthur Murugan Enterprises - Supabase Integration Guide

## Overview
This guide will help you set up Supabase as the backend for your scaffolding/construction equipment rental management system.

## Prerequisites
- Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Expo CLI installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: Senthur Murugan Enterprises
   - Database Password: (create a strong password)
   - Region: Choose closest to your location
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Run the SQL Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the contents of `supabase-schema.sql`
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
7. Wait for the query to complete - you should see "Success. No rows returned"

This will create:
- All database tables (products, parties, transactions, user_profiles, dashboard_metrics)
- Database functions and triggers
- Row Level Security policies
- Views for easier querying
- Seed data with your initial products and parties

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the Settings menu
3. You will see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

## Step 4: Configure Your App

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Open `supabaseClient.js` and update the credentials at the top:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

## Step 5: Install Dependencies

Run the following command to ensure all dependencies are installed:

```bash
npm install
```

## Step 6: Enable Email Authentication (Optional)

By default, Supabase requires email confirmation for new users. To disable this for testing:

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Scroll to "Email Auth"
3. **Disable** "Confirm email" if you want to test without email verification
4. Click "Save"

## Step 7: Test Your App

1. Start the Expo development server:
   ```bash
   npx expo start
   ```

2. Test the following features:
   - **Register**: Create a new account
   - **Login**: Sign in with your credentials
   - **Dashboard**: View metrics and recent activity
   - **Stocks**: View all products and their allocation
   - **Party**: View all parties, add new parties, delete parties
   - **Add Party**: Create a new customer
   - **User Details**: View transaction history for a party
   - **Add Item**: Create transactions (give/return items)

## Database Structure

### Tables

#### products
- Stores all inventory items (Span, Jackey, Sheet, Cuplock, etc.)
- Tracks total quantity, party stock, yard stock
- Includes rate per month for rental calculations

#### parties
- Customer/party information
- Contact details (name, phone, email, address)
- Active status for soft deletes

#### transactions
- Records of items given to or returned from parties
- Links products and parties
- Includes transaction date and type (given/returned)
- Automatically updates product stock via database triggers

#### user_profiles
- Extended user information linked to Supabase Auth
- Stores full name, phone number, role

#### dashboard_metrics
- Cached calculations for dashboard display
- Updated via database function

### Key Features

#### Automatic Stock Updates
When you add a transaction:
- **Given**: Increases party_stock, decreases yard_stock
- **Returned**: Decreases party_stock, increases yard_stock
- Updates happen automatically via database triggers

#### Dashboard Metrics Calculation
The `calculate_dashboard_metrics()` function calculates:
- Total revenue (party_stock × rate_per_month)
- Stock value (total_quantity × rate_per_month)
- Active parties count
- Active products count
- Stock utilization percentage

To manually recalculate metrics, run in SQL Editor:
```sql
SELECT calculate_dashboard_metrics();
```

## API Functions Available

All functions are in `supabaseClient.js`:

### Authentication
- `signUp(email, password, fullName, phoneNumber)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user session
- `getUserProfile(userId)` - Get user profile

### Products
- `fetchProducts()` - Get all products
- `fetchProductById(productId)` - Get single product
- `addProduct(productData)` - Add new product
- `updateProduct(productId, updates)` - Update product
- `updateProductStock(productId, partyStock, yardStock)` - Update stock manually

### Parties
- `fetchParties()` - Get all active parties
- `fetchPartyById(partyId)` - Get single party
- `addParty(partyData)` - Add new party
- `updateParty(partyId, updates)` - Update party
- `deleteParty(partyId)` - Soft delete party

### Transactions
- `fetchTransactions()` - Get all transactions
- `fetchTransactionsByParty(partyId)` - Get party's transactions
- `addTransaction(transactionData)` - Add single transaction
- `addBulkTransactions(partyId, items, date, type)` - Add multiple transactions

### Dashboard
- `fetchDashboardMetrics()` - Get dashboard metrics
- `calculateDashboardMetrics()` - Recalculate metrics
- `fetchRecentActivity(limit)` - Get recent transactions

## Troubleshooting

### "Failed to fetch" errors
- Check that your SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Ensure you have internet connection
- Check Supabase dashboard to verify project is active

### "Row Level Security policy violation"
- Make sure you're logged in (authenticated)
- Check that RLS policies are properly set up
- Try running the SQL schema again

### Email verification issues
- Disable email confirmation in Supabase dashboard (see Step 6)
- Or check your email for verification link

### Stock not updating after transaction
- Check if database triggers are installed (run schema SQL again)
- Verify transaction was created successfully
- Check console logs for errors

### Dashboard showing zero values
- Run: `SELECT calculate_dashboard_metrics();` in SQL Editor
- Make sure you have products and transactions in the database
- Check that seed data was inserted correctly

## Adding More Products

To add more products manually:

1. Go to Supabase dashboard → **Table Editor**
2. Select **products** table
3. Click **Insert row**
4. Fill in the fields:
   - serial_number: Next available number
   - item_name: Product name
   - category: Product category
   - size: Product size/specification
   - rate_per_month: Rental rate
   - total_quantity: Total stock
   - party_stock: Currently with parties
   - yard_stock: In yard (total - party)
5. Click **Save**

Or run SQL:
```sql
INSERT INTO products (serial_number, item_name, category, size, rate_per_month, total_quantity, party_stock, yard_stock)
VALUES (15, 'New Product', 'Category', 'Size', 100.00, 500, 0, 500);
```

## Security Notes

- Never commit `.env` file to version control
- Keep your SUPABASE_ANON_KEY secure (but it's safe for client-side use)
- The anon key only allows operations permitted by RLS policies
- Service role key (if you get one) should NEVER be used in client code

## Database Backups

Supabase automatically backs up your database. To create manual backup:
1. Go to **Database** → **Backups** in Supabase dashboard
2. Click "Create backup"

## Next Steps

Now that your backend is set up, you can:
1. Customize the UI and add more features
2. Add reporting and analytics
3. Implement role-based permissions
4. Add more product categories
5. Create PDF export functionality for invoices
6. Add image upload for products
7. Implement search and filtering

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify all SQL ran successfully
4. Check your credentials are correct

## Additional Resources

- Supabase Documentation: https://supabase.com/docs
- React Native Documentation: https://reactnative.dev/docs/getting-started
- Expo Documentation: https://docs.expo.dev/
