# Herramientas IA

Primera herramienta: convierte una foto de producto en contenido comercial listo para vender.

## Flujo

1. El usuario sube una foto.
2. Introduce el precio.
3. El backend envía la imagen a la API de IA usando `OPENAI_API_KEY` como variable de entorno.
4. La aplicación muestra nombre, marca, categoría, descripción, beneficios, características, público objetivo y textos para WhatsApp e Instagram.

## Seguridad

**Nunca** pongas una clave de OpenAI dentro de `index.html` ni la subas al repositorio. Debe configurarse como variable de entorno/secreto en el servicio de despliegue.

## Despliegue

El proyecto incluye `vercel.json` para preparar la función `/api/generate` en Vercel.

## Próximas funciones

- Guardar productos.
- Contador de productos generados.
- Catálogo automático después de 5 productos.
- Planes y pagos.
- Panel de administración.
