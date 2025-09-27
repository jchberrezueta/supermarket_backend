-- 
-- Script optimizado para PostgreSQL 16
-- Supermarket Database
-- 

-- Eliminar tablas si existen (opcional, para limpieza)
DROP TABLE IF EXISTS acceso_usuario CASCADE;
DROP TABLE IF EXISTS cuenta CASCADE;
DROP TABLE IF EXISTS detalle_entrega CASCADE;
DROP TABLE IF EXISTS detalle_pedido CASCADE;
DROP TABLE IF EXISTS detalle_venta CASCADE;
DROP TABLE IF EXISTS empresa_precios CASCADE;
DROP TABLE IF EXISTS perfil_opciones CASCADE;
DROP TABLE IF EXISTS lote CASCADE;
DROP TABLE IF EXISTS entrega CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS proveedor CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS perfil CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS marca CASCADE;
DROP TABLE IF EXISTS opciones CASCADE;
DROP TABLE IF EXISTS empresa CASCADE;

-- 
-- TABLE: empresa 
--
CREATE TABLE empresa(
    ide_empr               SERIAL           PRIMARY KEY,
    nombre_empr            VARCHAR(250)     NOT NULL,
    responsable_empr       VARCHAR(250)     NOT NULL,
    direccion_empr         VARCHAR(250)     NOT NULL,
    telefono_empr          VARCHAR(15)      NOT NULL,
    email_empr             VARCHAR(100)     NOT NULL,
    fecha_contrato_empr    TIMESTAMP        NOT NULL,
    estado_empr            VARCHAR(25)      NOT NULL CHECK(estado_empr IN ('activo', 'inactivo'))  DEFAULT 'inactivo',
	descripcion_empr	   VARCHAR(250)     NOT NULL DEFAULT 'Ninguna',
    usua_ingre             VARCHAR(25),
    fecha_ingre            TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    usua_actua             VARCHAR(25),
    fecha_actua            TIMESTAMP
);

-- 
-- TABLE: categoria 
--
CREATE TABLE categoria(
    ide_cate            SERIAL          PRIMARY KEY,
    nombre_cate         VARCHAR(100)    NOT NULL,
    descripcion_cate    VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre          VARCHAR(25),
    fecha_ingre         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua          VARCHAR(25),
    fecha_actua         TIMESTAMP
);

-- 
-- TABLE: marca 
--
CREATE TABLE marca(
    ide_marc            SERIAL          PRIMARY KEY,
    nombre_marc         VARCHAR(100)    NOT NULL,
    pais_origen_marc    VARCHAR(100)    NOT NULL,
    descripcion_marc    VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre          VARCHAR(25),
    fecha_ingre         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua          VARCHAR(25),
    fecha_actua         TIMESTAMP
);

-- 
-- TABLE: rol 
--
CREATE TABLE rol(
    ide_rol            SERIAL          PRIMARY KEY,
    nombre_rol         VARCHAR(100)    NOT NULL,
    descripcion_rol    VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre         VARCHAR(25),
    fecha_ingre        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua         VARCHAR(25),
    fecha_actua        TIMESTAMP
);

-- 
-- TABLE: opciones 
--
CREATE TABLE opciones(
    ide_opci            SERIAL          PRIMARY KEY,
    nombre_opci         VARCHAR(100)    NOT NULL,
    ruta_opci           VARCHAR(500)    NOT NULL,
    activo_opci         VARCHAR(2)      NOT NULL CHECK(activo_opci IN ('si', 'no')) DEFAULT 'no',
    descripcion_opci    VARCHAR(1000)   NOT NULL DEFAULT 'Ninguna',
    usua_ingre          VARCHAR(25),
    fecha_ingre         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua          VARCHAR(25),
    fecha_actua         TIMESTAMP
);

