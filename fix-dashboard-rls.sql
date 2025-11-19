-- =====================================================
-- FIX: Dashboard Metrics RLS Policy Issue
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to fix the
-- "new row violates row-level security policy" error
-- =====================================================

-- Drop the existing function
DROP FUNCTION IF EXISTS calculate_dashboard_metrics();

-- Recreate the function with SECURITY DEFINER
-- This allows the function to bypass RLS policies
CREATE OR REPLACE FUNCTION calculate_dashboard_metrics()
RETURNS VOID
SECURITY DEFINER  -- Run with elevated privileges to bypass RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_revenue DECIMAL(15, 2);
    v_stock_value DECIMAL(15, 2);
    v_active_parties INTEGER;
    v_active_products INTEGER;
    v_total_party_stock INTEGER;
    v_total_yard_stock INTEGER;
    v_utilization DECIMAL(5, 2);
BEGIN
    -- Calculate total revenue (party_stock * rate_per_month for all products)
    SELECT COALESCE(SUM(party_stock * rate_per_month), 0)
    INTO v_total_revenue
    FROM products;

    -- Calculate total stock value (total_quantity * rate_per_month)
    SELECT COALESCE(SUM(total_quantity * rate_per_month), 0)
    INTO v_stock_value
    FROM products;

    -- Count active parties
    SELECT COUNT(*)
    INTO v_active_parties
    FROM parties
    WHERE is_active = TRUE;

    -- Count active products (products with quantity > 0)
    SELECT COUNT(*)
    INTO v_active_products
    FROM products
    WHERE total_quantity > 0;

    -- Sum party and yard stock
    SELECT
        COALESCE(SUM(party_stock), 0),
        COALESCE(SUM(yard_stock), 0)
    INTO v_total_party_stock, v_total_yard_stock
    FROM products;

    -- Calculate utilization percentage
    IF (v_total_party_stock + v_total_yard_stock) > 0 THEN
        v_utilization := (v_total_party_stock::DECIMAL / (v_total_party_stock + v_total_yard_stock)) * 100;
    ELSE
        v_utilization := 0;
    END IF;

    -- Insert or update dashboard metrics
    INSERT INTO dashboard_metrics (
        metric_date,
        total_revenue,
        stock_value,
        active_parties,
        active_products,
        total_party_stock,
        total_yard_stock,
        utilization_percentage
    ) VALUES (
        CURRENT_DATE,
        v_total_revenue,
        v_stock_value,
        v_active_parties,
        v_active_products,
        v_total_party_stock,
        v_total_yard_stock,
        v_utilization
    )
    ON CONFLICT (metric_date) DO UPDATE SET
        total_revenue = EXCLUDED.total_revenue,
        stock_value = EXCLUDED.stock_value,
        active_parties = EXCLUDED.active_parties,
        active_products = EXCLUDED.active_products,
        total_party_stock = EXCLUDED.total_party_stock,
        total_yard_stock = EXCLUDED.total_yard_stock,
        utilization_percentage = EXCLUDED.utilization_percentage,
        updated_at = NOW();
END;
$$;

-- Test the function by calculating metrics
SELECT calculate_dashboard_metrics();

-- Verify the data was inserted
SELECT * FROM dashboard_metrics ORDER BY metric_date DESC LIMIT 1;
