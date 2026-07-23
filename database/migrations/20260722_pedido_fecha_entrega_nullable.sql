-- SuperMarket - fecha real de entrega opcional en pedidos
--
-- Antes de aplicar, realice un respaldo de la base de datos.
-- Ejecución:
--   psql -v ON_ERROR_STOP=1 -d <base_de_datos> -f database/migrations/20260722_pedido_fecha_entrega_nullable.sql
--
-- La consulta final debe devolver is_nullable = YES.

BEGIN;

ALTER TABLE public.pedido
  ALTER COLUMN fecha_entr_pedi DROP NOT NULL;

COMMIT;

SELECT table_schema,
       table_name,
       column_name,
       is_nullable,
       data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pedido'
  AND column_name = 'fecha_entr_pedi';