-- 
-- TABLE: cliente 
--
CREATE TABLE cliente(
    ide_clie                 SERIAL          PRIMARY KEY,
    cedula_clie              VARCHAR(15)     NOT NULL UNIQUE,
    primer_nombre_clie       VARCHAR(50)     NOT NULL,
    segundo_nombre_clie      VARCHAR(50),
    apellido_paterno_clie    VARCHAR(50)     NOT NULL,
    apellido_materno_clie    VARCHAR(50),
    fecha_nacimiento_clie    DATE            NOT NULL,
    edad_clie                INTEGER         NOT NULL CHECK (edad_clie >= 0),
    telefono_clie            VARCHAR(15)     NOT NULL,
    email_clie               VARCHAR(100)    NOT NULL DEFAULT 'Ninguno',
    es_socio                 VARCHAR(2)      NOT NULL CHECK(es_socio IN ('si', 'no')) DEFAULT 'no',
    es_tercera_edad          VARCHAR(2)      NOT NULL CHECK(es_tercera_edad IN ('si', 'no')) DEFAULT 'no',
    usua_ingre               VARCHAR(25),
    fecha_ingre              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua               VARCHAR(25),
    fecha_actua              TIMESTAMP
);

-- 
-- TABLE: proveedor 
--
CREATE TABLE proveedor(
    ide_prov                 SERIAL          PRIMARY KEY,
    ide_empr                 INTEGER         NOT NULL,
    cedula_prov              VARCHAR(15)     NOT NULL UNIQUE,
    primer_nombre_prov       VARCHAR(50)     NOT NULL,
    segundo_nombre_prov      VARCHAR(50),
    apellido_paterno_prov    VARCHAR(50)     NOT NULL,
    apellido_materno_prov    VARCHAR(50),
    fecha_nacimiento_prov    DATE            NOT NULL,
    edad_prov                INTEGER         NOT NULL CHECK (edad_prov >= 0),
    telefono_prov            VARCHAR(15)     NOT NULL,
    email_prov               VARCHAR(100)    NOT NULL,
    usua_ingre               VARCHAR(25),
    fecha_ingre              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua               VARCHAR(25),
    fecha_actua              TIMESTAMP
);

-- 
-- TABLE: empleado 
--
CREATE TABLE empleado(
    ide_empl                 SERIAL          PRIMARY KEY,
    ide_rol                  INTEGER         NOT NULL,
    cedula_empl              VARCHAR(15)     NOT NULL UNIQUE,
    primer_nombre_empl       VARCHAR(50)     NOT NULL,
    segundo_nombre_empl      VARCHAR(50),
    apellido_paterno_empl    VARCHAR(50)     NOT NULL,
    apellido_materno_empl    VARCHAR(50),
    fecha_nacimiento_empl    DATE            NOT NULL,
    edad_empl                INTEGER         NOT NULL CHECK (edad_empl >= 0),
    fecha_inicio_empl        DATE            NOT NULL,
    rmu_empl                 DECIMAL(10, 2)  NOT NULL CHECK (rmu_empl >= 0),
    fecha_termino_empl       DATE,
	titulo_empl              VARCHAR(250)    NOT NULL DEFAULT 'libre',
    usua_ingre               VARCHAR(25),
    fecha_ingre              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua               VARCHAR(25),
    fecha_actua              TIMESTAMP
);

-- 
-- TABLE: producto 
--
CREATE TABLE producto(
    ide_prod              SERIAL          PRIMARY KEY,
    ide_cate              INTEGER         NOT NULL,
    ide_marc              INTEGER         NOT NULL,
    codigo_barra_prod     VARCHAR(30)     NOT NULL UNIQUE,
    nombre_prod           VARCHAR(100)    NOT NULL,
    precio_compra_prod    DECIMAL(10, 2)  NOT NULL CHECK (precio_compra_prod >= 0) DEFAULT 0,
    precio_venta_prod     DECIMAL(10, 2)  NOT NULL CHECK (precio_venta_prod >= 0) DEFAULT 0,
    iva_prod              DECIMAL(5, 2)   NOT NULL CHECK (iva_prod >= 0) DEFAULT 0,
    dcto_caduc_prod       DECIMAL(5, 2)   NOT NULL DEFAULT 0,
    stock_prod            INTEGER         NOT NULL CHECK (stock_prod >= 0) DEFAULT 0 ,
    dcto_promo_prod       DECIMAL(5, 2)   NOT NULL DEFAULT 0,
    disponible_prod       VARCHAR(25)     NOT NULL CHECK (estado_prod IN ('si', 'no')) DEFAULT 'no',
    estado_prod           VARCHAR(25)     NOT NULL CHECK (estado_prod IN ('activo', 'inactivo')) DEFAULT 'inactivo',
    descripcion_prod      VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre            VARCHAR(25),
    fecha_ingre           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua            VARCHAR(25),
    fecha_actua           TIMESTAMP
);

