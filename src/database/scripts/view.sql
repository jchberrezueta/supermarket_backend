CREATE OR REPLACE VIEW vista_accesos_usuario AS
SELECT 
    au.ide_acce,
    au.ide_cuen,
    cu.usuario_cuen,
    em.primer_nombre_empl || ' ' || em.apellido_paterno_empl AS nombre_empleado,
    au.fecha_acce,
    au.num_intentos_acce,
    au.ip_acce,
    au.navegador_acce,
    au.latitud_acce,
    au.longitud_acce
FROM 
    acceso_usuario au
JOIN 
    cuenta cu ON au.ide_cuen = cu.ide_cuen
JOIN 
    empleado em ON cu.ide_empl = em.ide_empl
ORDER BY 
    au.fecha_acce DESC;
	
	
	
CREATE OR REPLACE VIEW vista_categorias AS
SELECT 
    ide_cate,
    nombre_cate,
    descripcion_cate,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    categoria
ORDER BY 
    nombre_cate;
	
	
	
CREATE OR REPLACE VIEW vista_clientes AS
SELECT 
    ide_clie,
    cedula_clie,
    primer_nombre_clie,
    segundo_nombre_clie,
    apellido_paterno_clie,
    apellido_materno_clie,
    primer_nombre_clie || ' ' || apellido_paterno_clie AS nombre_completo,
    fecha_nacimiento_clie,
    edad_clie,
    telefono_clie,
    email_clie,
    es_socio,
    es_tercera_edad,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    cliente
ORDER BY 
    apellido_paterno_clie, apellido_materno_clie, primer_nombre_clie;
	

CREATE OR REPLACE VIEW vista_cuentas AS
SELECT 
    c.ide_cuen,
    c.ide_empl,
    e.primer_nombre_empl || ' ' || e.apellido_paterno_empl AS nombre_empleado,
    c.ide_perf,
    p.nombre_perf,
    c.usuario_cuen,
    c.password_cuen,
    c.estado_cuen,
    c.usua_ingre,
    c.fecha_ingre,
    c.usua_actua,
    c.fecha_actua
FROM 
    cuenta c
JOIN 
    empleado e ON c.ide_empl = e.ide_empl
JOIN 
    perfil p ON c.ide_perf = p.ide_perf
ORDER BY 
    c.usuario_cuen;
	
	
CREATE OR REPLACE VIEW vista_detalles_entrega AS
SELECT 
    de.ide_deta_entr,
    de.ide_entr,
    e.fecha_entr,
    e.estado_entr,
    de.ide_prod,
    p.nombre_prod,
    p.codigo_barra_prod,
    de.cantidad_prod,
    de.precio_unitario_prod,
    de.dcto_prod,
    de.iva_prod,
    de.subtotal_prod,
    (de.cantidad_prod * de.precio_unitario_prod) AS total_sin_descuento
FROM 
    detalle_entrega de
JOIN 
    entrega e ON de.ide_entr = e.ide_entr
JOIN 
    producto p ON de.ide_prod = p.ide_prod
ORDER BY 
    de.ide_entr, de.ide_deta_entr;
	
	
	
CREATE OR REPLACE VIEW vista_detalles_pedido AS
SELECT 
    dp.ide_deta_pedi,
    dp.ide_pedi,
    pe.fecha_pedi,
    pe.estado_pedi,
    dp.ide_prod,
    pr.nombre_prod,
    pr.codigo_barra_prod,
    dp.cantidad_prod,
    dp.precio_unitario_prod,
    dp.dcto_prod,
    dp.iva_prod,
    dp.subtotal_prod,
    (dp.cantidad_prod * dp.precio_unitario_prod) AS total_sin_descuento
FROM 
    detalle_pedido dp
JOIN 
    pedido pe ON dp.ide_pedi = pe.ide_pedi
JOIN 
    producto pr ON dp.ide_prod = pr.ide_prod
ORDER BY 
    dp.ide_pedi, dp.ide_deta_pedi;
	
	
CREATE OR REPLACE VIEW vista_detalles_venta AS
SELECT 
    dv.ide_deta_vent,
    dv.ide_vent,
    v.num_factura_vent,
    v.fecha_vent,
    dv.ide_prod,
    p.nombre_prod,
    p.codigo_barra_prod,
    dv.cantidad_prod,
    dv.precio_unitario_prod,
    dv.dcto_prod,
    dv.dcto_promo,
    dv.iva_prod,
    dv.subtotal_prod,
    (dv.cantidad_prod * dv.precio_unitario_prod) AS total_sin_descuento
FROM 
    detalle_venta dv
JOIN 
    venta v ON dv.ide_vent = v.ide_vent
