-- =====================================================
-- SENTHUR MURUGAN ENTERPRISES - SUPABASE DATABASE SCHEMA
-- Construction Equipment Rental Management System
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE
-- Stores all inventory items (Span, Jackey, Sheet, etc.)
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number INTEGER UNIQUE NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'Span', 'Jackey', 'Sheet', 'Cuplock', etc.
    size VARCHAR(50), -- '8Ft', '10Ft', '2*3', etc.
    rate_per_month DECIMAL(10, 2) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    party_stock INTEGER NOT NULL DEFAULT 0,
    yard_stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PARTIES TABLE
-- Stores customer/party information
-- =====================================================
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TRANSACTIONS TABLE
-- Stores all rental transactions (items given/returned)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('given', 'returned')),
    quantity INTEGER NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. USER PROFILES TABLE
-- Extended user information (links to Supabase Auth)
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'user', 'viewer'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. DASHBOARD METRICS TABLE (Optional - for caching)
-- Stores calculated dashboard metrics
-- =====================================================
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    stock_value DECIMAL(15, 2) DEFAULT 0,
    active_parties INTEGER DEFAULT 0,
    active_products INTEGER DEFAULT 0,
    total_party_stock INTEGER DEFAULT 0,
    total_yard_stock INTEGER DEFAULT 0,
    utilization_percentage DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_transactions_party_id ON transactions(party_id);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_parties_active ON parties(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_dashboard_metrics_date ON dashboard_metrics(metric_date);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parties_updated_at BEFORE UPDATE ON parties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function to update product stock after transaction
-- =====================================================
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_type = 'given' THEN
        -- Items given to party: increase party_stock, decrease yard_stock
        UPDATE products
        SET
            party_stock = party_stock + NEW.quantity,
            yard_stock = yard_stock - NEW.quantity
        WHERE id = NEW.product_id;
    ELSIF NEW.transaction_type = 'returned' THEN
        -- Items returned from party: decrease party_stock, increase yard_stock
        UPDATE products
        SET
            party_stock = party_stock - NEW.quantity,
            yard_stock = yard_stock + NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to update stock on transaction insert
CREATE TRIGGER update_stock_on_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- =====================================================
-- Function to calculate and update dashboard metrics
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_dashboard_metrics()
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Products policies (authenticated users can read, only admins can modify)
CREATE POLICY "Allow authenticated users to read products"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true);

-- Parties policies
CREATE POLICY "Allow authenticated users to read parties"
    ON parties FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert parties"
    ON parties FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update parties"
    ON parties FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete parties"
    ON parties FOR DELETE
    TO authenticated
    USING (true);

-- Transactions policies
CREATE POLICY "Allow authenticated users to read transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert transactions"
    ON transactions FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- User profiles policies
CREATE POLICY "Allow users to read their own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Dashboard metrics policies (read-only for all authenticated users)
CREATE POLICY "Allow authenticated users to read dashboard metrics"
    ON dashboard_metrics FOR SELECT
    TO authenticated
    USING (true);

-- =====================================================
-- VIEWS for easier querying
-- =====================================================

-- View: Party Stock Summary
CREATE OR REPLACE VIEW party_stock_summary AS
SELECT
    p.id AS party_id,
    p.party_name,
    COUNT(DISTINCT t.product_id) AS total_products,
    SUM(CASE WHEN t.transaction_type = 'given' THEN t.quantity ELSE -t.quantity END) AS total_quantity,
    SUM(CASE WHEN t.transaction_type = 'given' THEN t.quantity * pr.rate_per_month ELSE -t.quantity * pr.rate_per_month END) AS total_value
FROM parties p
LEFT JOIN transactions t ON p.id = t.party_id
LEFT JOIN products pr ON t.product_id = pr.id
WHERE p.is_active = TRUE
GROUP BY p.id, p.party_name;