-- 
-- TABLE: perfil 
--
CREATE TABLE perfil(
    ide_perf            SERIAL          PRIMARY KEY,
    ide_rol             INTEGER         NOT NULL,
    nombre_perf         VARCHAR(100)    NOT NULL,
    descripcion_perf    VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre          VARCHAR(25),
    fecha_ingre         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua          VARCHAR(25),
    fecha_actua         TIMESTAMP
);

-- 
-- TABLE: pedido 
--
CREATE TABLE pedido(
    ide_pedi               SERIAL          PRIMARY KEY,
    ide_empr               INTEGER         NOT NULL,
    fecha_pedi             TIMESTAMP       NOT NULL,
    fecha_entr_pedi        TIMESTAMP       NOT NULL,
    cantidad_total_pedi    INTEGER         NOT NULL CHECK (cantidad_total_pedi >= 0),
    total_pedi             DECIMAL(10, 2)  NOT NULL CHECK (total_pedi >= 0),
    estado_pedi            VARCHAR(25)     NOT NULL CHECK (estado_pedi IN ('progreso', 'completado', 'incompleto')) DEFAULT 'progreso',
    motivo_pedi            VARCHAR(250)    NOT NULL CHECK (motivo_pedi IN ('peticion', 'devolucion')) DEFAULT 'peticion',
    observacion_pedi       VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre             VARCHAR(25),
    fecha_ingre            TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua             VARCHAR(25),
    fecha_actua            TIMESTAMP
);

-- 
-- TABLE: cuenta 
--
CREATE TABLE cuenta(
    ide_cuen         SERIAL          PRIMARY KEY,
    ide_empl         INTEGER         NOT NULL,
    ide_perf         INTEGER         NOT NULL,
    usuario_cuen     VARCHAR(25)     NOT NULL UNIQUE,
    password_cuen    VARCHAR(100)    NOT NULL, -- Aumentado para hash
    estado_cuen      VARCHAR(25)     NOT NULL CHECK (estado_cuen IN ('activo', 'inactivo', 'bloqueado')) DEFAULT 'inactivo',
    usua_ingre       VARCHAR(25),
    fecha_ingre      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua       VARCHAR(25),
    fecha_actua      TIMESTAMP
);

-- 
-- TABLE: entrega 
--
CREATE TABLE entrega(
    ide_entr               SERIAL          PRIMARY KEY,
    ide_prov               INTEGER         NOT NULL,
    ide_pedi               INTEGER         NOT NULL,
    fecha_entr             TIMESTAMP       NOT NULL,
    cantidad_total_entr    INTEGER         NOT NULL CHECK (cantidad_total_entr >= 0),
    total_entr             DECIMAL(10, 2)  NOT NULL CHECK (total_entr >= 0),
    estado_entr            VARCHAR(25)     NOT NULL CHECK (estado_entr IN ('completo', 'incompleto')),
    observacion_entr       VARCHAR(250)    NOT NULL DEFAULT 'Ninguna',
    usua_ingre             VARCHAR(25),
    fecha_ingre            TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua             VARCHAR(25),
    fecha_actua            TIMESTAMP
);

-- 
-- TABLE: venta 
--
CREATE TABLE venta(
    ide_vent            SERIAL          PRIMARY KEY,
    ide_clie            INTEGER         NOT NULL,
    ide_empl            INTEGER         NOT NULL,
    num_factura_vent    VARCHAR(25)     NOT NULL UNIQUE,
    fecha_vent          TIMESTAMP       NOT NULL,
    sub_total_vent      DECIMAL(10, 2)  NOT NULL CHECK (sub_total_vent >= 0),
    dcto_vent           DECIMAL(10, 2)  NOT NULL CHECK (dcto_vent >= 0) DEFAULT 0,
    total_vent          DECIMAL(10, 2)  NOT NULL CHECK (total_vent >= 0),
    estado_vent         VARCHAR(25)     NOT NULL CHECK (estado_vent IN ('completo', 'cancelado', 'devuelto')) DEFAULT 'completo',
    usua_ingre          VARCHAR(25),
    fecha_ingre         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua          VARCHAR(25),
    fecha_actua         TIMESTAMP
);

