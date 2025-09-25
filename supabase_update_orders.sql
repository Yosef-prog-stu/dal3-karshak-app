-- إضافة حقل status إلى جدول orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- تحديث الطلبات الموجودة لتكون pending
UPDATE orders SET status = 'pending' WHERE status IS NULL;

-- إضافة فهرس للحالة
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- إضافة تعليق على العمود
COMMENT ON COLUMN orders.status IS 'حالة الطلب: pending (في الانتظار), ready (جاهز), completed (مكتمل)';
