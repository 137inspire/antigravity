import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const session = await getServerSession(authOptions);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Mocking the Stripe checkout for now as requested
    // In the future, re-enable Stripe checkout.sessions.create here.
    
    // Calculate shipping based on weight ($5 flat + $2 per kg)
    let totalWeight = 0;
    items.forEach((item: any) => {
      totalWeight += (item.product.weight * item.quantity);
    });
    
    const shippingCost = 500 + Math.round(totalWeight * 200);

    console.log(`Simulated Order for ${session?.user?.email || 'Guest'}, Shipping: $${(shippingCost/100).toFixed(2)}`);

    // Immediately redirect to success page without hitting a live payment link
    return NextResponse.json({ 
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id=simulated_order_123` 
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