-- 
-- TABLE: lote 
--
CREATE TABLE lote(
    ide_lote                SERIAL          PRIMARY KEY,
    ide_prod                INTEGER         NOT NULL,
    fecha_caducidad_lote    DATE            NOT NULL,
    stock_lote              INTEGER         NOT NULL CHECK (stock_lote >= 0),
    estado_lote             VARCHAR(100)    NOT NULL CHECK (estado_lote IN ('correcto', 'proximo', 'caducado', 'devuelto')) DEFAULT 'correcto'
);

-- 
-- TABLE: empresa_precios 
--
CREATE TABLE empresa_precios(
    ide_empr_prod          SERIAL          PRIMARY KEY,
    ide_empr               INTEGER         NOT NULL,
    ide_prod               INTEGER         NOT NULL,
    precio_compra_prod     DECIMAL(10, 2)  NOT NULL CHECK (precio_compra_prod >= 0) DEFAULT 0,
    dcto_compra_prod       DECIMAL(5, 2)   NOT NULL DEFAULT 0,
    iva_prod               DECIMAL(5, 2)   NOT NULL DEFAULT 0,
    dcto_caducidad_prod    DECIMAL(5, 2)   NOT NULL DEFAULT 0,
    usua_ingre             VARCHAR(25),
    fecha_ingre            TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua             VARCHAR(25),
    fecha_actua            TIMESTAMP,
    UNIQUE(ide_empr, ide_prod)
);

-- 
-- TABLE: perfil_opciones 
--
CREATE TABLE perfil_opciones(
    ide_perf_opci    SERIAL          PRIMARY KEY,
    ide_perf         INTEGER         NOT NULL,
    ide_opci         INTEGER         NOT NULL,
    listar           VARCHAR(2)      NOT NULL CHECK (listar IN ('si', 'no')) DEFAULT 'no',
    insertar         VARCHAR(2)      NOT NULL CHECK (insertar IN ('si', 'no')) DEFAULT 'no',
    modificar        VARCHAR(2)      NOT NULL CHECK (modificar IN ('si', 'no')) DEFAULT 'no',
    eliminar         VARCHAR(2)      NOT NULL CHECK (eliminar IN ('si', 'no')) DEFAULT 'no',
    usua_ingre       VARCHAR(25),
    fecha_ingre      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    usua_actua       VARCHAR(25),
    fecha_actua      TIMESTAMP,
    UNIQUE(ide_perf, ide_opci)
);

-- 
-- TABLE: acceso_usuario 
--
CREATE TABLE acceso_usuario(
    ide_acce             SERIAL          PRIMARY KEY,
    ide_cuen             INTEGER         NOT NULL,
    fecha_acce           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    num_intentos_acce    INTEGER         NOT NULL CHECK (num_intentos_acce >= 0) DEFAULT 0,
    ip_acce              VARCHAR(15)     NOT NULL,
    navegador_acce       VARCHAR(250)    NOT NULL,
    latitud_acce         DECIMAL(10, 6),
    longitud_acce        DECIMAL(10, 6)
);

-- 
-- TABLE: detalle_pedido 
--
CREATE TABLE detalle_pedido(
    ide_deta_pedi           SERIAL          PRIMARY KEY,
    ide_prod                INTEGER         NOT NULL,
    ide_pedi                INTEGER         NOT NULL,
    cantidad_prod           INTEGER         NOT NULL CHECK (cantidad_prod > 0),
    precio_unitario_prod    DECIMAL(10, 2)  NOT NULL CHECK (precio_unitario_prod >= 0),
    dcto_prod               DECIMAL(10, 2)  NOT NULL CHECK (dcto_prod >= 0) DEFAULT 0 ,
    iva_prod                DECIMAL(10, 2)  NOT NULL CHECK (iva_prod >= 0) DEFAULT 0,
    subtotal_prod           DECIMAL(10, 2)  NOT NULL CHECK (subtotal_prod >= 0)
);

