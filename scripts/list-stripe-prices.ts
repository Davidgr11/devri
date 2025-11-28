/**
 * Script temporal para listar todos los precios de Stripe
 * Ejecutar con: npx tsx scripts/list-stripe-prices.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

async function listPrices() {
  console.log('🔍 Listando todos los precios de Stripe...\n');

  try {
    // Listar todos los precios activos
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100,
    });

    if (prices.data.length === 0) {
      console.log('❌ No se encontraron precios activos en tu cuenta de Stripe.\n');
      console.log('💡 Necesitas crear precios para tus productos en Stripe Dashboard.');
      return;
    }

    console.log(`✅ Encontrados ${prices.data.length} precios activos:\n`);
    console.log('='.repeat(80));

    prices.data.forEach((price) => {
      const product = price.product as Stripe.Product;
      const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : '0.00';
      const currency = price.currency.toUpperCase();
      const interval = price.recurring?.interval || 'one-time';

      console.log(`
📦 Producto: ${product.name}
   Product ID: ${product.id}
   💰 Precio: ${amount} ${currency} / ${interval}
   🔑 PRICE ID: ${price.id}
   ${price.nickname ? `   Alias: ${price.nickname}` : ''}
${'='.repeat(80)}`);
    });

    console.log('\n📝 Copia los PRICE IDs (price_xxx) y actualiza tu base de datos.\n');
    console.log('💡 Ejemplo de actualización SQL:');
    console.log(`
UPDATE subscription_plans
SET stripe_price_id = 'price_xxx'
WHERE slug = 'basico';
    `);

  } catch (error) {
    console.error('❌ Error al listar precios:', error);
  }
}

listPrices();
