BEGIN;

-- ============================================================
-- SUPERMARKET
-- Consistencia de tablas de autenticación y seguridad
-- Fecha: 2026-07-27
--
-- Objetivos:
-- 1. Alinear PostgreSQL con las entidades TypeORM.
-- 2. Eliminar defaults funcionales.
-- 3. Conservar defaults técnicos de IDs y fechas de creación.
-- 4. Mejorar integridad de cuentas, MFA, tokens y accesos.
-- 5. Preservar los registros existentes.
-- ============================================================


-- ============================================================
-- 1. VALIDACIONES PREVIAS
-- La migración se detiene si encuentra datos incompatibles.
-- ============================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.cuenta
        WHERE estado_cuen NOT IN ('activo', 'inactivo', 'bloqueado')
    ) THEN
        RAISE EXCEPTION
            'Existen cuentas con estados no permitidos.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.cuenta
        WHERE intentos_fallidos_cuen < 0
    ) THEN
        RAISE EXCEPTION
            'Existen cuentas con intentos fallidos negativos.';
    END IF;

    IF EXISTS (
        SELECT ide_cuen
        FROM public.cuenta_mfa
        GROUP BY ide_cuen
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Existen varias configuraciones MFA para una misma cuenta.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.password_reset_token
        WHERE length(token_hash) > 64
    ) THEN
        RAISE EXCEPTION
            'Existen tokens de recuperación con más de 64 caracteres.';
    END IF;

    IF EXISTS (
        SELECT token_hash
        FROM public.password_reset_token
        GROUP BY token_hash
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Existen token_hash duplicados en password_reset_token.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.acceso_usuario
        WHERE num_int_fall_acce < 0
    ) THEN
        RAISE EXCEPTION
            'Existen accesos con intentos fallidos negativos.';
    END IF;
END;
$$;


-- ============================================================
-- 2. TABLA cuenta
-- ============================================================

ALTER TABLE public.cuenta
    ALTER COLUMN debe_cambiar_clave DROP DEFAULT,
    ALTER COLUMN intentos_fallidos_cuen DROP DEFAULT;

ALTER TABLE public.cuenta
    DROP CONSTRAINT IF EXISTS cuenta_estado_cuen_check;

ALTER TABLE public.cuenta
    ADD CONSTRAINT cuenta_estado_cuen_check
    CHECK (
        estado_cuen IN (
            'activo',
            'inactivo',
            'bloqueado'
        )
    );

ALTER TABLE public.cuenta
    DROP CONSTRAINT IF EXISTS
        cuenta_intentos_fallidos_cuen_check;

ALTER TABLE public.cuenta
    DROP CONSTRAINT IF EXISTS
        ck_cuenta_intentos_fallidos_no_negativos;

ALTER TABLE public.cuenta
    ADD CONSTRAINT ck_cuenta_intentos_fallidos_no_negativos
    CHECK (intentos_fallidos_cuen >= 0);


-- Evitar que eliminar un empleado elimine automáticamente su cuenta.

ALTER TABLE public.cuenta
    DROP CONSTRAINT IF EXISTS fk_cuenta_empleado;

ALTER TABLE public.cuenta
    ADD CONSTRAINT fk_cuenta_empleado
    FOREIGN KEY (ide_empl)
    REFERENCES public.empleado (ide_empl)
    ON DELETE RESTRICT;


-- Evitar que eliminar un perfil elimine automáticamente sus cuentas.

ALTER TABLE public.cuenta
    DROP CONSTRAINT IF EXISTS fk_cuenta_perfil;

ALTER TABLE public.cuenta
    ADD CONSTRAINT fk_cuenta_perfil
    FOREIGN KEY (ide_perf)
    REFERENCES public.perfil (ide_perf)
    ON DELETE RESTRICT;


-- ============================================================
-- 3. TABLA cuenta_mfa
-- ============================================================

-- Corregir posibles fechas nulas antes de establecer NOT NULL.

UPDATE public.cuenta_mfa
SET fecha_ingre = CURRENT_TIMESTAMP
WHERE fecha_ingre IS NULL;


ALTER TABLE public.cuenta_mfa
    ALTER COLUMN habilitado DROP DEFAULT,
    ALTER COLUMN fecha_activacion DROP DEFAULT,
    ALTER COLUMN secreto_mfa TYPE VARCHAR(500),
    ALTER COLUMN fecha_ingre SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN fecha_ingre SET NOT NULL;


ALTER TABLE public.cuenta_mfa
    DROP CONSTRAINT IF EXISTS uq_cuenta_mfa_cuenta;

ALTER TABLE public.cuenta_mfa
    ADD CONSTRAINT uq_cuenta_mfa_cuenta
    UNIQUE (ide_cuen);


-- ============================================================
-- 4. TABLA password_reset_token
-- ============================================================

ALTER TABLE public.password_reset_token
    ALTER COLUMN token_hash TYPE VARCHAR(64),
    ALTER COLUMN utilizado DROP DEFAULT;