-- 
-- TABLE: detalle_entrega 
--
CREATE TABLE detalle_entrega(
    ide_deta_entr           SERIAL          PRIMARY KEY,
    ide_entr                INTEGER         NOT NULL,
    ide_prod                INTEGER         NOT NULL,
    cantidad_prod           INTEGER         NOT NULL CHECK (cantidad_prod > 0),
    precio_unitario_prod    DECIMAL(10, 2)  NOT NULL CHECK (precio_unitario_prod >= 0),
    dcto_prod               DECIMAL(10, 2)  NOT NULL CHECK (dcto_prod >= 0) DEFAULT 0,
    iva_prod                DECIMAL(10, 2)  NOT NULL CHECK (iva_prod >= 0) DEFAULT 0,
    subtotal_prod           DECIMAL(10, 2)  NOT NULL CHECK (subtotal_prod >= 0)
);

-- 
-- TABLE: detalle_venta 
--
CREATE TABLE detalle_venta(
    ide_deta_vent           SERIAL          PRIMARY KEY,
    ide_vent                INTEGER         NOT NULL,
    ide_prod                INTEGER         NOT NULL,
    cantidad_prod           INTEGER         NOT NULL CHECK (cantidad_prod > 0),
    precio_unitario_prod    DECIMAL(10, 2)  NOT NULL CHECK (precio_unitario_prod >= 0),
    dcto_prod               DECIMAL(10, 2)  NOT NULL CHECK (dcto_prod >= 0) DEFAULT 0,
    dcto_promo              DECIMAL(10, 2)  NOT NULL CHECK (dcto_promo >= 0) DEFAULT 0,
    iva_prod                DECIMAL(10, 2)  NOT NULL CHECK (iva_prod >= 0) DEFAULT 0,
    subtotal_prod           DECIMAL(10, 2)  NOT NULL CHECK (subtotal_prod >= 0)
);

-- 
-- CONSTRAINTS - FOREIGN KEYS
--

-- acceso_usuario
ALTER TABLE acceso_usuario ADD CONSTRAINT fk_acceso_usuario_cuenta
    FOREIGN KEY (ide_cuen) REFERENCES cuenta(ide_cuen) ON DELETE CASCADE;

-- cuenta
ALTER TABLE cuenta ADD CONSTRAINT fk_cuenta_empleado
    FOREIGN KEY (ide_empl) REFERENCES empleado(ide_empl) ON DELETE CASCADE;
ALTER TABLE cuenta ADD CONSTRAINT fk_cuenta_perfil
    FOREIGN KEY (ide_perf) REFERENCES perfil(ide_perf) ON DELETE CASCADE;

-- detalle_entrega
ALTER TABLE detalle_entrega ADD CONSTRAINT fk_detalle_entrega_entrega
    FOREIGN KEY (ide_entr) REFERENCES entrega(ide_entr) ON DELETE CASCADE;
ALTER TABLE detalle_entrega ADD CONSTRAINT fk_detalle_entrega_producto
    FOREIGN KEY (ide_prod) REFERENCES producto(ide_prod) ON DELETE CASCADE;

-- detalle_pedido
ALTER TABLE detalle_pedido ADD CONSTRAINT fk_detalle_pedido_pedido
    FOREIGN KEY (ide_pedi) REFERENCES pedido(ide_pedi) ON DELETE CASCADE;
ALTER TABLE detalle_pedido ADD CONSTRAINT fk_detalle_pedido_producto
    FOREIGN KEY (ide_prod) REFERENCES producto(ide_prod) ON DELETE CASCADE;

-- detalle_venta
ALTER TABLE detalle_venta ADD CONSTRAINT fk_detalle_venta_producto
    FOREIGN KEY (ide_prod) REFERENCES producto(ide_prod) ON DELETE CASCADE;
ALTER TABLE detalle_venta ADD CONSTRAINT fk_detalle_venta_venta
    FOREIGN KEY (ide_vent) REFERENCES venta(ide_vent) ON DELETE CASCADE;

-- empleado
ALTER TABLE empleado ADD CONSTRAINT fk_empleado_rol
    FOREIGN KEY (ide_rol) REFERENCES rol(ide_rol) ON DELETE RESTRICT;

-- empresa_precios
ALTER TABLE empresa_precios ADD CONSTRAINT fk_empresa_precios_empresa
    FOREIGN KEY (ide_empr) REFERENCES empresa(ide_empr) ON DELETE CASCADE;
ALTER TABLE empresa_precios ADD CONSTRAINT fk_empresa_precios_producto
    FOREIGN KEY (ide_prod) REFERENCES producto(ide_prod) ON DELETE CASCADE;

