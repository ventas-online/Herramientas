export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    const { image, price } = req.body || {};

    if (!image || !price) {
      return res.status(400).json({ error: 'Faltan la imagen o el precio.' });
    }

    if (typeof image !== 'string' || !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'La imagen no tiene un formato válido.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'La IA todavía no está configurada en el servidor.' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5.6-luna',
        reasoning: { effort: 'none' },
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Analiza la foto de este producto para una tienda online. El precio proporcionado por el usuario es: ${price}. Devuelve SOLO un objeto JSON válido, sin markdown ni texto adicional, con exactamente estas claves: nombre, marca, categoria, descripcion, beneficios, caracteristicas, publico_objetivo, whatsapp, instagram. beneficios y caracteristicas deben ser arrays de 3 a 5 elementos. No inventes datos que no puedan determinarse razonablemente de la imagen. Si un dato no puede confirmarse, usa "No identificado". No atribuyas propiedades médicas, resultados garantizados, ingredientes o especificaciones que no sean visibles o confirmables. Los textos comerciales deben ser claros, atractivos y honestos.`
            },
            { type: 'input_image', image_url: image }
          ]
        }],
        text: {
          format: {
            type: 'json_schema',
            name: 'producto_para_venta',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                nombre: { type: 'string' },
                marca: { type: 'string' },
                categoria: { type: 'string' },
                descripcion: { type: 'string' },
                beneficios: { type: 'array', items: { type: 'string' } },
                caracteristicas: { type: 'array', items: { type: 'string' } },
                publico_objetivo: { type: 'string' },
                whatsapp: { type: 'string' },
                instagram: { type: 'string' }
              },
              required: [
                'nombre',
                'marca',
                'categoria',
                'descripcion',
                'beneficios',
                'caracteristicas',
                'publico_objetivo',
                'whatsapp',
                'instagram'
              ]
            }
          }
        },
        max_output_tokens: 1200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Error al consultar la IA.'
      });
    }

    const text = data.output_text || '';
    if (!text) {
      return res.status(502).json({ error: 'La IA no devolvió contenido.' });
    }

    let product;
    try {
      product = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'La IA devolvió un formato inesperado. Intenta nuevamente.' });
    }

    product.precio = String(price).trim();

    return res.status(200).json({ product });
  } catch (error) {
    console.error('generate-product error:', error);
    return res.status(500).json({ error: 'No se pudo generar el producto. Intenta nuevamente.' });
  }
}
