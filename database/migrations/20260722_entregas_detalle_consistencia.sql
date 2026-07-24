BEGIN;

DO $$
DECLARE
  v_count bigint;
  v_constraint record;
BEGIN
  SELECT count(*) INTO v_count
  FROM detalle_entrega
  WHERE ide_deta_pedi IS NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Migración cancelada: existen % filas de detalle_entrega con ide_deta_pedi NULL.', v_count;
  END IF;

  SELECT count(*) INTO v_count
  FROM detalle_entrega
  WHERE cantidad_prod < 0;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Migración cancelada: existen % filas de detalle_entrega con cantidad_prod negativa.', v_count;
  END IF;

  SELECT count(*) INTO v_count FROM (
    SELECT ide_entr, ide_deta_pedi
    FROM detalle_entrega
    GROUP BY ide_entr, ide_deta_pedi
    HAVING count(*) > 1
  ) duplicados;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Migración cancelada: existen % claves duplicadas (ide_entr, ide_deta_pedi) en detalle_entrega.', v_count;
  END IF;

  SELECT count(*) INTO v_count FROM (
    SELECT ide_prod, fecha_caducidad_lote
    FROM lote
    GROUP BY ide_prod, fecha_caducidad_lote
    HAVING count(*) > 1
  ) duplicados;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Migración cancelada: existen % claves duplicadas (ide_prod, fecha_caducidad_lote) en lote.', v_count;
  END IF;

  SELECT count(*) INTO v_count FROM (
    SELECT ide_deta_entr, fecha_caducidad_lote
    FROM detalle_entrega_lote
    GROUP BY ide_deta_entr, fecha_caducidad_lote
    HAVING count(*) > 1
  ) duplicados;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Migración cancelada: existen % claves duplicadas (ide_deta_entr, fecha_caducidad_lote) en detalle_entrega_lote.', v_count;
  END IF;

  FOR v_constraint IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'detalle_entrega'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ~* 'cantidad_prod'
  LOOP
    EXECUTE format('ALTER TABLE detalle_entrega DROP CONSTRAINT %I', v_constraint.conname);
  END LOOP;

  ALTER TABLE detalle_entrega
    ADD CONSTRAINT detalle_entrega_cantidad_prod_check CHECK (cantidad_prod >= 0);

  ALTER TABLE detalle_entrega ALTER COLUMN ide_deta_pedi SET NOT NULL;

  IF NOT EXISTS (
    SELECT 1 FROM pg_index
    WHERE indrelid = 'detalle_entrega'::regclass
      AND indisunique
      AND pg_get_indexdef(indexrelid) ~* '\(ide_entr, ide_deta_pedi\)'
  ) THEN
    ALTER TABLE detalle_entrega
      ADD CONSTRAINT detalle_entrega_ide_entr_ide_deta_pedi_key
      UNIQUE (ide_entr, ide_deta_pedi);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_index
    WHERE indrelid = 'lote'::regclass
      AND indisunique
      AND pg_get_indexdef(indexrelid) ~* '\(ide_prod, fecha_caducidad_lote\)'
  ) THEN
    ALTER TABLE lote
      ADD CONSTRAINT lote_ide_prod_fecha_caducidad_lote_key
      UNIQUE (ide_prod, fecha_caducidad_lote);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_index
    WHERE indrelid = 'detalle_entrega_lote'::regclass
      AND indisunique
      AND pg_get_indexdef(indexrelid) ~* '\(ide_deta_entr, fecha_caducidad_lote\)'
  ) THEN
    ALTER TABLE detalle_entrega_lote
      ADD CONSTRAINT detalle_entrega_lote_detalle_fecha_key
      UNIQUE (ide_deta_entr, fecha_caducidad_lote);
  END IF;
END
$$;

COMMIT;