JOIN 
    producto p ON dv.ide_prod = p.ide_prod
ORDER BY 
    dv.ide_vent, dv.ide_deta_vent;
	

CREATE OR REPLACE VIEW vista_empleados AS
SELECT 
    e.ide_empl,
    e.ide_rol,
    r.nombre_rol,
    e.cedula_empl,
    e.primer_nombre_empl,
    e.segundo_nombre_empl,
    e.apellido_paterno_empl,
    e.apellido_materno_empl,
    e.primer_nombre_empl || ' ' || e.apellido_paterno_empl AS nombre_completo,
    e.fecha_nacimiento_empl,
    e.edad_empl,
    e.fecha_inicio_empl,
    e.rmu_empl,
    e.fecha_termino_empl,
    e.usua_ingre,
    e.fecha_ingre,
    e.usua_actua,
    e.fecha_actua
FROM 
    empleado e
JOIN 
    rol r ON e.ide_rol = r.ide_rol
ORDER BY 
    e.apellido_paterno_empl, e.apellido_materno_empl, e.primer_nombre_empl;
	
	

CREATE OR REPLACE VIEW vista_empresas AS
SELECT 
    ide_empr,
    nombre_empr,
    responsable_empr,
    direccion_empr,
    telefono_empr,
    email_empr,
    fecha_contrato_empr,
    estado_empr,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    empresa
ORDER BY 
    nombre_empr;
	
	
	
CREATE OR REPLACE VIEW vista_empresas_precios AS
SELECT 
    ep.ide_empr_prod,
    ep.ide_empr,
    em.nombre_empr,
    ep.ide_prod,
    pr.nombre_prod,
    pr.codigo_barra_prod,
    ep.precio_compra_prod,
    ep.dcto_compra_prod,
    ep.iva_prod,
    ep.dcto_caducidad_prod,
    ep.usua_ingre,
    ep.fecha_ingre,
    ep.usua_actua,
    ep.fecha_actua,
    ROUND(ep.precio_compra_prod * (1 - ep.dcto_compra_prod/100), 2) AS precio_neto
FROM 
    empresa_precios ep
JOIN 
    empresa em ON ep.ide_empr = em.ide_empr
JOIN 
    producto pr ON ep.ide_prod = pr.ide_prod
ORDER BY 
    em.nombre_empr, pr.nombre_prod;
	
	
	
CREATE OR REPLACE VIEW vista_entregas AS
SELECT 
    e.ide_entr,
    e.ide_prov,
    p.primer_nombre_prov || ' ' || p.apellido_paterno_prov AS nombre_proveedor,
    e.ide_pedi,
    pe.fecha_pedi,
    pe.estado_pedi,
    e.fecha_entr,
    e.cantidad_total_entr,
    e.total_entr,
    e.estado_entr,
    e.observacion_entr,
    e.usua_ingre,
    e.fecha_ingre,
    e.usua_actua,
    e.fecha_actua
FROM 
    entrega e
JOIN 
    proveedor p ON e.ide_prov = p.ide_prov
JOIN 
    pedido pe ON e.ide_pedi = pe.ide_pedi
ORDER BY 
    e.fecha_entr DESC;
	
	
	
	
CREATE OR REPLACE VIEW vista_lotes AS
SELECT 
    l.ide_lote,
    l.ide_prod,
    p.nombre_prod,
    p.codigo_barra_prod,
    l.stock_lote,
    l.estado_lote,
    l.fecha_caducidad_lote,
    TRUNC(l.fecha_caducidad_lote) - TRUNC(SYSDATE) AS dias_para_caducar
FROM 
    lote l
JOIN 
    producto p ON l.ide_prod = p.ide_prod
ORDER BY 
    l.fecha_caducidad_lote;
	
	
CREATE OR REPLACE VIEW vista_marcas AS
SELECT 
    ide_marc,
    nombre_marc,
    pais_origen_marc,
    descripcion_marc,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    marca
ORDER BY 
    nombre_marc;
	
	
	
CREATE OR REPLACE VIEW vista_opciones AS
SELECT 
    ide_opci,
    nombre_opci,
    ruta_opci,
    activo_opci,
    descripcion_opci,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    opciones
ORDER BY 
    nombre_opci;
	
	
	
CREATE OR REPLACE VIEW vista_pedidos AS
SELECT 
    p.ide_pedi,
    p.ide_empr,
    e.nombre_empr,
    p.fecha_pedi,
    p.fecha_entr_pedi,
    p.cantidad_total_pedi,
    p.total_pedi,
    p.estado_pedi,
    p.motivo_pedi,
    p.observacion_pedi,
    p.usua_ingre,
    p.fecha_ingre,
    p.usua_actua,
    p.fecha_actua
