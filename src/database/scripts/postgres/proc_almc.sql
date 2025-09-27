-- EMPRESA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_empresa(
    p_nombre_empr IN empresa.nombre_empr%TYPE,
    p_responsable_empr IN empresa.responsable_empr%TYPE,
    p_direccion_empr IN empresa.direccion_empr%TYPE,
    p_telefono_empr IN empresa.telefono_empr%TYPE,
    p_email_empr IN empresa.email_empr%TYPE,
    p_fecha_contrato_empr IN empresa.fecha_contrato_empr%TYPE,
    p_estado_empr IN empresa.estado_empr%TYPE DEFAULT 'inactivo',
    p_descripcion_empr IN empresa.descripcion_empr%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN empresa.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO empresa(
        nombre_empr, responsable_empr, direccion_empr, telefono_empr, 
        email_empr, fecha_contrato_empr, estado_empr, descripcion_empr, usua_ingre
    ) VALUES (
        p_nombre_empr, p_responsable_empr, p_direccion_empr, p_telefono_empr,
        p_email_empr, p_fecha_contrato_empr, p_estado_empr, p_descripcion_empr, p_usua_ingre
    ) RETURNING ide_empr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_empresa(
    p_ide_empr IN empresa.ide_empr%TYPE,
    p_nombre_empr IN empresa.nombre_empr%TYPE,
    p_responsable_empr IN empresa.responsable_empr%TYPE,
    p_direccion_empr IN empresa.direccion_empr%TYPE,
    p_telefono_empr IN empresa.telefono_empr%TYPE,
    p_email_empr IN empresa.email_empr%TYPE,
    p_fecha_contrato_empr IN empresa.fecha_contrato_empr%TYPE,
    p_estado_empr IN empresa.estado_empr%TYPE,
    p_descripcion_empr IN empresa.descripcion_empr%TYPE,
    p_usua_actua IN empresa.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE empresa SET
        nombre_empr = p_nombre_empr,
        responsable_empr = p_responsable_empr,
        direccion_empr = p_direccion_empr,
        telefono_empr = p_telefono_empr,
        email_empr = p_email_empr,
        fecha_contrato_empr = p_fecha_contrato_empr,
        estado_empr = p_estado_empr,
        descripcion_empr = p_descripcion_empr,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_empr = p_ide_empr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_empresa(
    p_ide_empr IN empresa.ide_empr%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM empresa WHERE ide_empr = p_ide_empr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empresa eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_empresa(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empresa ORDER BY nombre_empr;
    p_response := '{"success": true, "message": "Listado de empresas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_empresa(
    p_ide_empr IN empresa.ide_empr%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empresa WHERE ide_empr = p_ide_empr;
    p_response := '{"success": true, "message": "Empresa encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_empresa(
    p_nombre_empr IN empresa.nombre_empr%TYPE DEFAULT NULL,
    p_estado_empr IN empresa.estado_empr%TYPE DEFAULT NULL,
    p_responsable_empr IN empresa.responsable_empr%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM empresa
    WHERE (p_nombre_empr IS NULL OR nombre_empr ILIKE '%' || p_nombre_empr || '%')
    AND (p_estado_empr IS NULL OR estado_empr = p_estado_empr)
    AND (p_responsable_empr IS NULL OR responsable_empr ILIKE '%' || p_responsable_empr || '%')
    ORDER BY nombre_empr;
    
    p_response := '{"success": true, "message": "Filtrado de empresas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- CATEGORIA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_categoria(
    p_nombre_cate IN categoria.nombre_cate%TYPE,
    p_descripcion_cate IN categoria.descripcion_cate%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN categoria.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO categoria(nombre_cate, descripcion_cate, usua_ingre)
    VALUES (p_nombre_cate, p_descripcion_cate, p_usua_ingre)
    RETURNING ide_cate INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Categoría registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_categoria(
    p_ide_cate IN categoria.ide_cate%TYPE,
    p_nombre_cate IN categoria.nombre_cate%TYPE,
    p_descripcion_cate IN categoria.descripcion_cate%TYPE,
    p_usua_actua IN categoria.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE categoria SET
        nombre_cate = p_nombre_cate,
        descripcion_cate = p_descripcion_cate,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_cate = p_ide_cate;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Categoría actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_categoria(
    p_ide_cate IN categoria.ide_cate%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM categoria WHERE ide_cate = p_ide_cate;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Categoría eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_categoria(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM categoria ORDER BY nombre_cate;
    p_response := '{"success": true, "message": "Listado de categorías obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_categoria(
    p_ide_cate IN categoria.ide_cate%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM categoria WHERE ide_cate = p_ide_cate;
    p_response := '{"success": true, "message": "Categoría encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_categoria(
    p_nombre_cate IN categoria.nombre_cate%TYPE DEFAULT NULL,
    p_descripcion_cate IN categoria.descripcion_cate%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM categoria
    WHERE (p_nombre_cate IS NULL OR nombre_cate ILIKE '%' || p_nombre_cate || '%')
    AND (p_descripcion_cate IS NULL OR descripcion_cate ILIKE '%' || p_descripcion_cate || '%')
    ORDER BY nombre_cate;
    
    p_response := '{"success": true, "message": "Filtrado de categorías completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- MARCA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_marca(
    p_nombre_marc IN marca.nombre_marc%TYPE,
    p_pais_origen_marc IN marca.pais_origen_marc%TYPE,
    p_descripcion_marc IN marca.descripcion_marc%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN marca.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO marca(nombre_marc, pais_origen_marc, descripcion_marc, usua_ingre)
    VALUES (p_nombre_marc, p_pais_origen_marc, p_descripcion_marc, p_usua_ingre)
    RETURNING ide_marc INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_marca(
    p_ide_marc IN marca.ide_marc%TYPE,
    p_nombre_marc IN marca.nombre_marc%TYPE,
    p_pais_origen_marc IN marca.pais_origen_marc%TYPE,
    p_descripcion_marc IN marca.descripcion_marc%TYPE,
    p_usua_actua IN marca.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE marca SET
        nombre_marc = p_nombre_marc,
        pais_origen_marc = p_pais_origen_marc,
        descripcion_marc = p_descripcion_marc,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_marc = p_ide_marc;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_marca(
    p_ide_marc IN marca.ide_marc%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM marca WHERE ide_marc = p_ide_marc;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Marca eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_marca(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM marca ORDER BY nombre_marc;
    p_response := '{"success": true, "message": "Listado de marcas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_marca(
    p_ide_marc IN marca.ide_marc%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM marca WHERE ide_marc = p_ide_marc;
    p_response := '{"success": true, "message": "Marca encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_marca(
    p_nombre_marc IN marca.nombre_marc%TYPE DEFAULT NULL,
    p_pais_origen_marc IN marca.pais_origen_marc%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM marca
    WHERE (p_nombre_marc IS NULL OR nombre_marc ILIKE '%' || p_nombre_marc || '%')
    AND (p_pais_origen_marc IS NULL OR pais_origen_marc ILIKE '%' || p_pais_origen_marc || '%')
    ORDER BY nombre_marc;
    
    p_response := '{"success": true, "message": "Filtrado de marcas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- ROL
-- Insertar
CREATE OR REPLACE FUNCTION insertar_rol(
    p_nombre_rol IN rol.nombre_rol%TYPE,
    p_descripcion_rol IN rol.descripcion_rol%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN rol.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO rol(nombre_rol, descripcion_rol, usua_ingre)
    VALUES (p_nombre_rol, p_descripcion_rol, p_usua_ingre)
    RETURNING ide_rol INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_rol(
    p_ide_rol IN rol.ide_rol%TYPE,
    p_nombre_rol IN rol.nombre_rol%TYPE,
    p_descripcion_rol IN rol.descripcion_rol%TYPE,
    p_usua_actua IN rol.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE rol SET
        nombre_rol = p_nombre_rol,
        descripcion_rol = p_descripcion_rol,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_rol = p_ide_rol;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_rol(
    p_ide_rol IN rol.ide_rol%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM rol WHERE ide_rol = p_ide_rol;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Rol eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_rol(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM rol ORDER BY nombre_rol;
    p_response := '{"success": true, "message": "Listado de roles obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_rol(
    p_ide_rol IN rol.ide_rol%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM rol WHERE ide_rol = p_ide_rol;
    p_response := '{"success": true, "message": "Rol encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_rol(
    p_nombre_rol IN rol.nombre_rol%TYPE DEFAULT NULL,
    p_descripcion_rol IN rol.descripcion_rol%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM rol
    WHERE (p_nombre_rol IS NULL OR nombre_rol ILIKE '%' || p_nombre_rol || '%')
    AND (p_descripcion_rol IS NULL OR descripcion_rol ILIKE '%' || p_descripcion_rol || '%')
    ORDER BY nombre_rol;
    
    p_response := '{"success": true, "message": "Filtrado de roles completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- OPCIONES
-- Insertar
CREATE OR REPLACE FUNCTION insertar_opciones(
    p_nombre_opci IN opciones.nombre_opci%TYPE,
    p_ruta_opci IN opciones.ruta_opci%TYPE,
    p_activo_opci IN opciones.activo_opci%TYPE DEFAULT 'no',
    p_descripcion_opci IN opciones.descripcion_opci%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN opciones.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO opciones(nombre_opci, ruta_opci, activo_opci, descripcion_opci, usua_ingre)
    VALUES (p_nombre_opci, p_ruta_opci, p_activo_opci, p_descripcion_opci, p_usua_ingre)
    RETURNING ide_opci INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_opciones(
    p_ide_opci IN opciones.ide_opci%TYPE,
    p_nombre_opci IN opciones.nombre_opci%TYPE,
    p_ruta_opci IN opciones.ruta_opci%TYPE,
    p_activo_opci IN opciones.activo_opci%TYPE,
    p_descripcion_opci IN opciones.descripcion_opci%TYPE,
    p_usua_actua IN opciones.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE opciones SET
        nombre_opci = p_nombre_opci,
        ruta_opci = p_ruta_opci,
        activo_opci = p_activo_opci,
        descripcion_opci = p_descripcion_opci,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_opci = p_ide_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_opciones(
    p_ide_opci IN opciones.ide_opci%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM opciones WHERE ide_opci = p_ide_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Opción eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_opciones(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM opciones ORDER BY nombre_opci;
    p_response := '{"success": true, "message": "Listado de opciones obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_opciones(
    p_ide_opci IN opciones.ide_opci%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM opciones WHERE ide_opci = p_ide_opci;
    p_response := '{"success": true, "message": "Opción encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_opciones(
    p_nombre_opci IN opciones.nombre_opci%TYPE DEFAULT NULL,
    p_ruta_opci IN opciones.ruta_opci%TYPE DEFAULT NULL,
    p_activo_opci IN opciones.activo_opci%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM opciones
    WHERE (p_nombre_opci IS NULL OR nombre_opci ILIKE '%' || p_nombre_opci || '%')
    AND (p_ruta_opci IS NULL OR ruta_opci ILIKE '%' || p_ruta_opci || '%')
    AND (p_activo_opci IS NULL OR activo_opci = p_activo_opci)
    ORDER BY nombre_opci;
    
    p_response := '{"success": true, "message": "Filtrado de opciones completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- CLIENTE
-- Insertar
CREATE OR REPLACE FUNCTION insertar_cliente(
    p_cedula_clie IN cliente.cedula_clie%TYPE,
    p_fecha_nacimiento_clie IN cliente.fecha_nacimiento_clie%TYPE,
    p_edad_clie IN cliente.edad_clie%TYPE,
    p_telefono_clie IN cliente.telefono_clie%TYPE,
	p_primer_nombre_clie IN cliente.primer_nombre_clie%TYPE,
	p_apellido_paterno_clie IN cliente.apellido_paterno_clie%TYPE,
    p_segundo_nombre_clie IN cliente.segundo_nombre_clie%TYPE DEFAULT NULL,
    p_apellido_materno_clie IN cliente.apellido_materno_clie%TYPE DEFAULT NULL,
    p_email_clie IN cliente.email_clie%TYPE DEFAULT 'Ninguno',
    p_es_socio IN cliente.es_socio%TYPE DEFAULT 'no',
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE DEFAULT 'no',
    p_usua_ingre IN cliente.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO cliente(
        cedula_clie, primer_nombre_clie, segundo_nombre_clie, 
        apellido_paterno_clie, apellido_materno_clie, fecha_nacimiento_clie,
        edad_clie, telefono_clie, email_clie, es_socio, es_tercera_edad, usua_ingre
    ) VALUES (
        p_cedula_clie, p_primer_nombre_clie, p_segundo_nombre_clie,
        p_apellido_paterno_clie, p_apellido_materno_clie, p_fecha_nacimiento_clie,
        p_edad_clie, p_telefono_clie, p_email_clie, p_es_socio, p_es_tercera_edad, p_usua_ingre
    ) RETURNING ide_clie INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_cliente(
    p_ide_clie IN cliente.ide_clie%TYPE,
    p_cedula_clie IN cliente.cedula_clie%TYPE,
    p_fecha_nacimiento_clie IN cliente.fecha_nacimiento_clie%TYPE,
    p_edad_clie IN cliente.edad_clie%TYPE,
    p_telefono_clie IN cliente.telefono_clie%TYPE,
    p_email_clie IN cliente.email_clie%TYPE,
    p_es_socio IN cliente.es_socio%TYPE,
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE,
	p_primer_nombre_clie IN cliente.primer_nombre_clie%TYPE,
    p_apellido_paterno_clie IN cliente.apellido_paterno_clie%TYPE,
	p_segundo_nombre_clie IN cliente.segundo_nombre_clie%TYPE DEFAULT NULL,
    p_apellido_materno_clie IN cliente.apellido_materno_clie%TYPE DEFAULT NULL,
    p_usua_actua IN cliente.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_clie = p_ide_clie;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_cliente(
    p_ide_clie IN cliente.ide_clie%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM cliente WHERE ide_clie = p_ide_clie;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cliente eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_cliente(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM cliente ORDER BY apellido_paterno_clie, primer_nombre_clie;
    p_response := '{"success": true, "message": "Listado de clientes obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_cliente(
    p_ide_clie IN cliente.ide_clie%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM cliente WHERE ide_clie = p_ide_clie;
    p_response := '{"success": true, "message": "Cliente encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_cliente(
    p_cedula_clie IN cliente.cedula_clie%TYPE DEFAULT NULL,
    p_primer_nombre_clie IN cliente.primer_nombre_clie%TYPE DEFAULT NULL,
    p_apellido_paterno_clie IN cliente.apellido_paterno_clie%TYPE DEFAULT NULL,
    p_es_socio IN cliente.es_socio%TYPE DEFAULT NULL,
    p_es_tercera_edad IN cliente.es_tercera_edad%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM cliente
    WHERE (p_cedula_clie IS NULL OR cedula_clie = p_cedula_clie)
    AND (p_primer_nombre_clie IS NULL OR primer_nombre_clie ILIKE '%' || p_primer_nombre_clie || '%')
    AND (p_apellido_paterno_clie IS NULL OR apellido_paterno_clie ILIKE '%' || p_apellido_paterno_clie || '%')
    AND (p_es_socio IS NULL OR es_socio = p_es_socio)
    AND (p_es_tercera_edad IS NULL OR es_tercera_edad = p_es_tercera_edad)
    ORDER BY apellido_paterno_clie, primer_nombre_clie;
    
    p_response := '{"success": true, "message": "Filtrado de clientes completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- PROVEEDOR
-- Insertar
CREATE OR REPLACE FUNCTION insertar_proveedor(
    p_ide_empr IN proveedor.ide_empr%TYPE,
    p_cedula_prov IN proveedor.cedula_prov%TYPE,
    p_fecha_nacimiento_prov IN proveedor.fecha_nacimiento_prov%TYPE,
    p_edad_prov IN proveedor.edad_prov%TYPE,
    p_telefono_prov IN proveedor.telefono_prov%TYPE,
    p_email_prov IN proveedor.email_prov%TYPE,
	p_primer_nombre_prov IN proveedor.primer_nombre_prov%TYPE,
    p_apellido_paterno_prov IN proveedor.apellido_paterno_prov%TYPE,
	p_segundo_nombre_prov IN proveedor.segundo_nombre_prov%TYPE DEFAULT NULL,
    p_apellido_materno_prov IN proveedor.apellido_materno_prov%TYPE DEFAULT NULL,
    p_usua_ingre IN proveedor.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO proveedor(
        ide_empr, cedula_prov, primer_nombre_prov, segundo_nombre_prov,
        apellido_paterno_prov, apellido_materno_prov, fecha_nacimiento_prov,
        edad_prov, telefono_prov, email_prov, usua_ingre
    ) VALUES (
        p_ide_empr, p_cedula_prov, p_primer_nombre_prov, p_segundo_nombre_prov,
        p_apellido_paterno_prov, p_apellido_materno_prov, p_fecha_nacimiento_prov,
        p_edad_prov, p_telefono_prov, p_email_prov, p_usua_ingre
    ) RETURNING ide_prov INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_proveedor(
    p_ide_prov IN proveedor.ide_prov%TYPE,
    p_ide_empr IN proveedor.ide_empr%TYPE,
    p_cedula_prov IN proveedor.cedula_prov%TYPE,
    p_fecha_nacimiento_prov IN proveedor.fecha_nacimiento_prov%TYPE,
    p_edad_prov IN proveedor.edad_prov%TYPE,
    p_telefono_prov IN proveedor.telefono_prov%TYPE,
    p_email_prov IN proveedor.email_prov%TYPE,
	p_primer_nombre_prov IN proveedor.primer_nombre_prov%TYPE,
    p_apellido_paterno_prov IN proveedor.apellido_paterno_prov%TYPE,
	p_segundo_nombre_prov IN proveedor.segundo_nombre_prov%TYPE DEFAULT NULL,
    p_apellido_materno_prov IN proveedor.apellido_materno_prov%TYPE DEFAULT NULL,
    p_usua_actua IN proveedor.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_prov = p_ide_prov;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_proveedor(
    p_ide_prov IN proveedor.ide_prov%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM proveedor WHERE ide_prov = p_ide_prov;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Proveedor eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_proveedor(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM proveedor ORDER BY apellido_paterno_prov, primer_nombre_prov;
    p_response := '{"success": true, "message": "Listado de proveedores obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_proveedor(
    p_ide_prov IN proveedor.ide_prov%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM proveedor WHERE ide_prov = p_ide_prov;
    p_response := '{"success": true, "message": "Proveedor encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_proveedor(
    p_ide_empr IN proveedor.ide_empr%TYPE DEFAULT NULL,
    p_cedula_prov IN proveedor.cedula_prov%TYPE DEFAULT NULL,
    p_primer_nombre_prov IN proveedor.primer_nombre_prov%TYPE DEFAULT NULL,
    p_apellido_paterno_prov IN proveedor.apellido_paterno_prov%TYPE DEFAULT NULL,
    p_email_prov IN proveedor.email_prov%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM proveedor
    WHERE (p_ide_empr IS NULL OR ide_empr = p_ide_empr)
    AND (p_cedula_prov IS NULL OR cedula_prov = p_cedula_prov)
    AND (p_primer_nombre_prov IS NULL OR primer_nombre_prov ILIKE '%' || p_primer_nombre_prov || '%')
    AND (p_apellido_paterno_prov IS NULL OR apellido_paterno_prov ILIKE '%' || p_apellido_paterno_prov || '%')
    AND (p_email_prov IS NULL OR email_prov ILIKE '%' || p_email_prov || '%')
    ORDER BY apellido_paterno_prov, primer_nombre_prov;
    
    p_response := '{"success": true, "message": "Filtrado de proveedores completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- EMPLEADO
-- Insertar
CREATE OR REPLACE FUNCTION insertar_empleado(
    p_ide_rol IN empleado.ide_rol%TYPE,
    p_cedula_empl IN empleado.cedula_empl%TYPE,
    p_fecha_nacimiento_empl IN empleado.fecha_nacimiento_empl%TYPE,
    p_edad_empl IN empleado.edad_empl%TYPE,
    p_fecha_inicio_empl IN empleado.fecha_inicio_empl%TYPE,
    p_rmu_empl IN empleado.rmu_empl%TYPE,
	p_primer_nombre_empl IN empleado.primer_nombre_empl%TYPE,
    p_apellido_paterno_empl IN empleado.apellido_paterno_empl%TYPE,
	p_segundo_nombre_empl IN empleado.segundo_nombre_empl%TYPE DEFAULT NULL,
    p_apellido_materno_empl IN empleado.apellido_materno_empl%TYPE DEFAULT NULL,
    p_fecha_termino_empl IN empleado.fecha_termino_empl%TYPE DEFAULT NULL,
    p_titulo_empl IN empleado.titulo_empl%TYPE DEFAULT 'libre',
    p_usua_ingre IN empleado.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO empleado(
        ide_rol, cedula_empl, primer_nombre_empl, segundo_nombre_empl,
        apellido_paterno_empl, apellido_materno_empl, fecha_nacimiento_empl,
        edad_empl, fecha_inicio_empl, rmu_empl, fecha_termino_empl, titulo_empl, usua_ingre
    ) VALUES (
        p_ide_rol, p_cedula_empl, p_primer_nombre_empl, p_segundo_nombre_empl,
        p_apellido_paterno_empl, p_apellido_materno_empl, p_fecha_nacimiento_empl,
        p_edad_empl, p_fecha_inicio_empl, p_rmu_empl, p_fecha_termino_empl, p_titulo_empl, p_usua_ingre
    ) RETURNING ide_empl INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_empleado(
    p_ide_empl IN empleado.ide_empl%TYPE,
    p_ide_rol IN empleado.ide_rol%TYPE,
    p_cedula_empl IN empleado.cedula_empl%TYPE,
    p_fecha_nacimiento_empl IN empleado.fecha_nacimiento_empl%TYPE,
    p_edad_empl IN empleado.edad_empl%TYPE,
    p_fecha_inicio_empl IN empleado.fecha_inicio_empl%TYPE,
    p_rmu_empl IN empleado.rmu_empl%TYPE,
	p_primer_nombre_empl IN empleado.primer_nombre_empl%TYPE,
    p_apellido_paterno_empl IN empleado.apellido_paterno_empl%TYPE,
	p_titulo_empl IN empleado.titulo_empl%TYPE,
	p_segundo_nombre_empl IN empleado.segundo_nombre_empl%TYPE DEFAULT NULL,
    p_apellido_materno_empl IN empleado.apellido_materno_empl%TYPE DEFAULT NULL,
    p_fecha_termino_empl IN empleado.fecha_termino_empl%TYPE DEFAULT NULL,
    p_usua_actua IN empleado.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
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
        titulo_empl = p_titulo_empl,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_empl = p_ide_empl;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_empleado(
    p_ide_empl IN empleado.ide_empl%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM empleado WHERE ide_empl = p_ide_empl;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Empleado eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_empleado(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empleado ORDER BY apellido_paterno_empl, primer_nombre_empl;
    p_response := '{"success": true, "message": "Listado de empleados obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_empleado(
    p_ide_empl IN empleado.ide_empl%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empleado WHERE ide_empl = p_ide_empl;
    p_response := '{"success": true, "message": "Empleado encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_empleado(
    p_ide_rol IN empleado.ide_rol%TYPE DEFAULT NULL,
    p_cedula_empl IN empleado.cedula_empl%TYPE DEFAULT NULL,
    p_primer_nombre_empl IN empleado.primer_nombre_empl%TYPE DEFAULT NULL,
    p_apellido_paterno_empl IN empleado.apellido_paterno_empl%TYPE DEFAULT NULL,
    p_titulo_empl IN empleado.titulo_empl%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM empleado
    WHERE (p_ide_rol IS NULL OR ide_rol = p_ide_rol)
    AND (p_cedula_empl IS NULL OR cedula_empl = p_cedula_empl)
    AND (p_primer_nombre_empl IS NULL OR primer_nombre_empl ILIKE '%' || p_primer_nombre_empl || '%')
    AND (p_apellido_paterno_empl IS NULL OR apellido_paterno_empl ILIKE '%' || p_apellido_paterno_empl || '%')
    AND (p_titulo_empl IS NULL OR titulo_empl ILIKE '%' || p_titulo_empl || '%')
    ORDER BY apellido_paterno_empl, primer_nombre_empl;
    
    p_response := '{"success": true, "message": "Filtrado de empleados completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;


-- PRODUCTO
-- Insertar
CREATE OR REPLACE FUNCTION insertar_producto(
    p_ide_cate IN producto.ide_cate%TYPE,
    p_ide_marc IN producto.ide_marc%TYPE,
    p_codigo_barra_prod IN producto.codigo_barra_prod%TYPE,
    p_nombre_prod IN producto.nombre_prod%TYPE,
    p_precio_compra_prod IN producto.precio_compra_prod%TYPE DEFAULT 0,
    p_precio_venta_prod IN producto.precio_venta_prod%TYPE DEFAULT 0,
    p_iva_prod IN producto.iva_prod%TYPE DEFAULT 0,
    p_dcto_caduc_prod IN producto.dcto_caduc_prod%TYPE DEFAULT 0,
    p_stock_prod IN producto.stock_prod%TYPE DEFAULT 0,
    p_dcto_promo_prod IN producto.dcto_promo_prod%TYPE DEFAULT 0,
    p_disponible_prod IN producto.disponible_prod%TYPE DEFAULT 'no',
    p_estado_prod IN producto.estado_prod%TYPE DEFAULT 'inactivo',
    p_descripcion_prod IN producto.descripcion_prod%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN producto.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO producto(
        ide_cate, ide_marc, codigo_barra_prod, nombre_prod, precio_compra_prod,
        precio_venta_prod, iva_prod, dcto_caduc_prod, stock_prod, dcto_promo_prod,
        disponible_prod, estado_prod, descripcion_prod, usua_ingre
    ) VALUES (
        p_ide_cate, p_ide_marc, p_codigo_barra_prod, p_nombre_prod, p_precio_compra_prod,
        p_precio_venta_prod, p_iva_prod, p_dcto_caduc_prod, p_stock_prod, p_dcto_promo_prod,
        p_disponible_prod, p_estado_prod, p_descripcion_prod, p_usua_ingre
    ) RETURNING ide_prod INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_producto(
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
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_prod = p_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_producto(
    p_ide_prod IN producto.ide_prod%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM producto WHERE ide_prod = p_ide_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Producto eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_producto(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM producto ORDER BY nombre_prod;
    p_response := '{"success": true, "message": "Listado de productos obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_producto(
    p_ide_prod IN producto.ide_prod%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM producto WHERE ide_prod = p_ide_prod;
    p_response := '{"success": true, "message": "Producto encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_producto(
    p_ide_cate IN producto.ide_cate%TYPE DEFAULT NULL,
    p_ide_marc IN producto.ide_marc%TYPE DEFAULT NULL,
    p_nombre_prod IN producto.nombre_prod%TYPE DEFAULT NULL,
    p_codigo_barra_prod IN producto.codigo_barra_prod%TYPE DEFAULT NULL,
    p_estado_prod IN producto.estado_prod%TYPE DEFAULT NULL,
    p_disponible_prod IN producto.disponible_prod%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM producto
    WHERE (p_ide_cate IS NULL OR ide_cate = p_ide_cate)
    AND (p_ide_marc IS NULL OR ide_marc = p_ide_marc)
    AND (p_nombre_prod IS NULL OR nombre_prod ILIKE '%' || p_nombre_prod || '%')
    AND (p_codigo_barra_prod IS NULL OR codigo_barra_prod = p_codigo_barra_prod)
    AND (p_estado_prod IS NULL OR estado_prod = p_estado_prod)
    AND (p_disponible_prod IS NULL OR disponible_prod = p_disponible_prod)
    ORDER BY nombre_prod;
    
    p_response := '{"success": true, "message": "Filtrado de productos completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;


-- PERFIL
-- Insertar
CREATE OR REPLACE FUNCTION insertar_perfil(
    p_ide_rol IN perfil.ide_rol%TYPE,
    p_nombre_perf IN perfil.nombre_perf%TYPE,
    p_descripcion_perf IN perfil.descripcion_perf%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN perfil.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO perfil(ide_rol, nombre_perf, descripcion_perf, usua_ingre)
    VALUES (p_ide_rol, p_nombre_perf, p_descripcion_perf, p_usua_ingre)
    RETURNING ide_perf INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_perfil(
    p_ide_perf IN perfil.ide_perf%TYPE,
    p_ide_rol IN perfil.ide_rol%TYPE,
    p_nombre_perf IN perfil.nombre_perf%TYPE,
    p_descripcion_perf IN perfil.descripcion_perf%TYPE,
    p_usua_actua IN perfil.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE perfil SET
        ide_rol = p_ide_rol,
        nombre_perf = p_nombre_perf,
        descripcion_perf = p_descripcion_perf,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_perf = p_ide_perf;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_perfil(
    p_ide_perf IN perfil.ide_perf%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM perfil WHERE ide_perf = p_ide_perf;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Perfil eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_perfil(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM perfil ORDER BY nombre_perf;
    p_response := '{"success": true, "message": "Listado de perfiles obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_perfil(
    p_ide_perf IN perfil.ide_perf%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM perfil WHERE ide_perf = p_ide_perf;
    p_response := '{"success": true, "message": "Perfil encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_perfil(
    p_ide_rol IN perfil.ide_rol%TYPE DEFAULT NULL,
    p_nombre_perf IN perfil.nombre_perf%TYPE DEFAULT NULL,
    p_descripcion_perf IN perfil.descripcion_perf%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM perfil
    WHERE (p_ide_rol IS NULL OR ide_rol = p_ide_rol)
    AND (p_nombre_perf IS NULL OR nombre_perf ILIKE '%' || p_nombre_perf || '%')
    AND (p_descripcion_perf IS NULL OR descripcion_perf ILIKE '%' || p_descripcion_perf || '%')
    ORDER BY nombre_perf;
    
    p_response := '{"success": true, "message": "Filtrado de perfiles completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;


-- PEDIDO
-- Insertar
CREATE OR REPLACE FUNCTION insertar_pedido(
    p_ide_empr IN pedido.ide_empr%TYPE,
    p_fecha_pedi IN pedido.fecha_pedi%TYPE,
    p_fecha_entr_pedi IN pedido.fecha_entr_pedi%TYPE,
    p_cantidad_total_pedi IN pedido.cantidad_total_pedi%TYPE,
    p_total_pedi IN pedido.total_pedi%TYPE,
    p_estado_pedi IN pedido.estado_pedi%TYPE DEFAULT 'progreso',
    p_motivo_pedi IN pedido.motivo_pedi%TYPE DEFAULT 'peticion',
    p_observacion_pedi IN pedido.observacion_pedi%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN pedido.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO pedido(
        ide_empr, fecha_pedi, fecha_entr_pedi, cantidad_total_pedi, total_pedi,
        estado_pedi, motivo_pedi, observacion_pedi, usua_ingre
    ) VALUES (
        p_ide_empr, p_fecha_pedi, p_fecha_entr_pedi, p_cantidad_total_pedi, p_total_pedi,
        p_estado_pedi, p_motivo_pedi, p_observacion_pedi, p_usua_ingre
    ) RETURNING ide_pedi INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_pedido(
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
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_pedi = p_ide_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_pedido(
    p_ide_pedi IN pedido.ide_pedi%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM pedido WHERE ide_pedi = p_ide_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Pedido eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_pedido(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM pedido ORDER BY fecha_pedi DESC;
    p_response := '{"success": true, "message": "Listado de pedidos obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_pedido(
    p_ide_pedi IN pedido.ide_pedi%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM pedido WHERE ide_pedi = p_ide_pedi;
    p_response := '{"success": true, "message": "Pedido encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_pedido(
    p_ide_empr IN pedido.ide_empr%TYPE DEFAULT NULL,
    p_estado_pedi IN pedido.estado_pedi%TYPE DEFAULT NULL,
    p_motivo_pedi IN pedido.motivo_pedi%TYPE DEFAULT NULL,
    p_fecha_desde IN TIMESTAMP DEFAULT NULL,
    p_fecha_hasta IN TIMESTAMP DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM pedido
    WHERE (p_ide_empr IS NULL OR ide_empr = p_ide_empr)
    AND (p_estado_pedi IS NULL OR estado_pedi = p_estado_pedi)
    AND (p_motivo_pedi IS NULL OR motivo_pedi = p_motivo_pedi)
    AND (p_fecha_desde IS NULL OR fecha_pedi >= p_fecha_desde)
    AND (p_fecha_hasta IS NULL OR fecha_pedi <= p_fecha_hasta)
    ORDER BY fecha_pedi DESC;
    
    p_response := '{"success": true, "message": "Filtrado de pedidos completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;



-- CUENTA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_cuenta(
    p_ide_empl IN cuenta.ide_empl%TYPE,
    p_ide_perf IN cuenta.ide_perf%TYPE,
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE,
    p_password_cuen IN cuenta.password_cuen%TYPE,
    p_estado_cuen IN cuenta.estado_cuen%TYPE DEFAULT 'inactivo',
    p_usua_ingre IN cuenta.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO cuenta(ide_empl, ide_perf, usuario_cuen, password_cuen, estado_cuen, usua_ingre)
    VALUES (p_ide_empl, p_ide_perf, p_usuario_cuen, p_password_cuen, p_estado_cuen, p_usua_ingre)
    RETURNING ide_cuen INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_cuenta(
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    p_ide_empl IN cuenta.ide_empl%TYPE,
    p_ide_perf IN cuenta.ide_perf%TYPE,
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE,
    p_password_cuen IN cuenta.password_cuen%TYPE,
    p_estado_cuen IN cuenta.estado_cuen%TYPE,
    p_usua_actua IN cuenta.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE cuenta SET
        ide_empl = p_ide_empl,
        ide_perf = p_ide_perf,
        usuario_cuen = p_usuario_cuen,
        password_cuen = p_password_cuen,
        estado_cuen = p_estado_cuen,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_cuen = p_ide_cuen;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_cuenta(
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM cuenta WHERE ide_cuen = p_ide_cuen;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Cuenta eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_cuenta(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM cuenta ORDER BY usuario_cuen;
    p_response := '{"success": true, "message": "Listado de cuentas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_cuenta(
    p_ide_cuen IN cuenta.ide_cuen%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM cuenta WHERE ide_cuen = p_ide_cuen;
    p_response := '{"success": true, "message": "Cuenta encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_cuenta(
    p_ide_empl IN cuenta.ide_empl%TYPE DEFAULT NULL,
    p_ide_perf IN cuenta.ide_perf%TYPE DEFAULT NULL,
    p_usuario_cuen IN cuenta.usuario_cuen%TYPE DEFAULT NULL,
    p_estado_cuen IN cuenta.estado_cuen%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM cuenta
    WHERE (p_ide_empl IS NULL OR ide_empl = p_ide_empl)
    AND (p_ide_perf IS NULL OR ide_perf = p_ide_perf)
    AND (p_usuario_cuen IS NULL OR usuario_cuen ILIKE '%' || p_usuario_cuen || '%')
    AND (p_estado_cuen IS NULL OR estado_cuen = p_estado_cuen)
    ORDER BY usuario_cuen;
    
    p_response := '{"success": true, "message": "Filtrado de cuentas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- ENTREGA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_entrega(
    p_ide_prov IN entrega.ide_prov%TYPE,
    p_ide_pedi IN entrega.ide_pedi%TYPE,
    p_fecha_entr IN entrega.fecha_entr%TYPE,
    p_cantidad_total_entr IN entrega.cantidad_total_entr%TYPE,
    p_total_entr IN entrega.total_entr%TYPE,
    p_estado_entr IN entrega.estado_entr%TYPE,
    p_observacion_entr IN entrega.observacion_entr%TYPE DEFAULT 'Ninguna',
    p_usua_ingre IN entrega.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO entrega(
        ide_prov, ide_pedi, fecha_entr, cantidad_total_entr, total_entr,
        estado_entr, observacion_entr, usua_ingre
    ) VALUES (
        p_ide_prov, p_ide_pedi, p_fecha_entr, p_cantidad_total_entr, p_total_entr,
        p_estado_entr, p_observacion_entr, p_usua_ingre
    ) RETURNING ide_entr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_entrega(
    p_ide_entr IN entrega.ide_entr%TYPE,
    p_ide_prov IN entrega.ide_prov%TYPE,
    p_ide_pedi IN entrega.ide_pedi%TYPE,
    p_fecha_entr IN entrega.fecha_entr%TYPE,
    p_cantidad_total_entr IN entrega.cantidad_total_entr%TYPE,
    p_total_entr IN entrega.total_entr%TYPE,
    p_estado_entr IN entrega.estado_entr%TYPE,
    p_observacion_entr IN entrega.observacion_entr%TYPE,
    p_usua_actua IN entrega.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_entr = p_ide_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_entrega(
    p_ide_entr IN entrega.ide_entr%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM entrega WHERE ide_entr = p_ide_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Entrega eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_entrega(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM entrega ORDER BY fecha_entr DESC;
    p_response := '{"success": true, "message": "Listado de entregas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_entrega(
    p_ide_entr IN entrega.ide_entr%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM entrega WHERE ide_entr = p_ide_entr;
    p_response := '{"success": true, "message": "Entrega encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_entrega(
    p_ide_prov IN entrega.ide_prov%TYPE DEFAULT NULL,
    p_ide_pedi IN entrega.ide_pedi%TYPE DEFAULT NULL,
    p_estado_entr IN entrega.estado_entr%TYPE DEFAULT NULL,
    p_fecha_desde IN TIMESTAMP DEFAULT NULL,
    p_fecha_hasta IN TIMESTAMP DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM entrega
    WHERE (p_ide_prov IS NULL OR ide_prov = p_ide_prov)
    AND (p_ide_pedi IS NULL OR ide_pedi = p_ide_pedi)
    AND (p_estado_entr IS NULL OR estado_entr = p_estado_entr)
    AND (p_fecha_desde IS NULL OR fecha_entr >= p_fecha_desde)
    AND (p_fecha_hasta IS NULL OR fecha_entr <= p_fecha_hasta)
    ORDER BY fecha_entr DESC;
    
    p_response := '{"success": true, "message": "Filtrado de entregas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;



-- VENTA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_venta(
    p_ide_clie IN venta.ide_clie%TYPE,
    p_ide_empl IN venta.ide_empl%TYPE,
    p_num_factura_vent IN venta.num_factura_vent%TYPE,
    p_fecha_vent IN venta.fecha_vent%TYPE,
    p_sub_total_vent IN venta.sub_total_vent%TYPE,
    p_total_vent IN venta.total_vent%TYPE,
	p_dcto_vent IN venta.dcto_vent%TYPE DEFAULT 0,
    p_estado_vent IN venta.estado_vent%TYPE DEFAULT 'completo',
    p_usua_ingre IN venta.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO venta(
        ide_clie, ide_empl, num_factura_vent, fecha_vent, sub_total_vent,
        dcto_vent, total_vent, estado_vent, usua_ingre
    ) VALUES (
        p_ide_clie, p_ide_empl, p_num_factura_vent, p_fecha_vent, p_sub_total_vent,
        p_dcto_vent, p_total_vent, p_estado_vent, p_usua_ingre
    ) RETURNING ide_vent INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta registrada correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_venta(
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
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
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
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_vent = p_ide_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta actualizada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_venta(
    p_ide_vent IN venta.ide_vent%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM venta WHERE ide_vent = p_ide_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Venta eliminada correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_venta(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM venta ORDER BY fecha_vent DESC;
    p_response := '{"success": true, "message": "Listado de ventas obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_venta(
    p_ide_vent IN venta.ide_vent%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM venta WHERE ide_vent = p_ide_vent;
    p_response := '{"success": true, "message": "Venta encontrada"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_venta(
    p_ide_clie IN venta.ide_clie%TYPE DEFAULT NULL,
    p_ide_empl IN venta.ide_empl%TYPE DEFAULT NULL,
    p_num_factura_vent IN venta.num_factura_vent%TYPE DEFAULT NULL,
    p_estado_vent IN venta.estado_vent%TYPE DEFAULT NULL,
    p_fecha_desde IN TIMESTAMP DEFAULT NULL,
    p_fecha_hasta IN TIMESTAMP DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM venta
    WHERE (p_ide_clie IS NULL OR ide_clie = p_ide_clie)
    AND (p_ide_empl IS NULL OR ide_empl = p_ide_empl)
    AND (p_num_factura_vent IS NULL OR num_factura_vent ILIKE '%' || p_num_factura_vent || '%')
    AND (p_estado_vent IS NULL OR estado_vent = p_estado_vent)
    AND (p_fecha_desde IS NULL OR fecha_vent >= p_fecha_desde)
    AND (p_fecha_hasta IS NULL OR fecha_vent <= p_fecha_hasta)
    ORDER BY fecha_vent DESC;
    
    p_response := '{"success": true, "message": "Filtrado de ventas completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;



-- LOTE
-- Insertar
CREATE OR REPLACE FUNCTION insertar_lote(
    p_ide_prod IN lote.ide_prod%TYPE,
    p_fecha_caducidad_lote IN lote.fecha_caducidad_lote%TYPE,
    p_stock_lote IN lote.stock_lote%TYPE,
    p_estado_lote IN lote.estado_lote%TYPE DEFAULT 'correcto',
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO lote(ide_prod, fecha_caducidad_lote, stock_lote, estado_lote)
    VALUES (p_ide_prod, p_fecha_caducidad_lote, p_stock_lote, p_estado_lote)
    RETURNING ide_lote INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_lote(
    p_ide_lote IN lote.ide_lote%TYPE,
    p_ide_prod IN lote.ide_prod%TYPE,
    p_fecha_caducidad_lote IN lote.fecha_caducidad_lote%TYPE,
    p_stock_lote IN lote.stock_lote%TYPE,
    p_estado_lote IN lote.estado_lote%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE lote SET
        ide_prod = p_ide_prod,
        fecha_caducidad_lote = p_fecha_caducidad_lote,
        stock_lote = p_stock_lote,
        estado_lote = p_estado_lote
    WHERE ide_lote = p_ide_lote;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_lote(
    p_ide_lote IN lote.ide_lote%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM lote WHERE ide_lote = p_ide_lote;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Lote eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_lote(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM lote ORDER BY fecha_caducidad_lote;
    p_response := '{"success": true, "message": "Listado de lotes obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_lote(
    p_ide_lote IN lote.ide_lote%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM lote WHERE ide_lote = p_ide_lote;
    p_response := '{"success": true, "message": "Lote encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_lote(
    p_ide_prod IN lote.ide_prod%TYPE DEFAULT NULL,
    p_estado_lote IN lote.estado_lote%TYPE DEFAULT NULL,
    p_fecha_caducidad_desde IN DATE DEFAULT NULL,
    p_fecha_caducidad_hasta IN DATE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM lote
    WHERE (p_ide_prod IS NULL OR ide_prod = p_ide_prod)
    AND (p_estado_lote IS NULL OR estado_lote = p_estado_lote)
    AND (p_fecha_caducidad_desde IS NULL OR fecha_caducidad_lote >= p_fecha_caducidad_desde)
    AND (p_fecha_caducidad_hasta IS NULL OR fecha_caducidad_lote <= p_fecha_caducidad_hasta)
    ORDER BY fecha_caducidad_lote;
    
    p_response := '{"success": true, "message": "Filtrado de lotes completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- EMPRESA_PRECIOS
-- Insertar
CREATE OR REPLACE FUNCTION insertar_empresa_precios(
    p_ide_empr IN empresa_precios.ide_empr%TYPE,
    p_ide_prod IN empresa_precios.ide_prod%TYPE,
    p_precio_compra_prod IN empresa_precios.precio_compra_prod%TYPE DEFAULT 0,
    p_dcto_compra_prod IN empresa_precios.dcto_compra_prod%TYPE DEFAULT 0,
    p_iva_prod IN empresa_precios.iva_prod%TYPE DEFAULT 0,
    p_dcto_caducidad_prod IN empresa_precios.dcto_caducidad_prod%TYPE DEFAULT 0,
    p_usua_ingre IN empresa_precios.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO empresa_precios(
        ide_empr, ide_prod, precio_compra_prod, dcto_compra_prod, 
        iva_prod, dcto_caducidad_prod, usua_ingre
    ) VALUES (
        p_ide_empr, p_ide_prod, p_precio_compra_prod, p_dcto_compra_prod,
        p_iva_prod, p_dcto_caducidad_prod, p_usua_ingre
    ) RETURNING ide_empr_prod INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_empresa_precios(
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    p_ide_empr IN empresa_precios.ide_empr%TYPE,
    p_ide_prod IN empresa_precios.ide_prod%TYPE,
    p_precio_compra_prod IN empresa_precios.precio_compra_prod%TYPE,
    p_dcto_compra_prod IN empresa_precios.dcto_compra_prod%TYPE,
    p_iva_prod IN empresa_precios.iva_prod%TYPE,
    p_dcto_caducidad_prod IN empresa_precios.dcto_caducidad_prod%TYPE,
    p_usua_actua IN empresa_precios.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE empresa_precios SET
        ide_empr = p_ide_empr,
        ide_prod = p_ide_prod,
        precio_compra_prod = p_precio_compra_prod,
        dcto_compra_prod = p_dcto_compra_prod,
        iva_prod = p_iva_prod,
        dcto_caducidad_prod = p_dcto_caducidad_prod,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_empr_prod = p_ide_empr_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_empresa_precios(
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM empresa_precios WHERE ide_empr_prod = p_ide_empr_prod;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Precio de empresa eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_empresa_precios(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empresa_precios ORDER BY ide_empr, ide_prod;
    p_response := '{"success": true, "message": "Listado de precios de empresa obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_empresa_precios(
    p_ide_empr_prod IN empresa_precios.ide_empr_prod%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM empresa_precios WHERE ide_empr_prod = p_ide_empr_prod;
    p_response := '{"success": true, "message": "Precio de empresa encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_empresa_precios(
    p_ide_empr IN empresa_precios.ide_empr%TYPE DEFAULT NULL,
    p_ide_prod IN empresa_precios.ide_prod%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM empresa_precios
    WHERE (p_ide_empr IS NULL OR ide_empr = p_ide_empr)
    AND (p_ide_prod IS NULL OR ide_prod = p_ide_prod)
    ORDER BY ide_empr, ide_prod;
    
    p_response := '{"success": true, "message": "Filtrado de precios de empresa completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;



-- PERFIL_OPCIONES
-- Insertar
CREATE OR REPLACE FUNCTION insertar_perfil_opciones(
    p_ide_perf IN perfil_opciones.ide_perf%TYPE,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE,
    p_listar IN perfil_opciones.listar%TYPE DEFAULT 'no',
    p_insertar IN perfil_opciones.insertar%TYPE DEFAULT 'no',
    p_modificar IN perfil_opciones.modificar%TYPE DEFAULT 'no',
    p_eliminar IN perfil_opciones.eliminar%TYPE DEFAULT 'no',
    p_usua_ingre IN perfil_opciones.usua_ingre%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO perfil_opciones(
        ide_perf, ide_opci, listar, insertar, modificar, eliminar, usua_ingre
    ) VALUES (
        p_ide_perf, p_ide_opci, p_listar, p_insertar, p_modificar, p_eliminar, p_usua_ingre
    ) RETURNING ide_perf_opci INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_perfil_opciones(
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    p_ide_perf IN perfil_opciones.ide_perf%TYPE,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE,
    p_listar IN perfil_opciones.listar%TYPE,
    p_insertar IN perfil_opciones.insertar%TYPE,
    p_modificar IN perfil_opciones.modificar%TYPE,
    p_eliminar IN perfil_opciones.eliminar%TYPE,
    p_usua_actua IN perfil_opciones.usua_actua%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE perfil_opciones SET
        ide_perf = p_ide_perf,
        ide_opci = p_ide_opci,
        listar = p_listar,
        insertar = p_insertar,
        modificar = p_modificar,
        eliminar = p_eliminar,
        usua_actua = p_usua_actua,
        fecha_actua = CURRENT_TIMESTAMP
    WHERE ide_perf_opci = p_ide_perf_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_perfil_opciones(
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM perfil_opciones WHERE ide_perf_opci = p_ide_perf_opci;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Permiso de perfil eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_perfil_opciones(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM perfil_opciones ORDER BY ide_perf, ide_opci;
    p_response := '{"success": true, "message": "Listado de permisos de perfil obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_perfil_opciones(
    p_ide_perf_opci IN perfil_opciones.ide_perf_opci%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM perfil_opciones WHERE ide_perf_opci = p_ide_perf_opci;
    p_response := '{"success": true, "message": "Permiso de perfil encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_perfil_opciones(
    p_ide_perf IN perfil_opciones.ide_perf%TYPE DEFAULT NULL,
    p_ide_opci IN perfil_opciones.ide_opci%TYPE DEFAULT NULL,
    p_listar IN perfil_opciones.listar%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM perfil_opciones
    WHERE (p_ide_perf IS NULL OR ide_perf = p_ide_perf)
    AND (p_ide_opci IS NULL OR ide_opci = p_ide_opci)
    AND (p_listar IS NULL OR listar = p_listar)
    ORDER BY ide_perf, ide_opci;
    
    p_response := '{"success": true, "message": "Filtrado de permisos de perfil completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- ACCESO_USUARIO
-- Insertar
CREATE OR REPLACE FUNCTION insertar_acceso_usuario(
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE,
	p_ip_acce IN acceso_usuario.ip_acce%TYPE,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE,
    p_fecha_acce IN acceso_usuario.fecha_acce%TYPE DEFAULT CURRENT_TIMESTAMP,
    p_num_intentos_acce IN acceso_usuario.num_intentos_acce%TYPE DEFAULT 0,
    p_latitud_acce IN acceso_usuario.latitud_acce%TYPE DEFAULT NULL,
    p_longitud_acce IN acceso_usuario.longitud_acce%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO acceso_usuario(
        ide_cuen, fecha_acce, num_intentos_acce, ip_acce, navegador_acce, 
        latitud_acce, longitud_acce
    ) VALUES (
        p_ide_cuen, p_fecha_acce, p_num_intentos_acce, p_ip_acce, p_navegador_acce,
        p_latitud_acce, p_longitud_acce
    ) RETURNING ide_acce INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Acceso de usuario registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_acceso_usuario(
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE,
    p_fecha_acce IN acceso_usuario.fecha_acce%TYPE,
    p_num_intentos_acce IN acceso_usuario.num_intentos_acce%TYPE,
    p_ip_acce IN acceso_usuario.ip_acce%TYPE,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE,
    p_latitud_acce IN acceso_usuario.latitud_acce%TYPE DEFAULT NULL,
    p_longitud_acce IN acceso_usuario.longitud_acce%TYPE DEFAULT NULL,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
    p_response := '{"success": true, "message": "Acceso de usuario actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_acceso_usuario(
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM acceso_usuario WHERE ide_acce = p_ide_acce;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Acceso de usuario eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_acceso_usuario(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM acceso_usuario ORDER BY fecha_acce DESC;
    p_response := '{"success": true, "message": "Listado de accesos de usuario obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_acceso_usuario(
    p_ide_acce IN acceso_usuario.ide_acce%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM acceso_usuario WHERE ide_acce = p_ide_acce;
    p_response := '{"success": true, "message": "Acceso de usuario encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar
CREATE OR REPLACE FUNCTION filtrar_acceso_usuario(
    p_ide_cuen IN acceso_usuario.ide_cuen%TYPE DEFAULT NULL,
    p_ip_acce IN acceso_usuario.ip_acce%TYPE DEFAULT NULL,
    p_navegador_acce IN acceso_usuario.navegador_acce%TYPE DEFAULT NULL,
    p_fecha_desde IN TIMESTAMP DEFAULT NULL,
    p_fecha_hasta IN TIMESTAMP DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM acceso_usuario
    WHERE (p_ide_cuen IS NULL OR ide_cuen = p_ide_cuen)
    AND (p_ip_acce IS NULL OR ip_acce = p_ip_acce)
    AND (p_navegador_acce IS NULL OR navegador_acce ILIKE '%' || p_navegador_acce || '%')
    AND (p_fecha_desde IS NULL OR fecha_acce >= p_fecha_desde)
    AND (p_fecha_hasta IS NULL OR fecha_acce <= p_fecha_hasta)
    ORDER BY fecha_acce DESC;
    
    p_response := '{"success": true, "message": "Filtrado de accesos de usuario completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- DETALLE_PEDIDO
-- Insertar
CREATE OR REPLACE FUNCTION insertar_detalle_pedido(
    p_ide_prod IN detalle_pedido.ide_prod%TYPE,
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE,
    p_cantidad_prod IN detalle_pedido.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_pedido.precio_unitario_prod%TYPE,
	p_subtotal_prod IN detalle_pedido.subtotal_prod%TYPE,
    p_dcto_prod IN detalle_pedido.dcto_prod%TYPE DEFAULT 0,
    p_iva_prod IN detalle_pedido.iva_prod%TYPE DEFAULT 0,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO detalle_pedido(
        ide_prod, ide_pedi, cantidad_prod, precio_unitario_prod, 
        dcto_prod, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_prod, p_ide_pedi, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_pedi INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de pedido registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_detalle_pedido(
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    p_ide_prod IN detalle_pedido.ide_prod%TYPE,
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE,
    p_cantidad_prod IN detalle_pedido.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_pedido.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_pedido.dcto_prod%TYPE,
    p_iva_prod IN detalle_pedido.iva_prod%TYPE,
    p_subtotal_prod IN detalle_pedido.subtotal_prod%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
    p_response := '{"success": true, "message": "Detalle de pedido actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_detalle_pedido(
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM detalle_pedido WHERE ide_deta_pedi = p_ide_deta_pedi;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de pedido eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_detalle_pedido(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_pedido ORDER BY ide_deta_pedi;
    p_response := '{"success": true, "message": "Listado de detalles de pedido obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_detalle_pedido(
    p_ide_deta_pedi IN detalle_pedido.ide_deta_pedi%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_pedido WHERE ide_deta_pedi = p_ide_deta_pedi;
    p_response := '{"success": true, "message": "Detalle de pedido encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar por pedido
CREATE OR REPLACE FUNCTION filtrar_detalle_pedido(
    p_ide_pedi IN detalle_pedido.ide_pedi%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_pedido.ide_prod%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM detalle_pedido
    WHERE (p_ide_pedi IS NULL OR ide_pedi = p_ide_pedi)
    AND (p_ide_prod IS NULL OR ide_prod = p_ide_prod)
    ORDER BY ide_deta_pedi;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de pedido completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- DETALLE_ENTREGA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_detalle_entrega(
    p_ide_entr IN detalle_entrega.ide_entr%TYPE,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE,
    p_cantidad_prod IN detalle_entrega.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_entrega.precio_unitario_prod%TYPE,
	p_subtotal_prod IN detalle_entrega.subtotal_prod%TYPE,
    p_dcto_prod IN detalle_entrega.dcto_prod%TYPE DEFAULT 0,
    p_iva_prod IN detalle_entrega.iva_prod%TYPE DEFAULT 0,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO detalle_entrega(
        ide_entr, ide_prod, cantidad_prod, precio_unitario_prod, 
        dcto_prod, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_entr, p_ide_prod, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_entr INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de entrega registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_detalle_entrega(
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    p_ide_entr IN detalle_entrega.ide_entr%TYPE,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE,
    p_cantidad_prod IN detalle_entrega.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_entrega.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_entrega.dcto_prod%TYPE,
    p_iva_prod IN detalle_entrega.iva_prod%TYPE,
    p_subtotal_prod IN detalle_entrega.subtotal_prod%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
    p_response := '{"success": true, "message": "Detalle de entrega actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_detalle_entrega(
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM detalle_entrega WHERE ide_deta_entr = p_ide_deta_entr;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de entrega eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_detalle_entrega(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_entrega ORDER BY ide_deta_entr;
    p_response := '{"success": true, "message": "Listado de detalles de entrega obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_detalle_entrega(
    p_ide_deta_entr IN detalle_entrega.ide_deta_entr%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_entrega WHERE ide_deta_entr = p_ide_deta_entr;
    p_response := '{"success": true, "message": "Detalle de entrega encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar por entrega
CREATE OR REPLACE FUNCTION filtrar_detalle_entrega(
    p_ide_entr IN detalle_entrega.ide_entr%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_entrega.ide_prod%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM detalle_entrega
    WHERE (p_ide_entr IS NULL OR ide_entr = p_ide_entr)
    AND (p_ide_prod IS NULL OR ide_prod = p_ide_prod)
    ORDER BY ide_deta_entr;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de entrega completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;


-- DETALLE_VENTA
-- Insertar
CREATE OR REPLACE FUNCTION insertar_detalle_venta(
    p_ide_vent IN detalle_venta.ide_vent%TYPE,
    p_ide_prod IN detalle_venta.ide_prod%TYPE,
    p_cantidad_prod IN detalle_venta.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_venta.precio_unitario_prod%TYPE,
	p_subtotal_prod IN detalle_venta.subtotal_prod%TYPE,
    p_dcto_prod IN detalle_venta.dcto_prod%TYPE DEFAULT 0,
    p_dcto_promo IN detalle_venta.dcto_promo%TYPE DEFAULT 0,
    p_iva_prod IN detalle_venta.iva_prod%TYPE DEFAULT 0,
    OUT p_result INTEGER,
    OUT p_id INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO detalle_venta(
        ide_vent, ide_prod, cantidad_prod, precio_unitario_prod, 
        dcto_prod, dcto_promo, iva_prod, subtotal_prod
    ) VALUES (
        p_ide_vent, p_ide_prod, p_cantidad_prod, p_precio_unitario_prod,
        p_dcto_prod, p_dcto_promo, p_iva_prod, p_subtotal_prod
    ) RETURNING ide_deta_vent INTO p_id;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de venta registrado correctamente", "id": ' || p_id || '}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_id := NULL;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Actualizar
CREATE OR REPLACE FUNCTION actualizar_detalle_venta(
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    p_ide_vent IN detalle_venta.ide_vent%TYPE,
    p_ide_prod IN detalle_venta.ide_prod%TYPE,
    p_cantidad_prod IN detalle_venta.cantidad_prod%TYPE,
    p_precio_unitario_prod IN detalle_venta.precio_unitario_prod%TYPE,
    p_dcto_prod IN detalle_venta.dcto_prod%TYPE,
    p_dcto_promo IN detalle_venta.dcto_promo%TYPE,
    p_iva_prod IN detalle_venta.iva_prod%TYPE,
    p_subtotal_prod IN detalle_venta.subtotal_prod%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
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
    p_response := '{"success": true, "message": "Detalle de venta actualizado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Eliminar
CREATE OR REPLACE FUNCTION eliminar_detalle_venta(
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    OUT p_result INTEGER,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM detalle_venta WHERE ide_deta_vent = p_ide_deta_vent;
    
    p_result := 1;
    p_response := '{"success": true, "message": "Detalle de venta eliminado correctamente"}';
EXCEPTION
    WHEN OTHERS THEN
        p_result := 0;
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Listar
CREATE OR REPLACE FUNCTION listar_detalle_venta(
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_venta ORDER BY ide_deta_vent;
    p_response := '{"success": true, "message": "Listado de detalles de venta obtenido"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Buscar por ID
CREATE OR REPLACE FUNCTION buscar_detalle_venta(
    p_ide_deta_vent IN detalle_venta.ide_deta_vent%TYPE,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR SELECT * FROM detalle_venta WHERE ide_deta_vent = p_ide_deta_vent;
    p_response := '{"success": true, "message": "Detalle de venta encontrado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;

-- Filtrar por venta
CREATE OR REPLACE FUNCTION filtrar_detalle_venta(
    p_ide_vent IN detalle_venta.ide_vent%TYPE DEFAULT NULL,
    p_ide_prod IN detalle_venta.ide_prod%TYPE DEFAULT NULL,
    OUT p_result REFCURSOR,
    OUT p_response TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
    SELECT * FROM detalle_venta
    WHERE (p_ide_vent IS NULL OR ide_vent = p_ide_vent)
    AND (p_ide_prod IS NULL OR ide_prod = p_ide_prod)
    ORDER BY ide_deta_vent;
    
    p_response := '{"success": true, "message": "Filtrado de detalles de venta completado"}';
EXCEPTION
    WHEN OTHERS THEN
        p_response := '{"success": false, "message": "' || SQLERRM || '"}';
END;
$$;


