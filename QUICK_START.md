# Quick Setup Instructions

## Your Supabase is Connected! 🎉

Your credentials have been added to the app. Now you just need to set up the database.

## Step 1: Run the SQL Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vlcyldgpuerfodxythft

2. Click on **SQL Editor** in the left sidebar (it has a terminal icon)

3. Click **"New Query"** button

4. Open the file `supabase-schema.sql` in this project folder

5. Copy ALL the contents (it's a long SQL file, make sure you get everything!)

6. Paste it into the SQL Editor

7. Click **"Run"** (or press Ctrl+Enter on Windows / Cmd+Enter on Mac)

8. Wait for it to complete. You should see "Success. No rows returned"

**This will create:**
- ✅ All database tables (products, parties, transactions, user_profiles, dashboard_metrics)
- ✅ Database triggers for automatic stock updates
- ✅ Row Level Security policies
- ✅ Sample data (14 products and 13 parties)

## Step 2: Disable Email Confirmation (Optional - for easier testing)

1. In Supabase dashboard, go to **Authentication** → **Providers**

2. Click on **Email** provider

3. Scroll down to find **"Confirm email"**

4. Toggle it **OFF** (this lets you test without email verification)

5. Click **"Save"**

## Step 3: Start Your App

```bash
npx expo start
```

Then:
- Press `w` to open in web browser
- Or scan QR code with Expo Go app on your phone
- Or press `a` for Android emulator / `i` for iOS simulator

## Step 4: Test Everything!

### First, Register a New Account:
1. Open the app
2. Click "Register here"
3. Fill in the form (use any email, since confirmation is disabled)
4. Create an account

### Then Test These Features:

✅ **Login** - Sign in with your new account

✅ **Dashboard**
   - Should show total revenue, stock value
   - Active parties and products counts
   - Stock utilization percentage
   - Recent activity (will be empty initially)

✅ **Stocks** (from drawer menu)
   - Should show all 14 products
   - Each with party/yard allocation
   - Pull down to refresh

✅ **Party** (from drawer menu)
   - Should show 13 sample parties
   - Click on a party to see their transactions
   - Click 🗑️ to delete a party (with confirmation)
   - Click "Add Party" to create a new one

✅ **Add Party**
   - Fill in party name (required)
   - Optionally add contact info
   - Submit to create

✅ **Party Details** (click on any party name)
   - Shows transaction history
   - Click "Add Item" to create a transaction

✅ **Add Transaction**
   - Choose "Given to Party" or "Returned from Party"
   - Select date
   - Add products with quantities
   - Can add multiple items
   - Submit to create transaction
   - **Stock will update automatically!**

## What Happens After Adding a Transaction?

When you give items to a party:
- ✅ Party stock increases
- ✅ Yard stock decreases
- ✅ Dashboard metrics update
- ✅ Transaction appears in recent activity
- ✅ Party's transaction history updates

## Troubleshooting

### "Failed to connect" or Network errors
- Check your internet connection
- Verify the SQL schema was run successfully
- Make sure your Supabase project is active

### "Policy violation" errors
- Make sure you're logged in
- Check that the SQL schema ran completely
- Try running the SQL again

### Empty lists/No data
- Verify the SQL schema included the INSERT statements at the end
- Check the Supabase dashboard → Table Editor to see if data exists
- Pull down to refresh the screen

### Email verification required
- Go to Authentication → Providers → Email
- Disable "Confirm email"
- Try registering again

## View Your Data

You can view and edit data directly in Supabase:
1. Go to **Table Editor** in Supabase dashboard
2. Select a table (products, parties, transactions, etc.)
3. View, edit, add, or delete rows

## Monitor Activity

Watch real-time activity:
1. Go to **Logs** → **Explorer** in Supabase
2. See all API calls your app makes

## Need Help?

Check:
1. Browser console (F12) for errors
2. Expo terminal for React Native errors
3. Supabase Logs in dashboard

## You're All Set! 🚀

Your app is now fully connected to Supabase with all backend features working:
- Authentication
- Real-time data fetching
- CRUD operations
- Automatic stock management
- Dashboard analytics

Enjoy your fully functional inventory management system!
