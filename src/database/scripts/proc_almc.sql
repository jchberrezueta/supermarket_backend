--ACCESO_USUARIO
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_acceso_usuario (
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE,
    p_fecha_acce IN acceso_usuario.fecha_acce%TYPE,
    p_num_intentos_acce IN acceso_usuario.num_intentos_acce%TYPE,
    p_ip_acce IN acceso_usuario.ip_acce%TYPE,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE,
    p_latitud_acce IN acceso_usuario.latitud_acce%TYPE DEFAULT NULL,
    p_longitud_acce IN acceso_usuario.longitud_acce%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO acceso_usuario (
        ide_cuen, fecha_acce, num_intentos_acce, ip_acce, 
        navegador_acce, latitud_acce, longitud_acce
    ) VALUES (
        p_ide_cuen, p_fecha_acce, p_num_intentos_acce, p_ip_acce,
        p_navegador_acce, p_latitud_acce, p_longitud_acce
    ) RETURNING ide_acce INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Acceso de usuario registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_acceso_usuario;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_acceso_usuario (
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE,
    p_fecha_acce IN acceso_usuario.fecha_acce%TYPE,
    p_num_intentos_acce IN acceso_usuario.num_intentos_acce%TYPE,
    p_ip_acce IN acceso_usuario.ip_acce%TYPE,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE,
    p_latitud_acce IN acceso_usuario.latitud_acce%TYPE DEFAULT NULL,
    p_longitud_acce IN acceso_usuario.longitud_acce%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE acceso_usuario SET
        ide_cuen = p_ide_cuen,
        fecha_acce = p_fecha_acce,
        num_intentos_acce = p_num_intentos_acce,
        ip_acce = p_ip_acce,
        navegador_acce = p_navegador_acce,
        latitud_acce = p_latitud_acce,
        longitud_acce = p_longitud_acce
    WHERE ide_acce = p_ide_acce;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Acceso de usuario actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_acceso_usuario;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_acceso_usuario (
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM acceso_usuario WHERE ide_acce = p_ide_acce;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Acceso de usuario eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_acceso_usuario;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_accesos_usuario (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR SELECT * FROM acceso_usuario ORDER BY fecha_acce DESC;
    p_response := '{"success": true, "message": "Listado de accesos obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_accesos_usuario;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_acceso_usuario (
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR SELECT * FROM acceso_usuario WHERE ide_acce = p_ide_acce;
    p_response := '{"success": true, "message": "Acceso de usuario encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_acceso_usuario;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_accesos_usuario (
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE DEFAULT NULL,
    p_ip_acce IN acceso_usuario.ip_acce%TYPE DEFAULT NULL,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM acceso_usuario
    WHERE (p_ide_cuen IS NULL OR ide_cuen = p_ide_cuen)
    AND (p_ip_acce IS NULL OR ip_acce = p_ip_acce)
    AND (p_navegador_acce IS NULL OR navegador_acce LIKE '%' || p_navegador_acce || '%')
    ORDER BY fecha_acce DESC;
    
    p_response := '{"success": true, "message": "Filtrado de accesos completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_accesos_usuario;
/



-- Procedimiento para insertar categoría
CREATE OR REPLACE PROCEDURE insertar_categoria (
    p_nombre_cate IN categoria.nombre_cate%TYPE,
    p_descripcion_cate IN categoria.descripcion_cate%TYPE,
    p_usua_ingre IN categoria.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO categoria (
        nombre_cate,
        descripcion_cate,
        usua_ingre,
        fecha_ingre
    ) VALUES (
        p_nombre_cate,
        p_descripcion_cate,
        p_usua_ingre,
        SYSDATE
    ) RETURNING ide_cate INTO p_id;
    
    p_result := 1; -- Éxito
    p_response := '{"success": true, "message": "Categoría insertada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0; -- Error
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_categoria;
/

-- Procedimiento para actualizar categoría
CREATE OR REPLACE PROCEDURE actualizar_categoria (
    p_ide_cate IN categoria.ide_cate%TYPE,
    p_nombre_cate IN categoria.nombre_cate%TYPE,
    p_descripcion_cate IN categoria.descripcion_cate%TYPE,
    p_usua_actua IN categoria.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_count NUMBER;
BEGIN
    -- Verificar si existe la categoría
    SELECT COUNT(*) INTO v_count FROM categoria WHERE ide_cate = p_ide_cate;
    
    IF v_count = 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "Categoría no encontrada"}';
        RETURN;
    END IF;
    
    UPDATE categoria SET
        nombre_cate = p_nombre_cate,
        descripcion_cate = p_descripcion_cate,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_cate = p_ide_cate;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Categoría actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_categoria;
/

-- Procedimiento para eliminar categoría
CREATE OR REPLACE PROCEDURE eliminar_categoria (
    p_ide_cate IN categoria.ide_cate%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_count NUMBER;
BEGIN
    -- Verificar si existe la categoría
    SELECT COUNT(*) INTO v_count FROM categoria WHERE ide_cate = p_ide_cate;
    
    IF v_count = 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "Categoría no encontrada"}';
        RETURN;
    END IF;
    
    -- Verificar si hay productos asociados
    SELECT COUNT(*) INTO v_count FROM producto WHERE ide_cate = p_ide_cate;
    
    IF v_count > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, existen productos asociados a esta categoría"}';
        RETURN;
    END IF;
    
    DELETE FROM categoria WHERE ide_cate = p_ide_cate;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Categoría eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_categoria;
/

-- Procedimiento para listar todas las categorías
CREATE OR REPLACE PROCEDURE listar_categorias (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM categoria
    ORDER BY nombre_cate;
    
    p_response := '{"success": true, "message": "Listado de categorías obtenido correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_categorias;
/

-- Procedimiento para buscar categoría por ID
CREATE OR REPLACE PROCEDURE buscar_categoria (
    p_ide_cate IN categoria.ide_cate%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM categoria
    WHERE ide_cate = p_ide_cate;
    
    p_response := '{"success": true, "message": "Categoría encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_categoria;
/

-- Procedimiento para filtrar categorías por columnas específicas
CREATE OR REPLACE PROCEDURE filtrar_categorias (
    p_nombre IN categoria.nombre_cate%TYPE DEFAULT NULL,
    p_descripcion IN categoria.descripcion_cate%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM categoria
    WHERE (p_nombre IS NULL OR UPPER(nombre_cate) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_descripcion IS NULL OR UPPER(descripcion_cate) LIKE '%' || UPPER(p_descripcion) || '%')
    ORDER BY nombre_cate;
    
    p_response := '{"success": true, "message": "Filtrado de categorías completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_categorias;
/
















































--CLIENTE
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_cliente (
    p_cedula_clie IN cliente.cedula_clie%TYPE,
    p_primer_nombre_clie IN cliente.primer_nombre_clie%TYPE,
    p_segundo_nombre_clie IN cliente.segundo_nombre_clie%TYPE,
    p_apellido_paterno_clie IN cliente.apellido_paterno_clie%TYPE,
    p_apellido_materno_clie IN cliente.apellido_materno_clie%TYPE,
    p_fecha_nacimiento_clie IN cliente.fecha_nacimiento_clie%TYPE,
    p_edad_clie IN cliente.edad_clie%TYPE,
    p_telefono_clie IN cliente.telefono_clie%TYPE,
    p_email_clie IN cliente.email_clie%TYPE,
    p_es_socio IN cliente.es_socio%TYPE,
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE,
    p_usua_ingre IN cliente.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO cliente (
        cedula_clie, primer_nombre_clie, segundo_nombre_clie, apellido_paterno_clie,
        apellido_materno_clie, fecha_nacimiento_clie, edad_clie, telefono_clie,
        email_clie, es_socio, es_tercera_edad, usua_ingre, fecha_ingre
    ) VALUES (
        p_cedula_clie, p_primer_nombre_clie, p_segundo_nombre_clie, p_apellido_paterno_clie,
        p_apellido_materno_clie, p_fecha_nacimiento_clie, p_edad_clie, p_telefono_clie,
        p_email_clie, p_es_socio, p_es_tercera_edad, p_usua_ingre, SYSDATE
    ) RETURNING ide_clie INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_cliente;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_cliente (
    p_ide_clie IN cliente.ide_clie%TYPE,
    p_cedula_clie IN cliente.cedula_clie%TYPE,
    p_primer_nombre_clie IN cliente.primer_nombre_clie%TYPE,
    p_segundo_nombre_clie IN cliente.segundo_nombre_clie%TYPE,
    p_apellido_paterno_clie IN cliente.apellido_paterno_clie%TYPE,
    p_apellido_materno_clie IN cliente.apellido_materno_clie%TYPE,
    p_fecha_nacimiento_clie IN cliente.fecha_nacimiento_clie%TYPE,
    p_edad_clie IN cliente.edad_clie%TYPE,
    p_telefono_clie IN cliente.telefono_clie%TYPE,
    p_email_clie IN cliente.email_clie%TYPE,
    p_es_socio IN cliente.es_socio%TYPE,
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE,
    p_usua_actua IN cliente.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE cliente SET
        cedula_clie = p_cedula_clie,
        primer_nombre_clie = p_primer_nombre_clie,
        segundo_nombre_clie = p_segundo_nombre_clie,
        apellido_paterno_clie = p_apellido_paterno_clie,
        apellido_materno_clie = p_apellido_materno_clie,
        fecha_nacimiento_clie = p_fecha_nacimiento_clie,
        edad_clie = p_edad_clie,
        telefono_clie = p_telefono_clie,
        email_clie = p_email_clie,
        es_socio = p_es_socio,
        es_tercera_edad = p_es_tercera_edad,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_clie = p_ide_clie;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_cliente;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_cliente (
    p_ide_clie IN cliente.ide_clie%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_ventas NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_ventas FROM venta WHERE ide_clie = p_ide_clie;
    
    IF v_ventas > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el cliente tiene ventas asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM cliente WHERE ide_clie = p_ide_clie;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_cliente;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_clientes (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM cliente 
    ORDER BY apellido_paterno_clie, apellido_materno_clie, primer_nombre_clie;
    
    p_response := '{"success": true, "message": "Listado de clientes obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_clientes;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_cliente (
    p_ide_clie IN cliente.ide_clie%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR SELECT * FROM cliente WHERE ide_clie = p_ide_clie;
    p_response := '{"success": true, "message": "Cliente encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_cliente;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_clientes (
    p_cedula_clie IN cliente.cedula_clie%TYPE DEFAULT NULL,
    p_nombre IN VARCHAR2 DEFAULT NULL,
    p_es_socio IN cliente.es_socio%TYPE DEFAULT NULL,
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM cliente
    WHERE (p_cedula_clie IS NULL OR cedula_clie = p_cedula_clie)
    AND (p_nombre IS NULL OR 
         (UPPER(primer_nombre_clie) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(segundo_nombre_clie) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(apellido_paterno_clie) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(apellido_materno_clie) LIKE '%' || UPPER(p_nombre) || '%'))
    AND (p_es_socio IS NULL OR es_socio = p_es_socio)
    AND (p_es_tercera_edad IS NULL OR es_tercera_edad = p_es_tercera_edad)
    ORDER BY apellido_paterno_clie, apellido_materno_clie, primer_nombre_clie;
    
    p_response := '{"success": true, "message": "Filtrado de clientes completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_clientes;
/



--CUENTA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_cuenta (
    p_ide_empl IN cuenta.ide_empl%TYPE,
    p_ide_perf IN cuenta.ide_perf%TYPE,
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE,
    p_password_cuen IN cuenta.password_cuen%TYPE,
    p_estado_cuen IN cuenta.estado_cuen%TYPE,
    p_usua_ingre IN cuenta.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO cuenta (
        ide_empl, ide_perf, usuario_cuen, password_cuen, estado_cuen, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_empl, p_ide_perf, p_usuario_cuen, p_password_cuen, p_estado_cuen, p_usua_ingre, SYSDATE
    ) RETURNING ide_cuen INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta creada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_cuenta;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_cuenta (
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    p_ide_empl IN cuenta.ide_empl%TYPE,
    p_ide_perf IN cuenta.ide_perf%TYPE,
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE,
    p_password_cuen IN cuenta.password_cuen%TYPE,
    p_estado_cuen IN cuenta.estado_cuen%TYPE,
    p_usua_actua IN cuenta.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE cuenta SET
        ide_empl = p_ide_empl,
        ide_perf = p_ide_perf,
        usuario_cuen = p_usuario_cuen,
        password_cuen = p_password_cuen,
        estado_cuen = p_estado_cuen,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_cuen = p_ide_cuen;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_cuenta;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_cuenta (
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_accesos NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_accesos FROM acceso_usuario WHERE ide_cuen = p_ide_cuen;
    
    IF v_accesos > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, la cuenta tiene accesos asociados"}';
        RETURN;
    END IF;
    
    DELETE FROM cuenta WHERE ide_cuen = p_ide_cuen;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_cuenta;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_cuentas (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT c.*, e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado,
           p.nombre_perf as nombre_perfil
    FROM cuenta c
    JOIN empleado e ON c.ide_empl = e.ide_empl
    JOIN perfil p ON c.ide_perf = p.ide_perf
    ORDER BY c.usuario_cuen;
    
    p_response := '{"success": true, "message": "Listado de cuentas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_cuentas;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_cuenta (
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT c.*, e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado,
           p.nombre_perf as nombre_perfil
    FROM cuenta c
    JOIN empleado e ON c.ide_empl = e.ide_empl
    JOIN perfil p ON c.ide_perf = p.ide_perf
    WHERE c.ide_cuen = p_ide_cuen;
    
    p_response := '{"success": true, "message": "Cuenta encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_cuenta;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_cuentas (
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE DEFAULT NULL,
    p_estado_cuen IN cuenta.estado_cuen%TYPE DEFAULT NULL,
    p_ide_empl IN cuenta.ide_empl%TYPE DEFAULT NULL,
    p_ide_perf IN cuenta.ide_perf%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT c.*, e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado,
           p.nombre_perf as nombre_perfil
    FROM cuenta c
    JOIN empleado e ON c.ide_empl = e.ide_empl
    JOIN perfil p ON c.ide_perf = p.ide_perf
    WHERE (p_usuario_cuen IS NULL OR c.usuario_cuen LIKE '%' || p_usuario_cuen || '%')
    AND (p_estado_cuen IS NULL OR c.estado_cuen = p_estado_cuen)
    AND (p_ide_empl IS NULL OR c.ide_empl = p_ide_empl)
    AND (p_ide_perf IS NULL OR c.ide_perf = p_ide_perf)
    ORDER BY c.usuario_cuen;
    
    p_response := '{"success": true, "message": "Filtrado de cuentas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_cuentas;
/



--DETALLE_ENTREGA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_detalle_entrega (
    p_ide_entr IN detalle_entrega.ide_entr%TYPE,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE,
    p_cantidad_prod IN detalle_entrega.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_entrega.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_entrega.dcto_prod%TYPE,
    p_iva_prod IN detalle_entrega.iva_prod%TYPE,
    p_subtotal_prod IN detalle_entrega.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO detalle_entrega (
        ide_entr, ide_prod, cantidad_prod, precio_unitario_prod,
        dcto_prod, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_entr, p_ide_prod, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_entr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de entrega registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_detalle_entrega;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_detalle_entrega (
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    p_ide_entr IN detalle_entrega.ide_entr%TYPE,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE,
    p_cantidad_prod IN detalle_entrega.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_entrega.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_entrega.dcto_prod%TYPE,
    p_iva_prod IN detalle_entrega.iva_prod%TYPE,
    p_subtotal_prod IN detalle_entrega.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE detalle_entrega SET
        ide_entr = p_ide_entr,
        ide_prod = p_ide_prod,
        cantidad_prod = p_cantidad_prod,
        precio_unitario_prod = p_precio_unitario_prod,
        dcto_prod = p_dcto_prod,
        iva_prod = p_iva_prod,
        subtotal_prod = p_subtotal_prod
    WHERE ide_deta_entr = p_ide_deta_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de entrega actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_detalle_entrega;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_detalle_entrega (
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM detalle_entrega WHERE ide_deta_entr = p_ide_deta_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de entrega eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_detalle_entrega;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_detalles_entrega (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT de.*, p.nombre_prod, e.fecha_entr
    FROM detalle_entrega de
    JOIN producto p ON de.ide_prod = p.ide_prod
    JOIN entrega e ON de.ide_entr = e.ide_entr
    ORDER BY de.ide_entr, de.ide_deta_entr;
    
    p_response := '{"success": true, "message": "Listado de detalles de entrega obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_detalles_entrega;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_detalle_entrega (
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT de.*, p.nombre_prod, e.fecha_entr
    FROM detalle_entrega de
    JOIN producto p ON de.ide_prod = p.ide_prod
    JOIN entrega e ON de.ide_entr = e.ide_entr
    WHERE de.ide_deta_entr = p_ide_deta_entr;
    
    p_response := '{"success": true, "message": "Detalle de entrega encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_detalle_entrega;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_detalles_entrega (
    p_ide_entr IN detalle_entrega.ide_entr%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT de.*, p.nombre_prod, e.fecha_entr
    FROM detalle_entrega de
    JOIN producto p ON de.ide_prod = p.ide_prod
    JOIN entrega e ON de.ide_entr = e.ide_entr
    WHERE (p_ide_entr IS NULL OR de.ide_entr = p_ide_entr)
    AND (p_ide_prod IS NULL OR de.ide_prod = p_ide_prod)
    ORDER BY de.ide_entr, de.ide_deta_entr;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de entrega completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_detalles_entrega;
/


--DETALLE_PEDIDO
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_detalle_pedido (
    p_ide_prod IN detalle_pedido.ide_prod%TYPE,
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE,
    p_cantidad_prod IN detalle_pedido.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_pedido.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_pedido.dcto_prod%TYPE,
    p_iva_prod IN detalle_pedido.iva_prod%TYPE,
    p_subtotal_prod IN detalle_pedido.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO detalle_pedido (
        ide_prod, ide_pedi, cantidad_prod, precio_unitario_prod,
        dcto_prod, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_prod, p_ide_pedi, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_pedi INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de pedido registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_detalle_pedido;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_detalle_pedido (
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    p_ide_prod IN detalle_pedido.ide_prod%TYPE,
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE,
    p_cantidad_prod IN detalle_pedido.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_pedido.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_pedido.dcto_prod%TYPE,
    p_iva_prod IN detalle_pedido.iva_prod%TYPE,
    p_subtotal_prod IN detalle_pedido.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE detalle_pedido SET
        ide_prod = p_ide_prod,
        ide_pedi = p_ide_pedi,
        cantidad_prod = p_cantidad_prod,
        precio_unitario_prod = p_precio_unitario_prod,
        dcto_prod = p_dcto_prod,
        iva_prod = p_iva_prod,
        subtotal_prod = p_subtotal_prod
    WHERE ide_deta_pedi = p_ide_deta_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de pedido actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_detalle_pedido;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_detalle_pedido (
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM detalle_pedido WHERE ide_deta_pedi = p_ide_deta_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de pedido eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_detalle_pedido;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_detalles_pedido (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT dp.*, p.nombre_prod, pe.fecha_pedi
    FROM detalle_pedido dp
    JOIN producto p ON dp.ide_prod = p.ide_prod
    JOIN pedido pe ON dp.ide_pedi = pe.ide_pedi
    ORDER BY dp.ide_pedi, dp.ide_deta_pedi;
    
    p_response := '{"success": true, "message": "Listado de detalles de pedido obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_detalles_pedido;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_detalle_pedido (
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT dp.*, p.nombre_prod, pe.fecha_pedi
    FROM detalle_pedido dp
    JOIN producto p ON dp.ide_prod = p.ide_prod
    JOIN pedido pe ON dp.ide_pedi = pe.ide_pedi
    WHERE dp.ide_deta_pedi = p_ide_deta_pedi;
    
    p_response := '{"success": true, "message": "Detalle de pedido encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_detalle_pedido;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_detalles_pedido (
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_pedido.ide_prod%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT dp.*, p.nombre_prod, pe.fecha_pedi
    FROM detalle_pedido dp
    JOIN producto p ON dp.ide_prod = p.ide_prod
    JOIN pedido pe ON dp.ide_pedi = pe.ide_pedi
    WHERE (p_ide_pedi IS NULL OR dp.ide_pedi = p_ide_pedi)
    AND (p_ide_prod IS NULL OR dp.ide_prod = p_ide_prod)
    ORDER BY dp.ide_pedi, dp.ide_deta_pedi;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de pedido completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_detalles_pedido;
/



--DETALLE_VENTA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_detalle_venta (
    p_ide_vent IN detalle_venta.ide_vent%TYPE,
    p_ide_prod IN detalle_venta.ide_prod%TYPE,
    p_cantidad_prod IN detalle_venta.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_venta.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_venta.dcto_prod%TYPE,
    p_dcto_promo IN detalle_venta.dcto_promo%TYPE,
    p_iva_prod IN detalle_venta.iva_prod%TYPE,
    p_subtotal_prod IN detalle_venta.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO detalle_venta (
        ide_vent, ide_prod, cantidad_prod, precio_unitario_prod,
        dcto_prod, dcto_promo, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_vent, p_ide_prod, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_dcto_promo, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_vent INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de venta registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_detalle_venta;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_detalle_venta (
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    p_ide_vent IN detalle_venta.ide_vent%TYPE,
    p_ide_prod IN detalle_venta.ide_prod%TYPE,
    p_cantidad_prod IN detalle_venta.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_venta.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_venta.dcto_prod%TYPE,
    p_dcto_promo IN detalle_venta.dcto_promo%TYPE,
    p_iva_prod IN detalle_venta.iva_prod%TYPE,
    p_subtotal_prod IN detalle_venta.subtotal_prod%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE detalle_venta SET
        ide_vent = p_ide_vent,
        ide_prod = p_ide_prod,
        cantidad_prod = p_cantidad_prod,
        precio_unitario_prod = p_precio_unitario_prod,
        dcto_prod = p_dcto_prod,
        dcto_promo = p_dcto_promo,
        iva_prod = p_iva_prod,
        subtotal_prod = p_subtotal_prod
    WHERE ide_deta_vent = p_ide_deta_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de venta actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_detalle_venta;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_detalle_venta (
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM detalle_venta WHERE ide_deta_vent = p_ide_deta_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de venta eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_detalle_venta;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_detalles_venta (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT dv.*, p.nombre_prod, v.num_factura_vent, v.fecha_vent
    FROM detalle_venta dv
    JOIN producto p ON dv.ide_prod = p.ide_prod
    JOIN venta v ON dv.ide_vent = v.ide_vent
    ORDER BY dv.ide_vent, dv.ide_deta_vent;
    
    p_response := '{"success": true, "message": "Listado de detalles de venta obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_detalles_venta;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_detalle_venta (
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT dv.*, p.nombre_prod, v.num_factura_vent, v.fecha_vent
    FROM detalle_venta dv
    JOIN producto p ON dv.ide_prod = p.ide_prod
    JOIN venta v ON dv.ide_vent = v.ide_vent
    WHERE dv.ide_deta_vent = p_ide_deta_vent;
    
    p_response := '{"success": true, "message": "Detalle de venta encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_detalle_venta;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_detalles_venta (
    p_ide_vent IN detalle_venta.ide_vent%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_venta.ide_prod%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT dv.*, p.nombre_prod, v.num_factura_vent, v.fecha_vent
    FROM detalle_venta dv
    JOIN producto p ON dv.ide_prod = p.ide_prod
    JOIN venta v ON dv.ide_vent = v.ide_vent
    WHERE (p_ide_vent IS NULL OR dv.ide_vent = p_ide_vent)
    AND (p_ide_prod IS NULL OR dv.ide_prod = p_ide_prod)
    ORDER BY dv.ide_vent, dv.ide_deta_vent;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de venta completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_detalles_venta;
/


--EMPLEADO
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_empleado (
    p_ide_rol IN empleado.ide_rol%TYPE,
    p_cedula_empl IN empleado.cedula_empl%TYPE,
    p_primer_nombre_empl IN empleado.primer_nombre_empl%TYPE,
    p_segundo_nombre_empl IN empleado.segundo_nombre_empl%TYPE,
    p_apellido_paterno_empl IN empleado.apellido_paterno_empl%TYPE,
    p_apellido_materno_empl IN empleado.apellido_materno_empl%TYPE,
    p_fecha_nacimiento_empl IN empleado.fecha_nacimiento_empl%TYPE,
    p_edad_empl IN empleado.edad_empl%TYPE,
    p_fecha_inicio_empl IN empleado.fecha_inicio_empl%TYPE,
    p_rmu_empl IN empleado.rmu_empl%TYPE,
    p_fecha_termino_empl IN empleado.fecha_termino_empl%TYPE DEFAULT NULL,
    p_usua_ingre IN empleado.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar cédula única
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM empleado WHERE cedula_empl = p_cedula_empl;
        IF v_count > 0 THEN
            p_result := 0;
            p_id := NULL;
            p_response := '{"success": false, "message": "Ya existe un empleado con esta cédula"}';
            RETURN;
        END IF;
    END;
    
    INSERT INTO empleado (
        ide_rol, cedula_empl, primer_nombre_empl, segundo_nombre_empl,
        apellido_paterno_empl, apellido_materno_empl, fecha_nacimiento_empl,
        edad_empl, fecha_inicio_empl, rmu_empl, fecha_termino_empl,
        usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_rol, p_cedula_empl, p_primer_nombre_empl, p_segundo_nombre_empl,
        p_apellido_paterno_empl, p_apellido_materno_empl, p_fecha_nacimiento_empl,
        p_edad_empl, p_fecha_inicio_empl, p_rmu_empl, p_fecha_termino_empl,
        p_usua_ingre, SYSDATE
    ) RETURNING ide_empl INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_empleado;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_empleado (
    p_ide_empl IN empleado.ide_empl%TYPE,
    p_ide_rol IN empleado.ide_rol%TYPE,
    p_cedula_empl IN empleado.cedula_empl%TYPE,
    p_primer_nombre_empl IN empleado.primer_nombre_empl%TYPE,
    p_segundo_nombre_empl IN empleado.segundo_nombre_empl%TYPE,
    p_apellido_paterno_empl IN empleado.apellido_paterno_empl%TYPE,
    p_apellido_materno_empl IN empleado.apellido_materno_empl%TYPE,
    p_fecha_nacimiento_empl IN empleado.fecha_nacimiento_empl%TYPE,
    p_edad_empl IN empleado.edad_empl%TYPE,
    p_fecha_inicio_empl IN empleado.fecha_inicio_empl%TYPE,
    p_rmu_empl IN empleado.rmu_empl%TYPE,
    p_fecha_termino_empl IN empleado.fecha_termino_empl%TYPE DEFAULT NULL,
    p_usua_actua IN empleado.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar cédula única (excluyendo el propio registro)
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count 
        FROM empleado 
        WHERE cedula_empl = p_cedula_empl AND ide_empl != p_ide_empl;
        
        IF v_count > 0 THEN
            p_result := 0;
            p_response := '{"success": false, "message": "Ya existe otro empleado con esta cédula"}';
            RETURN;
        END IF;
    END;
    
    UPDATE empleado SET
        ide_rol = p_ide_rol,
        cedula_empl = p_cedula_empl,
        primer_nombre_empl = p_primer_nombre_empl,
        segundo_nombre_empl = p_segundo_nombre_empl,
        apellido_paterno_empl = p_apellido_paterno_empl,
        apellido_materno_empl = p_apellido_materno_empl,
        fecha_nacimiento_empl = p_fecha_nacimiento_empl,
        edad_empl = p_edad_empl,
        fecha_inicio_empl = p_fecha_inicio_empl,
        rmu_empl = p_rmu_empl,
        fecha_termino_empl = p_fecha_termino_empl,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_empl = p_ide_empl;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_empleado;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_empleado (
    p_ide_empl IN empleado.ide_empl%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_cuentas NUMBER;
    v_ventas NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cuentas FROM cuenta WHERE ide_empl = p_ide_empl;
    SELECT COUNT(*) INTO v_ventas FROM venta WHERE ide_empl = p_ide_empl;
    
    IF v_cuentas > 0 OR v_ventas > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el empleado tiene cuentas o ventas asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM empleado WHERE ide_empl = p_ide_empl;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_empleado;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_empleados (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT e.*, r.nombre_rol
    FROM empleado e
    JOIN rol r ON e.ide_rol = r.ide_rol
    ORDER BY e.apellido_paterno_empl, e.apellido_materno_empl, e.primer_nombre_empl;
    
    p_response := '{"success": true, "message": "Listado de empleados obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_empleados;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_empleado (
    p_ide_empl IN empleado.ide_empl%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT e.*, r.nombre_rol
    FROM empleado e
    JOIN rol r ON e.ide_rol = r.ide_rol
    WHERE e.ide_empl = p_ide_empl;
    
    p_response := '{"success": true, "message": "Empleado encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_empleado;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_empleados (
    p_cedula_empl IN empleado.cedula_empl%TYPE DEFAULT NULL,
    p_nombre IN VARCHAR2 DEFAULT NULL,
    p_ide_rol IN empleado.ide_rol%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT e.*, r.nombre_rol
    FROM empleado e
    JOIN rol r ON e.ide_rol = r.ide_rol
    WHERE (p_cedula_empl IS NULL OR e.cedula_empl = p_cedula_empl)
    AND (p_nombre IS NULL OR 
         (UPPER(e.primer_nombre_empl) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(e.segundo_nombre_empl) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(e.apellido_paterno_empl) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(e.apellido_materno_empl) LIKE '%' || UPPER(p_nombre) || '%'))
    AND (p_ide_rol IS NULL OR e.ide_rol = p_ide_rol)
    ORDER BY e.apellido_paterno_empl, e.apellido_materno_empl, e.primer_nombre_empl;
    
    p_response := '{"success": true, "message": "Filtrado de empleados completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_empleados;
/


--EMPRESA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_empresa (
    p_nombre_empr IN empresa.nombre_empr%TYPE,
    p_responsable_empr IN empresa.responsable_empr%TYPE,
    p_direccion_empr IN empresa.direccion_empr%TYPE,
    p_telefono_empr IN empresa.telefono_empr%TYPE,
    p_email_empr IN empresa.email_empr%TYPE,
    p_fecha_contrato_empr IN empresa.fecha_contrato_empr%TYPE,
    p_estado_empr IN empresa.estado_empr%TYPE,
    p_usua_ingre IN empresa.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO empresa (
        nombre_empr, responsable_empr, direccion_empr, telefono_empr,
        email_empr, fecha_contrato_empr, estado_empr, usua_ingre, fecha_ingre
    ) VALUES (
        p_nombre_empr, p_responsable_empr, p_direccion_empr, p_telefono_empr,
        p_email_empr, p_fecha_contrato_empr, p_estado_empr, p_usua_ingre, SYSDATE
    ) RETURNING ide_empr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa registrada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_empresa;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_empresa (
    p_ide_empr IN empresa.ide_empr%TYPE,
    p_nombre_empr IN empresa.nombre_empr%TYPE,
    p_responsable_empr IN empresa.responsable_empr%TYPE,
    p_direccion_empr IN empresa.direccion_empr%TYPE,
    p_telefono_empr IN empresa.telefono_empr%TYPE,
    p_email_empr IN empresa.email_empr%TYPE,
    p_fecha_contrato_empr IN empresa.fecha_contrato_empr%TYPE,
    p_estado_empr IN empresa.estado_empr%TYPE,
    p_usua_actua IN empresa.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE empresa SET
        nombre_empr = p_nombre_empr,
        responsable_empr = p_responsable_empr,
        direccion_empr = p_direccion_empr,
        telefono_empr = p_telefono_empr,
        email_empr = p_email_empr,
        fecha_contrato_empr = p_fecha_contrato_empr,
        estado_empr = p_estado_empr,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_empr = p_ide_empr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_empresa;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_empresa (
    p_ide_empr IN empresa.ide_empr%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_proveedores NUMBER;
    v_pedidos NUMBER;
    v_empresa_precios NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_proveedores FROM proveedor WHERE ide_empr = p_ide_empr;
    SELECT COUNT(*) INTO v_pedidos FROM pedido WHERE ide_empr = p_ide_empr;
    SELECT COUNT(*) INTO v_empresa_precios FROM empresa_precios WHERE ide_empr = p_ide_empr;
    
    IF v_proveedores > 0 OR v_pedidos > 0 OR v_empresa_precios > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, la empresa tiene relaciones asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM empresa WHERE ide_empr = p_ide_empr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_empresa;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_empresas (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM empresa
    ORDER BY nombre_empr;
    
    p_response := '{"success": true, "message": "Listado de empresas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_empresas;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_empresa (
    p_ide_empr IN empresa.ide_empr%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM empresa
    WHERE ide_empr = p_ide_empr;
    
    p_response := '{"success": true, "message": "Empresa encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_empresa;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_empresas (
    p_nombre IN empresa.nombre_empr%TYPE DEFAULT NULL,
    p_responsable IN empresa.responsable_empr%TYPE DEFAULT NULL,
    p_estado IN empresa.estado_empr%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM empresa
    WHERE (p_nombre IS NULL OR UPPER(nombre_empr) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_responsable IS NULL OR UPPER(responsable_empr) LIKE '%' || UPPER(p_responsable) || '%')
    AND (p_estado IS NULL OR estado_empr = p_estado)
    ORDER BY nombre_empr;
    
    p_response := '{"success": true, "message": "Filtrado de empresas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_empresas;
/




--EMPRESA_PRECIOS
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_empresa_precios (
    p_ide_empr IN empresa_precios.ide_empr%TYPE,
    p_ide_prod IN empresa_precios.ide_prod%TYPE,
    p_precio_compra_prod IN empresa_precios.precio_compra_prod%TYPE,
    p_dcto_compra_prod IN empresa_precios.dcto_compra_prod%TYPE,
    p_iva_prod IN empresa_precios.iva_prod%TYPE,
    p_dcto_caducidad_prod IN empresa_precios.dcto_caducidad_prod%TYPE,
    p_usua_ingre IN empresa_precios.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO empresa_precios (
        ide_empr, ide_prod, precio_compra_prod, dcto_compra_prod,
        iva_prod, dcto_caducidad_prod, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_empr, p_ide_prod, p_precio_compra_prod, p_dcto_compra_prod,
        p_iva_prod, p_dcto_caducidad_prod, p_usua_ingre, SYSDATE
    ) RETURNING ide_empr_prod INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_empresa_precios;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_empresa_precios (
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    p_ide_empr IN empresa_precios.ide_empr%TYPE,
    p_ide_prod IN empresa_precios.ide_prod%TYPE,
    p_precio_compra_prod IN empresa_precios.precio_compra_prod%TYPE,
    p_dcto_compra_prod IN empresa_precios.dcto_compra_prod%TYPE,
    p_iva_prod IN empresa_precios.iva_prod%TYPE,
    p_dcto_caducidad_prod IN empresa_precios.dcto_caducidad_prod%TYPE,
    p_usua_actua IN empresa_precios.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE empresa_precios SET
        ide_empr = p_ide_empr,
        ide_prod = p_ide_prod,
        precio_compra_prod = p_precio_compra_prod,
        dcto_compra_prod = p_dcto_compra_prod,
        iva_prod = p_iva_prod,
        dcto_caducidad_prod = p_dcto_caducidad_prod,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_empr_prod = p_ide_empr_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_empresa_precios;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_empresa_precios (
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM empresa_precios WHERE ide_empr_prod = p_ide_empr_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_empresa_precios;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_empresas_precios (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT ep.*, e.nombre_empr, p.nombre_prod
    FROM empresa_precios ep
    JOIN empresa e ON ep.ide_empr = e.ide_empr
    JOIN producto p ON ep.ide_prod = p.ide_prod
    ORDER BY e.nombre_empr, p.nombre_prod;
    
    p_response := '{"success": true, "message": "Listado de precios de empresas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_empresas_precios;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_empresa_precios (
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT ep.*, e.nombre_empr, p.nombre_prod
    FROM empresa_precios ep
    JOIN empresa e ON ep.ide_empr = e.ide_empr
    JOIN producto p ON ep.ide_prod = p.ide_prod
    WHERE ep.ide_empr_prod = p_ide_empr_prod;
    
    p_response := '{"success": true, "message": "Precio de empresa encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_empresa_precios;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_empresas_precios (
    p_ide_empr IN empresa_precios.ide_empr%TYPE DEFAULT NULL,
    p_ide_prod IN empresa_precios.ide_prod%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT ep.*, e.nombre_empr, p.nombre_prod
    FROM empresa_precios ep
    JOIN empresa e ON ep.ide_empr = e.ide_empr
    JOIN producto p ON ep.ide_prod = p.ide_prod
    WHERE (p_ide_empr IS NULL OR ep.ide_empr = p_ide_empr)
    AND (p_ide_prod IS NULL OR ep.ide_prod = p_ide_prod)
    ORDER BY e.nombre_empr, p.nombre_prod;
    
    p_response := '{"success": true, "message": "Filtrado de precios de empresas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_empresas_precios;
/




--ENTREGA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_entrega (
    p_ide_prov IN entrega.ide_prov%TYPE,
    p_ide_pedi IN entrega.ide_pedi%TYPE,
    p_fecha_entr IN entrega.fecha_entr%TYPE,
    p_cantidad_total_entr IN entrega.cantidad_total_entr%TYPE,
    p_total_entr IN entrega.total_entr%TYPE,
    p_estado_entr IN entrega.estado_entr%TYPE,
    p_observacion_entr IN entrega.observacion_entr%TYPE,
    p_usua_ingre IN entrega.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO entrega (
        ide_prov, ide_pedi, fecha_entr, cantidad_total_entr,
        total_entr, estado_entr, observacion_entr, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_prov, p_ide_pedi, p_fecha_entr, p_cantidad_total_entr,
        p_total_entr, p_estado_entr, p_observacion_entr, p_usua_ingre, SYSDATE
    ) RETURNING ide_entr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega registrada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_entrega;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_entrega (
    p_ide_entr IN entrega.ide_entr%TYPE,
    p_ide_prov IN entrega.ide_prov%TYPE,
    p_ide_pedi IN entrega.ide_pedi%TYPE,
    p_fecha_entr IN entrega.fecha_entr%TYPE,
    p_cantidad_total_entr IN entrega.cantidad_total_entr%TYPE,
    p_total_entr IN entrega.total_entr%TYPE,
    p_estado_entr IN entrega.estado_entr%TYPE,
    p_observacion_entr IN entrega.observacion_entr%TYPE,
    p_usua_actua IN entrega.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE entrega SET
        ide_prov = p_ide_prov,
        ide_pedi = p_ide_pedi,
        fecha_entr = p_fecha_entr,
        cantidad_total_entr = p_cantidad_total_entr,
        total_entr = p_total_entr,
        estado_entr = p_estado_entr,
        observacion_entr = p_observacion_entr,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_entr = p_ide_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_entrega;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_entrega (
    p_ide_entr IN entrega.ide_entr%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_detalles NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_detalles FROM detalle_entrega WHERE ide_entr = p_ide_entr;
    
    IF v_detalles > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, la entrega tiene detalles asociados"}';
        RETURN;
    END IF;
    
    DELETE FROM entrega WHERE ide_entr = p_ide_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_entrega;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_entregas (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT e.*, pv.primer_nombre_prov || ' ' || pv.apellido_paterno_prov as nombre_proveedor,
           pd.fecha_pedi, pd.estado_pedi
    FROM entrega e
    JOIN proveedor pv ON e.ide_prov = pv.ide_prov
    JOIN pedido pd ON e.ide_pedi = pd.ide_pedi
    ORDER BY e.fecha_entr DESC;
    
    p_response := '{"success": true, "message": "Listado de entregas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_entregas;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_entrega (
    p_ide_entr IN entrega.ide_entr%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT e.*, pv.primer_nombre_prov || ' ' || pv.apellido_paterno_prov as nombre_proveedor,
           pd.fecha_pedi, pd.estado_pedi
    FROM entrega e
    JOIN proveedor pv ON e.ide_prov = pv.ide_prov
    JOIN pedido pd ON e.ide_pedi = pd.ide_pedi
    WHERE e.ide_entr = p_ide_entr;
    
    p_response := '{"success": true, "message": "Entrega encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_entrega;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_entregas (
    p_ide_prov IN entrega.ide_prov%TYPE DEFAULT NULL,
    p_ide_pedi IN entrega.ide_pedi%TYPE DEFAULT NULL,
    p_estado_entr IN entrega.estado_entr%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT e.*, pv.primer_nombre_prov || ' ' || pv.apellido_paterno_prov as nombre_proveedor,
           pd.fecha_pedi, pd.estado_pedi
    FROM entrega e
    JOIN proveedor pv ON e.ide_prov = pv.ide_prov
    JOIN pedido pd ON e.ide_pedi = pd.ide_pedi
    WHERE (p_ide_prov IS NULL OR e.ide_prov = p_ide_prov)
    AND (p_ide_pedi IS NULL OR e.ide_pedi = p_ide_pedi)
    AND (p_estado_entr IS NULL OR e.estado_entr = p_estado_entr)
    ORDER BY e.fecha_entr DESC;
    
    p_response := '{"success": true, "message": "Filtrado de entregas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_entregas;
/




--LOTE
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_lote (
    p_ide_prod IN lote.ide_prod%TYPE,
    p_stock_lote IN lote.stock_lote%TYPE,
    p_estado_lote IN lote.estado_lote%TYPE,
    p_fecha_caducidad_lote IN lote.fecha_caducidad_lote%TYPE,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO lote (
        ide_prod, stock_lote, estado_lote, fecha_caducidad_lote
    ) VALUES (
        p_ide_prod, p_stock_lote, p_estado_lote, p_fecha_caducidad_lote
    ) RETURNING ide_lote INTO p_id;
    
    -- Actualizar stock total del producto
    UPDATE producto SET 
        stock_prod = stock_prod + p_stock_lote
    WHERE ide_prod = p_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_lote;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_lote (
    p_ide_lote IN lote.ide_lote%TYPE,
    p_ide_prod IN lote.ide_prod%TYPE,
    p_stock_lote IN lote.stock_lote%TYPE,
    p_estado_lote IN lote.estado_lote%TYPE,
    p_fecha_caducidad_lote IN lote.fecha_caducidad_lote%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_old_stock NUMBER;
    v_old_prod NUMBER;
BEGIN
    -- Obtener valores anteriores
    SELECT stock_lote, ide_prod INTO v_old_stock, v_old_prod 
    FROM lote WHERE ide_lote = p_ide_lote;
    
    -- Actualizar lote
    UPDATE lote SET
        ide_prod = p_ide_prod,
        stock_lote = p_stock_lote,
        estado_lote = p_estado_lote,
        fecha_caducidad_lote = p_fecha_caducidad_lote
    WHERE ide_lote = p_ide_lote;
    
    -- Ajustar stocks si cambió el producto o la cantidad
    IF v_old_prod != p_ide_prod THEN
        -- Restar del producto anterior
        UPDATE producto SET 
            stock_prod = stock_prod - v_old_stock
        WHERE ide_prod = v_old_prod;
        
        -- Sumar al nuevo producto
        UPDATE producto SET 
            stock_prod = stock_prod + p_stock_lote
        WHERE ide_prod = p_ide_prod;
    ELSE
        -- Ajustar diferencia de stock
        UPDATE producto SET 
            stock_prod = stock_prod + (p_stock_lote - v_old_stock)
        WHERE ide_prod = p_ide_prod;
    END IF;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_lote;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_lote (
    p_ide_lote IN lote.ide_lote%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_stock NUMBER;
    v_ide_prod NUMBER;
BEGIN
    -- Obtener valores para actualizar producto
    SELECT stock_lote, ide_prod INTO v_stock, v_ide_prod 
    FROM lote WHERE ide_lote = p_ide_lote;
    
    DELETE FROM lote WHERE ide_lote = p_ide_lote;
    
    -- Actualizar stock del producto
    UPDATE producto SET 
        stock_prod = stock_prod - v_stock
    WHERE ide_prod = v_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_lote;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_lotes (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT l.*, p.nombre_prod
    FROM lote l
    JOIN producto p ON l.ide_prod = p.ide_prod
    ORDER BY l.fecha_caducidad_lote;
    
    p_response := '{"success": true, "message": "Listado de lotes obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_lotes;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_lote (
    p_ide_lote IN lote.ide_lote%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT l.*, p.nombre_prod
    FROM lote l
    JOIN producto p ON l.ide_prod = p.ide_prod
    WHERE l.ide_lote = p_ide_lote;
    
    p_response := '{"success": true, "message": "Lote encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_lote;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_lotes (
    p_ide_prod IN lote.ide_prod%TYPE DEFAULT NULL,
    p_estado_lote IN lote.estado_lote%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT l.*, p.nombre_prod
    FROM lote l
    JOIN producto p ON l.ide_prod = p.ide_prod
    WHERE (p_ide_prod IS NULL OR l.ide_prod = p_ide_prod)
    AND (p_estado_lote IS NULL OR l.estado_lote = p_estado_lote)
    ORDER BY l.fecha_caducidad_lote;
    
    p_response := '{"success": true, "message": "Filtrado de lotes completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_lotes;
/



--MARCA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_marca (
    p_nombre_marc IN marca.nombre_marc%TYPE,
    p_pais_origen_marc IN marca.pais_origen_marc%TYPE,
    p_descripcion_marc IN marca.descripcion_marc%TYPE,
    p_usua_ingre IN marca.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO marca (
        nombre_marc, pais_origen_marc, descripcion_marc, usua_ingre, fecha_ingre
    ) VALUES (
        p_nombre_marc, p_pais_origen_marc, p_descripcion_marc, p_usua_ingre, SYSDATE
    ) RETURNING ide_marc INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca registrada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_marca;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_marca (
    p_ide_marc IN marca.ide_marc%TYPE,
    p_nombre_marc IN marca.nombre_marc%TYPE,
    p_pais_origen_marc IN marca.pais_origen_marc%TYPE,
    p_descripcion_marc IN marca.descripcion_marc%TYPE,
    p_usua_actua IN marca.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE marca SET
        nombre_marc = p_nombre_marc,
        pais_origen_marc = p_pais_origen_marc,
        descripcion_marc = p_descripcion_marc,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_marc = p_ide_marc;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_marca;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_marca (
    p_ide_marc IN marca.ide_marc%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_productos NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_productos FROM producto WHERE ide_marc = p_ide_marc;
    
    IF v_productos > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, hay productos asociados a esta marca"}';
        RETURN;
    END IF;
    
    DELETE FROM marca WHERE ide_marc = p_ide_marc;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_marca;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_marcas (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM marca
    ORDER BY nombre_marc;
    
    p_response := '{"success": true, "message": "Listado de marcas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_marcas;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_marca (
    p_ide_marc IN marca.ide_marc%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM marca
    WHERE ide_marc = p_ide_marc;
    
    p_response := '{"success": true, "message": "Marca encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_marca;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_marcas (
    p_nombre IN marca.nombre_marc%TYPE DEFAULT NULL,
    p_pais IN marca.pais_origen_marc%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM marca
    WHERE (p_nombre IS NULL OR UPPER(nombre_marc) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_pais IS NULL OR UPPER(pais_origen_marc) LIKE '%' || UPPER(p_pais) || '%')
    ORDER BY nombre_marc;
    
    p_response := '{"success": true, "message": "Filtrado de marcas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_marcas;
/


--OPCIONES
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_opcion (
    p_nombre_opci IN opciones.nombre_opci%TYPE,
    p_ruta_opci IN opciones.ruta_opci%TYPE,
    p_activo_opci IN opciones.activo_opci%TYPE,
    p_descripcion_opci IN opciones.descripcion_opci%TYPE,
    p_usua_ingre IN opciones.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO opciones (
        nombre_opci, ruta_opci, activo_opci, descripcion_opci, usua_ingre, fecha_ingre
    ) VALUES (
        p_nombre_opci, p_ruta_opci, p_activo_opci, p_descripcion_opci, p_usua_ingre, SYSDATE
    ) RETURNING ide_opci INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción registrada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_opcion;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_opcion (
    p_ide_opci IN opciones.ide_opci%TYPE,
    p_nombre_opci IN opciones.nombre_opci%TYPE,
    p_ruta_opci IN opciones.ruta_opci%TYPE,
    p_activo_opci IN opciones.activo_opci%TYPE,
    p_descripcion_opci IN opciones.descripcion_opci%TYPE,
    p_usua_actua IN opciones.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE opciones SET
        nombre_opci = p_nombre_opci,
        ruta_opci = p_ruta_opci,
        activo_opci = p_activo_opci,
        descripcion_opci = p_descripcion_opci,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_opci = p_ide_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_opcion;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_opcion (
    p_ide_opci IN opciones.ide_opci%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_perfiles NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_perfiles FROM perfil_opciones WHERE ide_opci = p_ide_opci;
    
    IF v_perfiles > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, hay perfiles asociados a esta opción"}';
        RETURN;
    END IF;
    
    DELETE FROM opciones WHERE ide_opci = p_ide_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_opcion;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_opciones (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM opciones
    ORDER BY nombre_opci;
    
    p_response := '{"success": true, "message": "Listado de opciones obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_opciones;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_opcion (
    p_ide_opci IN opciones.ide_opci%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM opciones
    WHERE ide_opci = p_ide_opci;
    
    p_response := '{"success": true, "message": "Opción encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_opcion;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_opciones (
    p_nombre IN opciones.nombre_opci%TYPE DEFAULT NULL,
    p_activo IN opciones.activo_opci%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM opciones
    WHERE (p_nombre IS NULL OR UPPER(nombre_opci) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_activo IS NULL OR activo_opci = p_activo)
    ORDER BY nombre_opci;
    
    p_response := '{"success": true, "message": "Filtrado de opciones completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_opciones;
/


--PEDIDOS
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_pedido (
    p_ide_empr IN pedido.ide_empr%TYPE,
    p_fecha_pedi IN pedido.fecha_pedi%TYPE,
    p_fecha_entr_pedi IN pedido.fecha_entr_pedi%TYPE,
    p_cantidad_total_pedi IN pedido.cantidad_total_pedi%TYPE,
    p_total_pedi IN pedido.total_pedi%TYPE,
    p_estado_pedi IN pedido.estado_pedi%TYPE,
    p_motivo_pedi IN pedido.motivo_pedi%TYPE,
    p_observacion_pedi IN pedido.observacion_pedi%TYPE,
    p_usua_ingre IN pedido.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO pedido (
        ide_empr, fecha_pedi, fecha_entr_pedi, cantidad_total_pedi,
        total_pedi, estado_pedi, motivo_pedi, observacion_pedi, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_empr, p_fecha_pedi, p_fecha_entr_pedi, p_cantidad_total_pedi,
        p_total_pedi, p_estado_pedi, p_motivo_pedi, p_observacion_pedi, p_usua_ingre, SYSDATE
    ) RETURNING ide_pedi INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_pedido;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_pedido (
    p_ide_pedi IN pedido.ide_pedi%TYPE,
    p_ide_empr IN pedido.ide_empr%TYPE,
    p_fecha_pedi IN pedido.fecha_pedi%TYPE,
    p_fecha_entr_pedi IN pedido.fecha_entr_pedi%TYPE,
    p_cantidad_total_pedi IN pedido.cantidad_total_pedi%TYPE,
    p_total_pedi IN pedido.total_pedi%TYPE,
    p_estado_pedi IN pedido.estado_pedi%TYPE,
    p_motivo_pedi IN pedido.motivo_pedi%TYPE,
    p_observacion_pedi IN pedido.observacion_pedi%TYPE,
    p_usua_actua IN pedido.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE pedido SET
        ide_empr = p_ide_empr,
        fecha_pedi = p_fecha_pedi,
        fecha_entr_pedi = p_fecha_entr_pedi,
        cantidad_total_pedi = p_cantidad_total_pedi,
        total_pedi = p_total_pedi,
        estado_pedi = p_estado_pedi,
        motivo_pedi = p_motivo_pedi,
        observacion_pedi = p_observacion_pedi,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_pedi = p_ide_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_pedido;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_pedido (
    p_ide_pedi IN pedido.ide_pedi%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_detalles NUMBER;
    v_entregas NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_detalles FROM detalle_pedido WHERE ide_pedi = p_ide_pedi;
    SELECT COUNT(*) INTO v_entregas FROM entrega WHERE ide_pedi = p_ide_pedi;
    
    IF v_detalles > 0 OR v_entregas > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el pedido tiene detalles o entregas asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM pedido WHERE ide_pedi = p_ide_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_pedido;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_pedidos (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT p.*, e.nombre_empr
    FROM pedido p
    JOIN empresa e ON p.ide_empr = e.ide_empr
    ORDER BY p.fecha_pedi DESC;
    
    p_response := '{"success": true, "message": "Listado de pedidos obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_pedidos;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_pedido (
    p_ide_pedi IN pedido.ide_pedi%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT p.*, e.nombre_empr
    FROM pedido p
    JOIN empresa e ON p.ide_empr = e.ide_empr
    WHERE p.ide_pedi = p_ide_pedi;
    
    p_response := '{"success": true, "message": "Pedido encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_pedido;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_pedidos (
    p_ide_empr IN pedido.ide_empr%TYPE DEFAULT NULL,
    p_estado_pedi IN pedido.estado_pedi%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT p.*, e.nombre_empr
    FROM pedido p
    JOIN empresa e ON p.ide_empr = e.ide_empr
    WHERE (p_ide_empr IS NULL OR p.ide_empr = p_ide_empr)
    AND (p_estado_pedi IS NULL OR p.estado_pedi = p_estado_pedi)
    ORDER BY p.fecha_pedi DESC;
    
    p_response := '{"success": true, "message": "Filtrado de pedidos completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_pedidos;
/



--PERFIL
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_perfil (
    p_ide_rol IN perfil.ide_rol%TYPE,
    p_nombre_perf IN perfil.nombre_perf%TYPE,
    p_descripcion_perf IN perfil.descripcion_perf%TYPE,
    p_usua_ingre IN perfil.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO perfil (
        ide_rol, nombre_perf, descripcion_perf, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_rol, p_nombre_perf, p_descripcion_perf, p_usua_ingre, SYSDATE
    ) RETURNING ide_perf INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_perfil;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_perfil (
    p_ide_perf IN perfil.ide_perf%TYPE,
    p_ide_rol IN perfil.ide_rol%TYPE,
    p_nombre_perf IN perfil.nombre_perf%TYPE,
    p_descripcion_perf IN perfil.descripcion_perf%TYPE,
    p_usua_actua IN perfil.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE perfil SET
        ide_rol = p_ide_rol,
        nombre_perf = p_nombre_perf,
        descripcion_perf = p_descripcion_perf,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_perf = p_ide_perf;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_perfil;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_perfil (
    p_ide_perf IN perfil.ide_perf%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_cuentas NUMBER;
    v_opciones NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cuentas FROM cuenta WHERE ide_perf = p_ide_perf;
    SELECT COUNT(*) INTO v_opciones FROM perfil_opciones WHERE ide_perf = p_ide_perf;
    
    IF v_cuentas > 0 OR v_opciones > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el perfil tiene cuentas u opciones asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM perfil WHERE ide_perf = p_ide_perf;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_perfil;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_perfiles (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT pf.*, r.nombre_rol
    FROM perfil pf
    JOIN rol r ON pf.ide_rol = r.ide_rol
    ORDER BY pf.nombre_perf;
    
    p_response := '{"success": true, "message": "Listado de perfiles obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_perfiles;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_perfil (
    p_ide_perf IN perfil.ide_perf%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT pf.*, r.nombre_rol
    FROM perfil pf
    JOIN rol r ON pf.ide_rol = r.ide_rol
    WHERE pf.ide_perf = p_ide_perf;
    
    p_response := '{"success": true, "message": "Perfil encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_perfil;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_perfiles (
    p_nombre IN perfil.nombre_perf%TYPE DEFAULT NULL,
    p_ide_rol IN perfil.ide_rol%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT pf.*, r.nombre_rol
    FROM perfil pf
    JOIN rol r ON pf.ide_rol = r.ide_rol
    WHERE (p_nombre IS NULL OR UPPER(pf.nombre_perf) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_ide_rol IS NULL OR pf.ide_rol = p_ide_rol)
    ORDER BY pf.nombre_perf;
    
    p_response := '{"success": true, "message": "Filtrado de perfiles completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_perfiles;
/




--PERFIL_OPCIONES
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_perfil_opcion (
    p_ide_perf IN perfil_opciones.ide_perf%TYPE,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE,
    p_listar IN perfil_opciones.listar%TYPE,
    p_insertar IN perfil_opciones.insertar%TYPE,
    p_modificar IN perfil_opciones.modificar%TYPE,
    p_eliminar IN perfil_opciones.eliminar%TYPE,
    p_usua_ingre IN perfil_opciones.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO perfil_opciones (
        ide_perf, ide_opci, listar, insertar, modificar, eliminar, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_perf, p_ide_opci, p_listar, p_insertar, p_modificar, p_eliminar, p_usua_ingre, SYSDATE
    ) RETURNING ide_perf_opci INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_perfil_opcion;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_perfil_opcion (
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    p_ide_perf IN perfil_opciones.ide_perf%TYPE,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE,
    p_listar IN perfil_opciones.listar%TYPE,
    p_insertar IN perfil_opciones.insertar%TYPE,
    p_modificar IN perfil_opciones.modificar%TYPE,
    p_eliminar IN perfil_opciones.eliminar%TYPE,
    p_usua_actua IN perfil_opciones.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE perfil_opciones SET
        ide_perf = p_ide_perf,
        ide_opci = p_ide_opci,
        listar = p_listar,
        insertar = p_insertar,
        modificar = p_modificar,
        eliminar = p_eliminar,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_perf_opci = p_ide_perf_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_perfil_opcion;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_perfil_opcion (
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    DELETE FROM perfil_opciones WHERE ide_perf_opci = p_ide_perf_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_perfil_opcion;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_perfiles_opciones (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT po.*, pf.nombre_perf, op.nombre_opci
    FROM perfil_opciones po
    JOIN perfil pf ON po.ide_perf = pf.ide_perf
    JOIN opciones op ON po.ide_opci = op.ide_opci
    ORDER BY pf.nombre_perf, op.nombre_opci;
    
    p_response := '{"success": true, "message": "Listado de permisos de perfiles obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_perfiles_opciones;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_perfil_opcion (
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT po.*, pf.nombre_perf, op.nombre_opci
    FROM perfil_opciones po
    JOIN perfil pf ON po.ide_perf = pf.ide_perf
    JOIN opciones op ON po.ide_opci = op.ide_opci
    WHERE po.ide_perf_opci = p_ide_perf_opci;
    
    p_response := '{"success": true, "message": "Permiso de perfil encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_perfil_opcion;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_perfiles_opciones (
    p_ide_perf IN perfil_opciones.ide_perf%TYPE DEFAULT NULL,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT po.*, pf.nombre_perf, op.nombre_opci
    FROM perfil_opciones po
    JOIN perfil pf ON po.ide_perf = pf.ide_perf
    JOIN opciones op ON po.ide_opci = op.ide_opci
    WHERE (p_ide_perf IS NULL OR po.ide_perf = p_ide_perf)
    AND (p_ide_opci IS NULL OR po.ide_opci = p_ide_opci)
    ORDER BY pf.nombre_perf, op.nombre_opci;
    
    p_response := '{"success": true, "message": "Filtrado de permisos de perfiles completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_perfiles_opciones;
/


--PRODUCTOS
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_producto (
    p_ide_cate IN producto.ide_cate%TYPE,
    p_ide_marc IN producto.ide_marc%TYPE,
    p_codigo_barra_prod IN producto.codigo_barra_prod%TYPE,
    p_nombre_prod IN producto.nombre_prod%TYPE,
    p_precio_compra_prod IN producto.precio_compra_prod%TYPE,
    p_precio_venta_prod IN producto.precio_venta_prod%TYPE,
    p_iva_prod IN producto.iva_prod%TYPE,
    p_dcto_caduc_prod IN producto.dcto_caduc_prod%TYPE,
    p_stock_prod IN producto.stock_prod%TYPE,
    p_dcto_promo_prod IN producto.dcto_promo_prod%TYPE,
    p_disponible_prod IN producto.disponible_prod%TYPE,
    p_estado_prod IN producto.estado_prod%TYPE,
    p_descripcion_prod IN producto.descripcion_prod%TYPE,
    p_usua_ingre IN producto.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar código de barras único
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM producto WHERE codigo_barra_prod = p_codigo_barra_prod;
        IF v_count > 0 THEN
            p_result := 0;
            p_id := NULL;
            p_response := '{"success": false, "message": "Ya existe un producto con este código de barras"}';
            RETURN;
        END IF;
    END;
    
    INSERT INTO producto (
        ide_cate, ide_marc, codigo_barra_prod, nombre_prod,
        precio_compra_prod, precio_venta_prod, iva_prod, dcto_caduc_prod,
        stock_prod, dcto_promo_prod, disponible_prod, estado_prod,
        descripcion_prod, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_cate, p_ide_marc, p_codigo_barra_prod, p_nombre_prod,
        p_precio_compra_prod, p_precio_venta_prod, p_iva_prod, p_dcto_caduc_prod,
        p_stock_prod, p_dcto_promo_prod, p_disponible_prod, p_estado_prod,
        p_descripcion_prod, p_usua_ingre, SYSDATE
    ) RETURNING ide_prod INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_producto;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_producto (
    p_ide_prod IN producto.ide_prod%TYPE,
    p_ide_cate IN producto.ide_cate%TYPE,
    p_ide_marc IN producto.ide_marc%TYPE,
    p_codigo_barra_prod IN producto.codigo_barra_prod%TYPE,
    p_nombre_prod IN producto.nombre_prod%TYPE,
    p_precio_compra_prod IN producto.precio_compra_prod%TYPE,
    p_precio_venta_prod IN producto.precio_venta_prod%TYPE,
    p_iva_prod IN producto.iva_prod%TYPE,
    p_dcto_caduc_prod IN producto.dcto_caduc_prod%TYPE,
    p_stock_prod IN producto.stock_prod%TYPE,
    p_dcto_promo_prod IN producto.dcto_promo_prod%TYPE,
    p_disponible_prod IN producto.disponible_prod%TYPE,
    p_estado_prod IN producto.estado_prod%TYPE,
    p_descripcion_prod IN producto.descripcion_prod%TYPE,
    p_usua_actua IN producto.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar código de barras único (excluyendo el propio registro)
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count 
        FROM producto 
        WHERE codigo_barra_prod = p_codigo_barra_prod AND ide_prod != p_ide_prod;
        
        IF v_count > 0 THEN
            p_result := 0;
            p_response := '{"success": false, "message": "Ya existe otro producto con este código de barras"}';
            RETURN;
        END IF;
    END;
    
    UPDATE producto SET
        ide_cate = p_ide_cate,
        ide_marc = p_ide_marc,
        codigo_barra_prod = p_codigo_barra_prod,
        nombre_prod = p_nombre_prod,
        precio_compra_prod = p_precio_compra_prod,
        precio_venta_prod = p_precio_venta_prod,
        iva_prod = p_iva_prod,
        dcto_caduc_prod = p_dcto_caduc_prod,
        stock_prod = p_stock_prod,
        dcto_promo_prod = p_dcto_promo_prod,
        disponible_prod = p_disponible_prod,
        estado_prod = p_estado_prod,
        descripcion_prod = p_descripcion_prod,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_prod = p_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_producto;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_producto (
    p_ide_prod IN producto.ide_prod%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_detalles_venta NUMBER;
    v_detalles_pedido NUMBER;
    v_detalles_entrega NUMBER;
    v_lotes NUMBER;
    v_empresa_precios NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_detalles_venta FROM detalle_venta WHERE ide_prod = p_ide_prod;
    SELECT COUNT(*) INTO v_detalles_pedido FROM detalle_pedido WHERE ide_prod = p_ide_prod;
    SELECT COUNT(*) INTO v_detalles_entrega FROM detalle_entrega WHERE ide_prod = p_ide_prod;
    SELECT COUNT(*) INTO v_lotes FROM lote WHERE ide_prod = p_ide_prod;
    SELECT COUNT(*) INTO v_empresa_precios FROM empresa_precios WHERE ide_prod = p_ide_prod;
    
    IF v_detalles_venta > 0 OR v_detalles_pedido > 0 OR v_detalles_entrega > 0 OR v_lotes > 0 OR v_empresa_precios > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el producto tiene relaciones asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM producto WHERE ide_prod = p_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_producto;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_productos (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT p.*, c.nombre_cate, m.nombre_marc
    FROM producto p
    JOIN categoria c ON p.ide_cate = c.ide_cate
    JOIN marca m ON p.ide_marc = m.ide_marc
    ORDER BY p.nombre_prod;
    
    p_response := '{"success": true, "message": "Listado de productos obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_productos;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_producto (
    p_ide_prod IN producto.ide_prod%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT p.*, c.nombre_cate, m.nombre_marc
    FROM producto p
    JOIN categoria c ON p.ide_cate = c.ide_cate
    JOIN marca m ON p.ide_marc = m.ide_marc
    WHERE p.ide_prod = p_ide_prod;
    
    p_response := '{"success": true, "message": "Producto encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_producto;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_productos (
    p_nombre IN producto.nombre_prod%TYPE DEFAULT NULL,
    p_codigo_barra IN producto.codigo_barra_prod%TYPE DEFAULT NULL,
    p_ide_cate IN producto.ide_cate%TYPE DEFAULT NULL,
    p_ide_marc IN producto.ide_marc%TYPE DEFAULT NULL,
    p_estado IN producto.estado_prod%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT p.*, c.nombre_cate, m.nombre_marc
    FROM producto p
    JOIN categoria c ON p.ide_cate = c.ide_cate
    JOIN marca m ON p.ide_marc = m.ide_marc
    WHERE (p_nombre IS NULL OR UPPER(p.nombre_prod) LIKE '%' || UPPER(p_nombre) || '%')
    AND (p_codigo_barra IS NULL OR p.codigo_barra_prod = p_codigo_barra)
    AND (p_ide_cate IS NULL OR p.ide_cate = p_ide_cate)
    AND (p_ide_marc IS NULL OR p.ide_marc = p_ide_marc)
    AND (p_estado IS NULL OR p.estado_prod = p_estado)
    ORDER BY p.nombre_prod;
    
    p_response := '{"success": true, "message": "Filtrado de productos completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_productos;
/



--PROVEEDOR
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_proveedor (
    p_ide_empr IN proveedor.ide_empr%TYPE,
    p_cedula_prov IN proveedor.cedula_prov%TYPE,
    p_primer_nombre_prov IN proveedor.primer_nombre_prov%TYPE,
    p_segundo_nombre_prov IN proveedor.segundo_nombre_prov%TYPE,
    p_apellido_paterno_prov IN proveedor.apellido_paterno_prov%TYPE,
    p_apellido_materno_prov IN proveedor.apellido_materno_prov%TYPE,
    p_fecha_nacimiento_prov IN proveedor.fecha_nacimiento_prov%TYPE,
    p_edad_prov IN proveedor.edad_prov%TYPE,
    p_telefono_prov IN proveedor.telefono_prov%TYPE,
    p_email_prov IN proveedor.email_prov%TYPE,
    p_usua_ingre IN proveedor.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar cédula única
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM proveedor WHERE cedula_prov = p_cedula_prov;
        IF v_count > 0 THEN
            p_result := 0;
            p_id := NULL;
            p_response := '{"success": false, "message": "Ya existe un proveedor con esta cédula"}';
            RETURN;
        END IF;
    END;
    
    INSERT INTO proveedor (
        ide_empr, cedula_prov, primer_nombre_prov, segundo_nombre_prov,
        apellido_paterno_prov, apellido_materno_prov, fecha_nacimiento_prov,
        edad_prov, telefono_prov, email_prov, usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_empr, p_cedula_prov, p_primer_nombre_prov, p_segundo_nombre_prov,
        p_apellido_paterno_prov, p_apellido_materno_prov, p_fecha_nacimiento_prov,
        p_edad_prov, p_telefono_prov, p_email_prov, p_usua_ingre, SYSDATE
    ) RETURNING ide_prov INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_proveedor;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_proveedor (
    p_ide_prov IN proveedor.ide_prov%TYPE,
    p_ide_empr IN proveedor.ide_empr%TYPE,
    p_cedula_prov IN proveedor.cedula_prov%TYPE,
    p_primer_nombre_prov IN proveedor.primer_nombre_prov%TYPE,
    p_segundo_nombre_prov IN proveedor.segundo_nombre_prov%TYPE,
    p_apellido_paterno_prov IN proveedor.apellido_paterno_prov%TYPE,
    p_apellido_materno_prov IN proveedor.apellido_materno_prov%TYPE,
    p_fecha_nacimiento_prov IN proveedor.fecha_nacimiento_prov%TYPE,
    p_edad_prov IN proveedor.edad_prov%TYPE,
    p_telefono_prov IN proveedor.telefono_prov%TYPE,
    p_email_prov IN proveedor.email_prov%TYPE,
    p_usua_actua IN proveedor.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar cédula única (excluyendo el propio registro)
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count 
        FROM proveedor 
        WHERE cedula_prov = p_cedula_prov AND ide_prov != p_ide_prov;
        
        IF v_count > 0 THEN
            p_result := 0;
            p_response := '{"success": false, "message": "Ya existe otro proveedor con esta cédula"}';
            RETURN;
        END IF;
    END;
    
    UPDATE proveedor SET
        ide_empr = p_ide_empr,
        cedula_prov = p_cedula_prov,
        primer_nombre_prov = p_primer_nombre_prov,
        segundo_nombre_prov = p_segundo_nombre_prov,
        apellido_paterno_prov = p_apellido_paterno_prov,
        apellido_materno_prov = p_apellido_materno_prov,
        fecha_nacimiento_prov = p_fecha_nacimiento_prov,
        edad_prov = p_edad_prov,
        telefono_prov = p_telefono_prov,
        email_prov = p_email_prov,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_prov = p_ide_prov;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_proveedor;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_proveedor (
    p_ide_prov IN proveedor.ide_prov%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_entregas NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_entregas FROM entrega WHERE ide_prov = p_ide_prov;
    
    IF v_entregas > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el proveedor tiene entregas asociadas"}';
        RETURN;
    END IF;
    
    DELETE FROM proveedor WHERE ide_prov = p_ide_prov;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_proveedor;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_proveedores (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT pv.*, e.nombre_empr
    FROM proveedor pv
    JOIN empresa e ON pv.ide_empr = e.ide_empr
    ORDER BY pv.apellido_paterno_prov, pv.apellido_materno_prov, pv.primer_nombre_prov;
    
    p_response := '{"success": true, "message": "Listado de proveedores obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_proveedores;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_proveedor (
    p_ide_prov IN proveedor.ide_prov%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT pv.*, e.nombre_empr
    FROM proveedor pv
    JOIN empresa e ON pv.ide_empr = e.ide_empr
    WHERE pv.ide_prov = p_ide_prov;
    
    p_response := '{"success": true, "message": "Proveedor encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_proveedor;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_proveedores (
    p_cedula IN proveedor.cedula_prov%TYPE DEFAULT NULL,
    p_nombre IN VARCHAR2 DEFAULT NULL,
    p_ide_empr IN proveedor.ide_empr%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT pv.*, e.nombre_empr
    FROM proveedor pv
    JOIN empresa e ON pv.ide_empr = e.ide_empr
    WHERE (p_cedula IS NULL OR pv.cedula_prov = p_cedula)
    AND (p_nombre IS NULL OR 
         (UPPER(pv.primer_nombre_prov) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(pv.segundo_nombre_prov) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(pv.apellido_paterno_prov) LIKE '%' || UPPER(p_nombre) || '%' OR
          UPPER(pv.apellido_materno_prov) LIKE '%' || UPPER(p_nombre) || '%'))
    AND (p_ide_empr IS NULL OR pv.ide_empr = p_ide_empr)
    ORDER BY pv.apellido_paterno_prov, pv.apellido_materno_prov, pv.primer_nombre_prov;
    
    p_response := '{"success": true, "message": "Filtrado de proveedores completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_proveedores;
/




--ROL
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_rol (
    p_nombre_rol IN rol.nombre_rol%TYPE,
    p_descripcion_rol IN rol.descripcion_rol%TYPE,
    p_usua_ingre IN rol.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    INSERT INTO rol (
        nombre_rol, descripcion_rol, usua_ingre, fecha_ingre
    ) VALUES (
        p_nombre_rol, p_descripcion_rol, p_usua_ingre, SYSDATE
    ) RETURNING ide_rol INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol registrado", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_rol;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_rol (
    p_ide_rol IN rol.ide_rol%TYPE,
    p_nombre_rol IN rol.nombre_rol%TYPE,
    p_descripcion_rol IN rol.descripcion_rol%TYPE,
    p_usua_actua IN rol.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    UPDATE rol SET
        nombre_rol = p_nombre_rol,
        descripcion_rol = p_descripcion_rol,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_rol = p_ide_rol;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol actualizado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_rol;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_rol (
    p_ide_rol IN rol.ide_rol%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_empleados NUMBER;
    v_perfiles NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_empleados FROM empleado WHERE ide_rol = p_ide_rol;
    SELECT COUNT(*) INTO v_perfiles FROM perfil WHERE ide_rol = p_ide_rol;
    
    IF v_empleados > 0 OR v_perfiles > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, el rol tiene empleados o perfiles asociados"}';
        RETURN;
    END IF;
    
    DELETE FROM rol WHERE ide_rol = p_ide_rol;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol eliminado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_rol;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_roles (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM rol
    ORDER BY nombre_rol;
    
    p_response := '{"success": true, "message": "Listado de roles obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_roles;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_rol (
    p_ide_rol IN rol.ide_rol%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT * FROM rol
    WHERE ide_rol = p_ide_rol;
    
    p_response := '{"success": true, "message": "Rol encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_rol;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_roles (
    p_nombre IN rol.nombre_rol%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT * FROM rol
    WHERE (p_nombre IS NULL OR UPPER(nombre_rol) LIKE '%' || UPPER(p_nombre) || '%')
    ORDER BY nombre_rol;
    
    p_response := '{"success": true, "message": "Filtrado de roles completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_roles;
/




--VENTA
-- Insertar
CREATE OR REPLACE PROCEDURE insertar_venta (
    p_ide_clie IN venta.ide_clie%TYPE,
    p_ide_empl IN venta.ide_empl%TYPE,
    p_num_factura_vent IN venta.num_factura_vent%TYPE,
    p_fecha_vent IN venta.fecha_vent%TYPE,
    p_sub_total_vent IN venta.sub_total_vent%TYPE,
    p_dcto_vent IN venta.dcto_vent%TYPE,
    p_total_vent IN venta.total_vent%TYPE,
    p_estado_vent IN venta.estado_vent%TYPE,
    p_usua_ingre IN venta.usua_ingre%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_id OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar número de factura único
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM venta WHERE num_factura_vent = p_num_factura_vent;
        IF v_count > 0 THEN
            p_result := 0;
            p_id := NULL;
            p_response := '{"success": false, "message": "Ya existe una venta con este número de factura"}';
            RETURN;
        END IF;
    END;
    
    INSERT INTO venta (
        ide_clie, ide_empl, num_factura_vent, fecha_vent,
        sub_total_vent, dcto_vent, total_vent, estado_vent,
        usua_ingre, fecha_ingre
    ) VALUES (
        p_ide_clie, p_ide_empl, p_num_factura_vent, p_fecha_vent,
        p_sub_total_vent, p_dcto_vent, p_total_vent, p_estado_vent,
        p_usua_ingre, SYSDATE
    ) RETURNING ide_vent INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta registrada", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END insertar_venta;
/

-- Actualizar
CREATE OR REPLACE PROCEDURE actualizar_venta (
    p_ide_vent IN venta.ide_vent%TYPE,
    p_ide_clie IN venta.ide_clie%TYPE,
    p_ide_empl IN venta.ide_empl%TYPE,
    p_num_factura_vent IN venta.num_factura_vent%TYPE,
    p_fecha_vent IN venta.fecha_vent%TYPE,
    p_sub_total_vent IN venta.sub_total_vent%TYPE,
    p_dcto_vent IN venta.dcto_vent%TYPE,
    p_total_vent IN venta.total_vent%TYPE,
    p_estado_vent IN venta.estado_vent%TYPE,
    p_usua_actua IN venta.usua_actua%TYPE DEFAULT NULL,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
BEGIN
    -- Validar número de factura único (excluyendo el propio registro)
    DECLARE
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count 
        FROM venta 
        WHERE num_factura_vent = p_num_factura_vent AND ide_vent != p_ide_vent;
        
        IF v_count > 0 THEN
            p_result := 0;
            p_response := '{"success": false, "message": "Ya existe otra venta con este número de factura"}';
            RETURN;
        END IF;
    END;
    
    UPDATE venta SET
        ide_clie = p_ide_clie,
        ide_empl = p_ide_empl,
        num_factura_vent = p_num_factura_vent,
        fecha_vent = p_fecha_vent,
        sub_total_vent = p_sub_total_vent,
        dcto_vent = p_dcto_vent,
        total_vent = p_total_vent,
        estado_vent = p_estado_vent,
        usua_actua = p_usua_actua,
        fecha_actua = SYSDATE
    WHERE ide_vent = p_ide_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta actualizada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END actualizar_venta;
/

-- Eliminar
CREATE OR REPLACE PROCEDURE eliminar_venta (
    p_ide_vent IN venta.ide_vent%TYPE,
    p_result OUT NUMBER,
    p_response OUT CLOB
) AS
    v_detalles NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_detalles FROM detalle_venta WHERE ide_vent = p_ide_vent;
    
    IF v_detalles > 0 THEN
        p_result := 0;
        p_response := '{"success": false, "message": "No se puede eliminar, la venta tiene detalles asociados"}';
        RETURN;
    END IF;
    
    DELETE FROM venta WHERE ide_vent = p_ide_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta eliminada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END eliminar_venta;
/

-- Listar
CREATE OR REPLACE PROCEDURE listar_ventas (
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT v.*, 
           c.primer_nombre_clie || ' ' || c.apellido_paterno_clie as nombre_cliente,
           e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado
    FROM venta v
    JOIN cliente c ON v.ide_clie = c.ide_clie
    JOIN empleado e ON v.ide_empl = e.ide_empl
    ORDER BY v.fecha_vent DESC;
    
    p_response := '{"success": true, "message": "Listado de ventas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END listar_ventas;
/

-- Buscar por ID
CREATE OR REPLACE PROCEDURE buscar_venta (
    p_ide_vent IN venta.ide_vent%TYPE,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR 
    SELECT v.*, 
           c.primer_nombre_clie || ' ' || c.apellido_paterno_clie as nombre_cliente,
           e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado
    FROM venta v
    JOIN cliente c ON v.ide_clie = c.ide_clie
    JOIN empleado e ON v.ide_empl = e.ide_empl
    WHERE v.ide_vent = p_ide_vent;
    
    p_response := '{"success": true, "message": "Venta encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END buscar_venta;
/

-- Filtrar
CREATE OR REPLACE PROCEDURE filtrar_ventas (
    p_num_factura IN venta.num_factura_vent%TYPE DEFAULT NULL,
    p_ide_clie IN venta.ide_clie%TYPE DEFAULT NULL,
    p_ide_empl IN venta.ide_empl%TYPE DEFAULT NULL,
    p_estado_vent IN venta.estado_vent%TYPE DEFAULT NULL,
    p_result OUT SYS_REFCURSOR,
    p_response OUT CLOB
) AS
BEGIN
    OPEN p_result FOR
    SELECT v.*, 
           c.primer_nombre_clie || ' ' || c.apellido_paterno_clie as nombre_cliente,
           e.primer_nombre_empl || ' ' || e.apellido_paterno_empl as nombre_empleado
    FROM venta v
    JOIN cliente c ON v.ide_clie = c.ide_clie
    JOIN empleado e ON v.ide_empl = e.ide_empl
    WHERE (p_num_factura IS NULL OR v.num_factura_vent = p_num_factura)
    AND (p_ide_clie IS NULL OR v.ide_clie = p_ide_clie)
    AND (p_ide_empl IS NULL OR v.ide_empl = p_ide_empl)
    AND (p_estado_vent IS NULL OR v.estado_vent = p_estado_vent)
    ORDER BY v.fecha_vent DESC;
    
    p_response := '{"success": true, "message": "Filtrado de ventas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END filtrar_ventas;
/





























