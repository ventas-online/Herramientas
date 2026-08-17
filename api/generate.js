export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    const { image, price } = req.body || {};
    if (!image || !price) {
      return res.status(400).json({ error: 'Faltan la imagen o el precio.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'La API de IA todavía no está configurada en el servidor.' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5.6-luna',
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Analiza esta foto de producto para una tienda online. El precio proporcionado por el usuario es: ${price}. Devuelve SOLO JSON válido, sin markdown, con estas claves: nombre, marca, categoria, descripcion, beneficios (array de 3 a 5), caracteristicas (array de 3 a 5), publico_objetivo, whatsapp, instagram. No inventes datos que no puedan determinarse de la imagen. Si un dato no puede confirmarse, usa "No identificado". La descripción y textos deben ser comerciales pero honestos. No atribuyas propiedades médicas ni resultados garantizados.`
            },
            { type: 'input_image', image_url: image }
          ]
        }],
        max_output_tokens: 1200
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Error al consultar la IA.' });
    }

    const text = data.output_text || '';
    let product;
    try {
      product = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'La IA devolvió un formato inesperado. Intenta nuevamente.' });
    }

    product.precio = price;
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo generar el producto. Intenta nuevamente.' });
  }
}