-- entrega
ALTER TABLE entrega ADD CONSTRAINT fk_entrega_proveedor
    FOREIGN KEY (ide_prov) REFERENCES proveedor(ide_prov) ON DELETE RESTRICT;
ALTER TABLE entrega ADD CONSTRAINT fk_entrega_pedido
    FOREIGN KEY (ide_pedi) REFERENCES pedido(ide_pedi) ON DELETE CASCADE;

-- lote
ALTER TABLE lote ADD CONSTRAINT fk_lote_producto
    FOREIGN KEY (ide_prod) REFERENCES producto(ide_prod) ON DELETE CASCADE;

-- pedido
ALTER TABLE pedido ADD CONSTRAINT fk_pedido_empresa
    FOREIGN KEY (ide_empr) REFERENCES empresa(ide_empr) ON DELETE RESTRICT;

-- perfil
ALTER TABLE perfil ADD CONSTRAINT fk_perfil_rol
    FOREIGN KEY (ide_rol) REFERENCES rol(ide_rol) ON DELETE CASCADE;

-- perfil_opciones
ALTER TABLE perfil_opciones ADD CONSTRAINT fk_perfil_opciones_perfil
    FOREIGN KEY (ide_perf) REFERENCES perfil(ide_perf) ON DELETE CASCADE;
ALTER TABLE perfil_opciones ADD CONSTRAINT fk_perfil_opciones_opciones
    FOREIGN KEY (ide_opci) REFERENCES opciones(ide_opci) ON DELETE CASCADE;

-- producto
ALTER TABLE producto ADD CONSTRAINT fk_producto_categoria
    FOREIGN KEY (ide_cate) REFERENCES categoria(ide_cate) ON DELETE RESTRICT;
ALTER TABLE producto ADD CONSTRAINT fk_producto_marca
    FOREIGN KEY (ide_marc) REFERENCES marca(ide_marc) ON DELETE RESTRICT;

-- proveedor
ALTER TABLE proveedor ADD CONSTRAINT fk_proveedor_empresa
    FOREIGN KEY (ide_empr) REFERENCES empresa(ide_empr) ON DELETE RESTRICT;

-- venta
ALTER TABLE venta ADD CONSTRAINT fk_venta_cliente
    FOREIGN KEY (ide_clie) REFERENCES cliente(ide_clie) ON DELETE RESTRICT;
ALTER TABLE venta ADD CONSTRAINT fk_venta_empleado
    FOREIGN KEY (ide_empl) REFERENCES empleado(ide_empl) ON DELETE RESTRICT;
/*
-- 
-- ÍNDICES para mejorar rendimiento
--
CREATE INDEX idx_producto_categoria ON producto(ide_cate);
CREATE INDEX idx_producto_marca ON producto(ide_marc);
CREATE INDEX idx_detalle_venta_producto ON detalle_venta(ide_prod);
CREATE INDEX idx_detalle_venta_venta ON detalle_venta(ide_vent);
CREATE INDEX idx_venta_cliente ON venta(ide_clie);
CREATE INDEX idx_venta_empleado ON venta(ide_empl);
CREATE INDEX idx_empleado_rol ON empleado(ide_rol);
CREATE INDEX idx_cuenta_empleado ON cuenta(ide_empl);
CREATE INDEX idx_acceso_usuario_cuenta ON acceso_usuario(ide_cuen);
CREATE INDEX idx_lote_producto ON lote(ide_prod);
CREATE INDEX idx_empresa_precios_empresa ON empresa_precios(ide_empr);
CREATE INDEX idx_empresa_precios_producto ON empresa_precios(ide_prod);
*/
/*
-- Comentarios para documentación
COMMENT ON TABLE producto IS 'Tabla de productos del supermercado';
COMMENT ON TABLE venta IS 'Tabla de ventas realizadas';
COMMENT ON TABLE cliente IS 'Tabla de clientes del supermercado';
*/
-- Función para actualizar fecha_actua automáticamente (opcional)
/*CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actua = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar automáticamente fecha_actua (ejemplo para algunas tablas)
CREATE TRIGGER update_producto_updated_at BEFORE UPDATE ON producto
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cliente_updated_at BEFORE UPDATE ON cliente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empleado_updated_at BEFORE UPDATE ON empleado
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();*/