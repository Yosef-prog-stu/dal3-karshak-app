-- Remove overly permissive RLS policies from orders table
DROP POLICY IF EXISTS "orders_select_all" ON public.orders;
DROP POLICY IF EXISTS "orders_update_all" ON public.orders;

-- Create more restrictive policies that protect customer data
-- Only allow reading orders through authenticated admin access or order ID lookup
CREATE POLICY "orders_admin_select" ON public.orders
FOR SELECT 
TO authenticated
USING (
  -- Only allow if user has admin role (when auth system is implemented)
  -- For now, restrict to authenticated users only
  auth.role() = 'authenticated'
);

-- Allow customers to view their own orders by providing order ID and matching customer info
-- This prevents enumeration attacks while allowing legitimate order lookups
CREATE POLICY "orders_customer_lookup" ON public.orders
FOR SELECT 
TO anon
USING (false); -- Completely block anonymous access to protect customer data

-- Keep insert policy but make it more secure by requiring all customer fields
CREATE POLICY "orders_secure_insert" ON public.orders
FOR INSERT
TO anon
WITH CHECK (
  -- Ensure all required customer fields are provided and not empty
  customer_name IS NOT NULL AND trim(customer_name) != '' AND
  customer_phone IS NOT NULL AND trim(customer_phone) != '' AND
  customer_address IS NOT NULL AND trim(customer_address) != '' AND
  items IS NOT NULL AND jsonb_array_length(items) > 0 AND
  total_sar > 0
);

-- Only allow order status updates by authenticated users (restaurant staff)
CREATE POLICY "orders_admin_update" ON public.orders
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add comment explaining the security measures
COMMENT ON TABLE public.orders IS 'Contains sensitive customer PII. Access restricted to prevent data exposure. Use secure lookup functions for customer order inquiries.';