ALTER TABLE public.password_reset_token
    DROP CONSTRAINT IF EXISTS uq_password_reset_token_hash;

ALTER TABLE public.password_reset_token
    ADD CONSTRAINT uq_password_reset_token_hash
    UNIQUE (token_hash);


-- ============================================================
-- 5. TABLA refresh_token
-- ============================================================

ALTER TABLE public.refresh_token
    ALTER COLUMN revocado DROP DEFAULT;


-- ============================================================
-- 6. TABLA historial_clave
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_historial_clave_cuenta_fecha
    ON public.historial_clave (
        ide_cuen,
        fecha_ingre DESC
    );


-- ============================================================
-- 7. TABLA acceso_usuario
-- ============================================================

ALTER TABLE public.acceso_usuario
    ADD COLUMN IF NOT EXISTS usuario_intentado VARCHAR(25),
    ADD COLUMN IF NOT EXISTS resultado_acce VARCHAR(15),
    ADD COLUMN IF NOT EXISTS motivo_acce VARCHAR(50);


-- Los accesos existentes corresponden a logins exitosos.

UPDATE public.acceso_usuario
SET resultado_acce = 'exitoso'
WHERE resultado_acce IS NULL;


-- Recuperar el nombre del usuario para el historial existente.

UPDATE public.acceso_usuario AS acceso
SET usuario_intentado = cuenta.usuario_cuen
FROM public.cuenta AS cuenta
WHERE acceso.ide_cuen = cuenta.ide_cuen
  AND acceso.usuario_intentado IS NULL;


-- Eliminar la IP ficticia utilizada anteriormente.

UPDATE public.acceso_usuario
SET ip_acce = NULL
WHERE ip_acce = '999.999.999.999';


ALTER TABLE public.acceso_usuario
    ALTER COLUMN resultado_acce SET NOT NULL,
    ALTER COLUMN ide_cuen DROP NOT NULL,
    ALTER COLUMN ip_acce TYPE VARCHAR(45),
    ALTER COLUMN ip_acce DROP NOT NULL,
    ALTER COLUMN num_int_fall_acce DROP DEFAULT;


ALTER TABLE public.acceso_usuario
    DROP CONSTRAINT IF EXISTS acceso_usuario_resultado_acce_check;

ALTER TABLE public.acceso_usuario
    DROP CONSTRAINT IF EXISTS ck_acceso_usuario_resultado;

ALTER TABLE public.acceso_usuario
    ADD CONSTRAINT ck_acceso_usuario_resultado
    CHECK (
        resultado_acce IN (
            'exitoso',
            'fallido'
        )
    );


ALTER TABLE public.acceso_usuario
    DROP CONSTRAINT IF EXISTS
        acceso_usuario_num_int_fall_acce_check;

ALTER TABLE public.acceso_usuario
    DROP CONSTRAINT IF EXISTS
        ck_acceso_usuario_intentos_no_negativos;

ALTER TABLE public.acceso_usuario
    ADD CONSTRAINT ck_acceso_usuario_intentos_no_negativos
    CHECK (num_int_fall_acce >= 0);


-- Conservar el historial si una cuenta es eliminada.

ALTER TABLE public.acceso_usuario
    DROP CONSTRAINT IF EXISTS fk_acceso_usuario_cuenta;

ALTER TABLE public.acceso_usuario
    ADD CONSTRAINT fk_acceso_usuario_cuenta
    FOREIGN KEY (ide_cuen)
    REFERENCES public.cuenta (ide_cuen)
    ON DELETE SET NULL;


-- Índices útiles para consultas de seguridad e historial.

CREATE INDEX IF NOT EXISTS idx_acceso_usuario_cuenta_fecha
    ON public.acceso_usuario (
        ide_cuen,
        fecha_acce DESC
    );

CREATE INDEX IF NOT EXISTS idx_acceso_usuario_usuario_fecha
    ON public.acceso_usuario (
        usuario_intentado,
        fecha_acce DESC
    );

CREATE INDEX IF NOT EXISTS idx_acceso_usuario_resultado_fecha
    ON public.acceso_usuario (
        resultado_acce,
        fecha_acce DESC
    );


-- ============================================================
-- 8. ELIMINAR FUNCIONES LEGACY DEL MÓDULO DE SEGURIDAD
--
-- La creación de cuentas y el registro de accesos se manejan
-- exclusivamente desde el backend NestJS mediante TypeORM.
-- ============================================================

DROP FUNCTION IF EXISTS public.fn_insertar_cuenta(
    INTEGER,
    INTEGER,
    CHARACTER VARYING,
    CHARACTER VARYING,
    CHARACTER VARYING,
    CHARACTER VARYING
);

DROP FUNCTION IF EXISTS public.fn_insertar_acceso_usuario(
    INTEGER,
    CHARACTER VARYING,
    TIMESTAMP WITHOUT TIME ZONE,
    INTEGER,
    CHARACTER VARYING,
    NUMERIC,
    NUMERIC
);


COMMIT;