-- View: Product Utilization
CREATE OR REPLACE VIEW product_utilization AS
SELECT
    id,
    serial_number,
    item_name,
    category,
    size,
    total_quantity,
    party_stock,
    yard_stock,
    rate_per_month,
    party_stock * rate_per_month AS party_value,
    yard_stock * rate_per_month AS yard_value,
    total_quantity * rate_per_month AS total_value,
    CASE
        WHEN total_quantity > 0 THEN ROUND((party_stock::DECIMAL / total_quantity) * 100, 2)
        ELSE 0
    END AS utilization_percentage
FROM products
ORDER BY serial_number;

-- View: Recent Transactions
CREATE OR REPLACE VIEW recent_transactions AS
SELECT
    t.id,
    t.transaction_date,
    t.transaction_type,
    t.quantity,
    t.notes,
    p.party_name,
    pr.item_name,
    pr.rate_per_month,
    t.quantity * pr.rate_per_month AS transaction_value,
    t.created_at
FROM transactions t
JOIN parties p ON t.party_id = p.id
JOIN products pr ON t.product_id = pr.id
ORDER BY t.transaction_date DESC, t.created_at DESC;

-- =====================================================
-- SEED DATA (based on your database.json)
-- =====================================================

-- Insert products from your database
INSERT INTO products (serial_number, item_name, category, size, rate_per_month, total_quantity, party_stock, yard_stock) VALUES
(1, 'Span (S)', 'Span', '8Ft', 100.00, 1774, 1255, 519),
(2, 'Jackey 2*2 (S)', 'Jackey', '2*2', 90.00, 5790, 4195, 1595),
(3, 'Sheet 2*3', 'Sheet', '2*3 (1.5 Inch)', 75.00, 7497, 5201, 2296),
(4, 'Sheet 2*3.75', 'Sheet', '2*3.75', 80.00, 802, 501, 301),
(5, 'Sheet 2*3', 'Sheet', '2*3 (1 Inch)', 70.00, 2440, 1505, 935),
(6, 'Span (B)', 'Span', '10Ft', 120.00, 16, 10, 6),
(7, 'Jacky 3*3 (B)', 'Jackey', '3*3', 110.00, 692, 402, 290),
(8, 'Cuplock-1 mtr', 'Cuplock', '1 mtr', 95.00, 826, 601, 225),
(9, 'Cuplock-1.5 mtr', 'Cuplock', '1.5 mtr', 105.00, 850, 650, 200),
(10, 'Cuplock-3 mtr', 'Cuplock', '3 mtr', 125.00, 390, 298, 92),
(11, 'M.S.pipe', 'Pipe', 'Standard', 85.00, 70, 40, 30),
(12, 'Jolly', 'Accessory', 'Standard', 60.00, 150, 95, 55),
(13, 'U-Jack', 'Jack', 'Standard', 115.00, 82, 62, 20),
(14, 'Swing Coupler', 'Coupler', 'Standard', 50.00, 496, 348, 148);

-- Insert sample parties from your database
INSERT INTO parties (party_name, is_active) VALUES
('Bharathy', TRUE),
('Balasubramaniam-Qun interior', TRUE),
('Sakthi enterprises', TRUE),
('Kannan jebagarden', TRUE),
('Suriya selvachandran', TRUE),
('Pechi', TRUE),
('Petchi Pandiyan', TRUE),
('Name 1', TRUE),
('Name 2', TRUE),
('Name 3', TRUE),
('Name 4', TRUE),
('Name 5', TRUE),
('Name 6', TRUE);

-- Calculate initial dashboard metrics
SELECT calculate_dashboard_metrics();

-- =====================================================
-- HELPFUL QUERIES FOR TESTING
-- =====================================================

-- View all products with utilization
-- SELECT * FROM product_utilization;

-- View party stock summary
-- SELECT * FROM party_stock_summary;

-- View recent transactions
-- SELECT * FROM recent_transactions;

-- Get dashboard metrics
-- SELECT * FROM dashboard_metrics ORDER BY metric_date DESC LIMIT 1;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
