-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    current_price DECIMAL(10,2) NOT NULL CHECK (current_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL, -- denormalized for quick access
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly_bills table
CREATE TABLE IF NOT EXISTS monthly_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid >= 0),
    date_paid DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_purchases_item_id ON purchases(item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_monthly_bills_month_year ON monthly_bills(month, year);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for items table
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default items
INSERT INTO items (name, current_price) VALUES
    ('Chai', 15.00),
    ('Cigarettes', 20.00),
    ('Water', 10.00),
    ('Pratha', 25.00)
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS) - uncomment if you want user authentication
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE monthly_bills ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single user app)
-- For multi-user app, replace these with user-specific policies
CREATE POLICY "Enable all operations for items" ON items FOR ALL USING (true);
CREATE POLICY "Enable all operations for purchases" ON purchases FOR ALL USING (true);
CREATE POLICY "Enable all operations for monthly_bills" ON monthly_bills FOR ALL USING (true);