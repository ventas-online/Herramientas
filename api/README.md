# Backend de IA — Generador de Catálogos

Esta carpeta define el contrato del backend que conectará el generador con un modelo de IA.

## Flujo

1. El navegador selecciona una fotografía.
2. La fotografía se envía al backend por HTTPS.
3. El backend autentica la solicitud y usa la clave de IA almacenada como secreto del servidor.
4. El modelo devuelve información estructurada del producto.
5. El backend valida y normaliza la respuesta.
6. El generador recibe JSON y lo convierte en una ficha editable.

## Respuesta esperada

```json
{
  "nombre": "Nombre del producto",
  "marca": "Marca detectada",
  "categoria": "Categoría",
  "descripcion": "Descripción comercial",
  "beneficios": ["Beneficio 1", "Beneficio 2"],
  "precio": ""
}
```

El precio queda vacío porque debe ser confirmado por el operador. Nunca se debe confiar en un precio inventado por la IA.

## Seguridad

No colocar claves de API en HTML, JavaScript del navegador, imágenes ni archivos públicos del repositorio. Las claves deben vivir como variables secretas del servicio backend.

Este archivo es la especificación del contrato; el siguiente paso es desplegar el endpoint real y conectar `generador.html` con él.
