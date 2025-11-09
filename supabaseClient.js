import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = 'https://vlcyldgpuerfodxythft.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsY3lsZGdwdWVyZm9keHl0aGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDAwMzEsImV4cCI6MjA3ODAxNjAzMX0.Ai-aNlqkOAjpdTRXlN3zEavdjBpzLaYPiJEwTrYrVmY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email, password, fullName, phoneNumber) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
            role: 'user',
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { data: null, error };
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error in signIn:', error);
    return { data: null, error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error };
  }
};

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { data: null, error };
  }
};

// =====================================================
// PRODUCTS FUNCTIONS
// =====================================================

/**
 * Fetch all products
 */
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('serial_number', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: null, error };
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }
};

/**
 * Add a new product
 */
export const addProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding product:', error);
    return { data: null, error };
  }
};

/**
 * Update a product
 */
export const updateProduct = async (productId, updates) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating product:', error);
    return { data: null, error };
  }
};

/**
 * Update product stock manually (yard_stock and party_stock)
 */
export const updateProductStock = async (productId, partyStock, yardStock) => {
  try {
    const totalQuantity = partyStock + yardStock;
    const { data, error } = await supabase
      .from('products')
      .update({
        party_stock: partyStock,
        yard_stock: yardStock,
        total_quantity: totalQuantity,
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating product stock:', error);
    return { data: null, error };
  }
};

/**
 * Fetch product utilization view
 */
export const fetchProductUtilization = async () => {
  try {
    const { data, error } = await supabase
      .from('product_utilization')
      .select('*');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching product utilization:', error);
    return { data: null, error };
  }
};

// =====================================================
// PARTIES FUNCTIONS
// =====================================================

/**
 * Fetch all parties
 */
export const fetchParties = async () => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching parties:', error);
    return { data: null, error };
  }
};

/**
 * Fetch a single party by ID
 */
export const fetchPartyById = async (partyId) => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .eq('id', partyId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching party:', error);
    return { data: null, error };
  }
};

/**
 * Add a new party
 */
export const addParty = async (partyData) => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .insert([partyData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding party:', error);
    return { data: null, error };
  }
};

/**
 * Update a party
 */
export const updateParty = async (partyId, updates) => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .update(updates)
      .eq('id', partyId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating party:', error);
    return { data: null, error };
  }
};

/**
 * Delete a party (soft delete - set is_active to false)
 */
export const deleteParty = async (partyId) => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .update({ is_active: false })
      .eq('id', partyId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting party:', error);
    return { data: null, error };
  }
};

/**
 * Fetch party stock summary
 */
export const fetchPartyStockSummary = async () => {
  try {
    const { data, error } = await supabase
      .from('party_stock_summary')
      .select('*');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching party stock summary:', error);
    return { data: null, error };
  }
};

// =====================================================
// TRANSACTIONS FUNCTIONS
// =====================================================

/**
 * Fetch all transactions
 */
export const fetchTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('recent_transactions')
      .select('*');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
};

/**
 * Fetch transactions for a specific party
 */
export const fetchTransactionsByParty = async (partyId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        products(item_name, rate_per_month),
        parties(party_name)
      `)
      .eq('party_id', partyId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching party transactions:', error);
    return { data: null, error };
  }
};

/**
 * Add a new transaction (give items to party or return from party)
 */
export const addTransaction = async (transactionData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        created_by: user?.id,
      }])
      .select()
      .single();

    if (error) throw error;

    // Recalculate dashboard metrics
    await calculateDashboardMetrics();

    return { data, error: null };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { data: null, error };
  }
};

/**
 * Add multiple items in one transaction
 */
export const addBulkTransactions = async (partyId, items, transactionDate, transactionType = 'given') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const transactions = items.map(item => ({
      party_id: partyId,
      product_id: item.product_id,
      transaction_type: transactionType,
      quantity: item.quantity,
      transaction_date: transactionDate,
      notes: item.notes || null,
      created_by: user?.id,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();

    if (error) throw error;

    // Recalculate dashboard metrics
    await calculateDashboardMetrics();

    return { data, error: null };
  } catch (error) {
    console.error('Error adding bulk transactions:', error);
    return { data: null, error };
  }
};

// =====================================================
// DASHBOARD FUNCTIONS
// =====================================================

/**
 * Fetch dashboard metrics
 */
export const fetchDashboardMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return { data: null, error };
  }
};

/**
 * Calculate and update dashboard metrics
 */
export const calculateDashboardMetrics = async () => {
  try {
    const { data, error } = await supabase.rpc('calculate_dashboard_metrics');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error calculating dashboard metrics:', error);
    return { data: null, error };
  }
};

/**
 * Fetch recent activity (last 10 transactions)
 */
export const fetchRecentActivity = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('recent_transactions')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { data: null, error };
  }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default supabase;
