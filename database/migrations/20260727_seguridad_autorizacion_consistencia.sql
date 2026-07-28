BEGIN;

-- ============================================================
-- SUPERMARKET
-- Consistencia del módulo de autorización
-- Fecha: 2026-07-27
-- ============================================================


-- ============================================================
-- 1. VALIDACIONES PREVIAS
-- ============================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT ide_perf, ide_opci
        FROM public.perfil_opciones
        GROUP BY ide_perf, ide_opci
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Existen opciones duplicadas asignadas al mismo perfil.';
    END IF;

    IF EXISTS (
        SELECT ruta_opci
        FROM public.opciones
        GROUP BY ruta_opci
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Existen rutas duplicadas en la tabla opciones.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.opciones
        WHERE activo_opci NOT IN ('si', 'no')
    ) THEN
        RAISE EXCEPTION
            'Existen opciones con estados inválidos.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.perfil_opciones
        WHERE listar NOT IN ('si', 'no')
           OR insertar NOT IN ('si', 'no')
           OR modificar NOT IN ('si', 'no')
           OR eliminar NOT IN ('si', 'no')
    ) THEN
        RAISE EXCEPTION
            'Existen permisos CRUD con valores inválidos.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.opciones
        WHERE nivel_opci < 0
    ) THEN
        RAISE EXCEPTION
            'Existen opciones con nivel negativo.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.opciones
        WHERE padre_opci = ide_opci
    ) THEN
        RAISE EXCEPTION
            'Existen opciones configuradas como su propio padre.';
    END IF;
END;
$$;


-- ============================================================
-- 2. TABLA perfil
-- ============================================================

ALTER TABLE public.perfil
    DROP CONSTRAINT IF EXISTS fk_perfil_rol;

ALTER TABLE public.perfil
    ADD CONSTRAINT fk_perfil_rol
    FOREIGN KEY (ide_rol)
    REFERENCES public.rol (ide_rol)
    ON DELETE RESTRICT;


-- ============================================================
-- 3. TABLA opciones
-- ============================================================

ALTER TABLE public.opciones
    ALTER COLUMN visible_opci DROP DEFAULT;

ALTER TABLE public.opciones
    DROP CONSTRAINT IF EXISTS opciones_ruta_opci_unique;

ALTER TABLE public.opciones
    ADD CONSTRAINT opciones_ruta_opci_unique
    UNIQUE (ruta_opci);

ALTER TABLE public.opciones
    DROP CONSTRAINT IF EXISTS opciones_activo_opci_check;

ALTER TABLE public.opciones
    ADD CONSTRAINT opciones_activo_opci_check
    CHECK (activo_opci IN ('si', 'no'));

ALTER TABLE public.opciones
    DROP CONSTRAINT IF EXISTS ck_opciones_nivel_no_negativo;

ALTER TABLE public.opciones
    ADD CONSTRAINT ck_opciones_nivel_no_negativo
    CHECK (nivel_opci >= 0);

ALTER TABLE public.opciones
    DROP CONSTRAINT IF EXISTS ck_opciones_padre_distinto;

ALTER TABLE public.opciones
    ADD CONSTRAINT ck_opciones_padre_distinto
    CHECK (
        padre_opci IS NULL
        OR padre_opci <> ide_opci
    );


-- ============================================================
-- 4. TABLA perfil_opciones
-- ============================================================

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS uq_perfil_opciones_perfil_opcion;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT uq_perfil_opciones_perfil_opcion
    UNIQUE (ide_perf, ide_opci);

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS perfil_opciones_listar_check;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT perfil_opciones_listar_check
    CHECK (listar IN ('si', 'no'));

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS perfil_opciones_insertar_check;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT perfil_opciones_insertar_check
    CHECK (insertar IN ('si', 'no'));

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS perfil_opciones_modificar_check;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT perfil_opciones_modificar_check
    CHECK (modificar IN ('si', 'no'));

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS perfil_opciones_eliminar_check;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT perfil_opciones_eliminar_check
    CHECK (eliminar IN ('si', 'no'));


-- Los permisos se eliminan automáticamente cuando se elimina
-- el perfil o la opción, pero no ocurre lo contrario.

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS fk_perfil_opciones_perfil;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT fk_perfil_opciones_perfil
    FOREIGN KEY (ide_perf)
    REFERENCES public.perfil (ide_perf)
    ON DELETE CASCADE;

ALTER TABLE public.perfil_opciones
    DROP CONSTRAINT IF EXISTS fk_perfil_opciones_opciones;

ALTER TABLE public.perfil_opciones
    ADD CONSTRAINT fk_perfil_opciones_opciones
    FOREIGN KEY (ide_opci)
    REFERENCES public.opciones (ide_opci)
    ON DELETE CASCADE;


COMMIT;