FROM 
    pedido p
JOIN 
    empresa e ON p.ide_empr = e.ide_empr
ORDER BY 
    p.fecha_pedi DESC;
	
	
	
	
CREATE OR REPLACE VIEW vista_perfiles AS
SELECT 
    p.ide_perf,
    p.ide_rol,
    r.nombre_rol,
    p.nombre_perf,
    p.descripcion_perf,
    p.usua_ingre,
    p.fecha_ingre,
    p.usua_actua,
    p.fecha_actua
FROM 
    perfil p
JOIN 
    rol r ON p.ide_rol = r.ide_rol
ORDER BY 
    p.nombre_perf;
	
	
	
CREATE OR REPLACE VIEW vista_perfiles_opciones AS
SELECT 
    po.ide_perf_opci,
    po.ide_perf,
    pf.nombre_perf,
    po.ide_opci,
    op.nombre_opci,
    op.ruta_opci,
    po.listar,
    po.insertar,
    po.modificar,
    po.eliminar,
    po.usua_ingre,
    po.fecha_ingre,
    po.usua_actua,
    po.fecha_actua
FROM 
    perfil_opciones po
JOIN 
    perfil pf ON po.ide_perf = pf.ide_perf
JOIN 
    opciones op ON po.ide_opci = op.ide_opci
ORDER BY 
    pf.nombre_perf, op.nombre_opci;
	
	
CREATE OR REPLACE VIEW vista_productos AS
SELECT 
    p.ide_prod,
    p.ide_cate,
    c.nombre_cate,
    p.ide_marc,
    m.nombre_marc,
    p.codigo_barra_prod,
    p.nombre_prod,
    p.precio_compra_prod,
    p.precio_venta_prod,
    p.iva_prod,
    p.dcto_caduc_prod,
    p.stock_prod,
    p.dcto_promo_prod,
    p.disponible_prod,
    p.estado_prod,
    p.descripcion_prod,
    p.usua_ingre,
    p.fecha_ingre,
    p.usua_actua,
    p.fecha_actua,
    ROUND(p.precio_venta_prod * (1 - p.dcto_promo_prod/100), 2) AS precio_promocional
FROM 
    producto p
JOIN 
    categoria c ON p.ide_cate = c.ide_cate
JOIN 
    marca m ON p.ide_marc = m.ide_marc
ORDER BY 
    p.nombre_prod;
	
	
	
	
CREATE OR REPLACE VIEW vista_proveedores AS
SELECT 
    p.ide_prov,
    p.ide_empr,
    e.nombre_empr,
    p.cedula_prov,
    p.primer_nombre_prov,
    p.segundo_nombre_prov,
    p.apellido_paterno_prov,
    p.apellido_materno_prov,
    p.primer_nombre_prov || ' ' || p.apellido_paterno_prov AS nombre_completo,
    p.fecha_nacimiento_prov,
    p.edad_prov,
    p.telefono_prov,
    p.email_prov,
    p.usua_ingre,
    p.fecha_ingre,
    p.usua_actua,
    p.fecha_actua
FROM 
    proveedor p
JOIN 
    empresa e ON p.ide_empr = e.ide_empr
ORDER BY 
    p.apellido_paterno_prov, p.apellido_materno_prov, p.primer_nombre_prov;
	
	
	
CREATE OR REPLACE VIEW vista_roles AS
SELECT 
    ide_rol,
    nombre_rol,
    descripcion_rol,
    usua_ingre,
    fecha_ingre,
    usua_actua,
    fecha_actua
FROM 
    rol
ORDER BY 
    nombre_rol;
	
	
	
CREATE OR REPLACE VIEW vista_ventas AS
SELECT 
    v.ide_vent,
    v.ide_clie,
    c.primer_nombre_clie || ' ' || c.apellido_paterno_clie AS nombre_cliente,
    v.ide_empl,
    e.primer_nombre_empl || ' ' || e.apellido_paterno_empl AS nombre_empleado,
    v.num_factura_vent,
    v.fecha_vent,
    v.sub_total_vent,
    v.dcto_vent,
    v.total_vent,
    v.estado_vent,
    v.usua_ingre,
    v.fecha_ingre,
    v.usua_actua,
    v.fecha_actua,
    ROUND((v.dcto_vent / v.sub_total_vent) * 100, 2) AS porcentaje_descuento
FROM 
    venta v
JOIN 
    cliente c ON v.ide_clie = c.ide_clie
JOIN 
    empleado e ON v.ide_empl = e.ide_empl
ORDER BY 
    v.fecha_vent DESC;
	
