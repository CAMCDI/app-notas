import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <div>
      <h1>Frontend Base</h1>
      <p>Stripe configurado correctamente con variable de entorno.</p>
    </div>
  );
}

export default App;