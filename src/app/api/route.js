import { NextResponse } from 'next/server';

export async function GET() {
  const consumer_key2 = process.env.CONSUMER_KEY;
  const consumer_secret2 = process.env.CONSUMER_SECRET;
  const api=process.env.urlAPI;

  // Verifica que las credenciales estén definidas
  if (!consumer_key2 || !consumer_secret2) {
    return NextResponse.json(
      { message: 'Consumer key or secret is missing' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(api+'/products', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${consumer_key2}:${consumer_secret2}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      // Devuelve un mensaje de error con el estado de la respuesta
      const errorMessage = `Error fetching products: ${response.statusText}`;
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Usa la variable `error` para devolver un mensaje más detallado
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error fetching products', error: errorMessage },
      { status: 500 }
    );
  }
}