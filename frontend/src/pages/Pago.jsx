import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Star } from 'lucide-react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

// .env (VITE_STRIPE_PUBLIC_KEY)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PagoForm = ({ onPagoExitoso }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe no está listo');
      return;
    }

    setCargando(true);

    const { error, token } = await stripe.createToken(elements.getElement(CardElement));
    if (error) {
      toast.error(error.message);
      setCargando(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stripeToken: token.id }) 
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al procesar el pago');
        return;
      }

      toast.success('¡Pago exitoso! Ahora eres Premium ⭐');
      onPagoExitoso();
      navigate('/notas');

    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
      <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || cargando}
        className="mt-2 rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
      >
        {cargando ? 'Procesando...' : 'Pagar $9.99 USD'}
      </button>
    </form>
  );
};

const Pago = () => {
  const navigate = useNavigate();

  const handlePagoExitoso = () => {
    // Aquí puedes actualizar el contexto si lo deseas
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 flex flex-col items-center gap-2">
          <NotebookPen size={42} strokeWidth={1.75} className="text-amber-600" />
          <h1 className="text-2xl font-bold text-neutral-800">Note App</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="flex justify-center"><Star size={42} strokeWidth={1.75} className="text-amber-500 fill-amber-500" /></span>
            <h2 className="mt-2 text-xl font-semibold text-neutral-800">Hazte Premium</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Colores, plantillas y más por solo $9.99 USD
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <PagoForm onPagoExitoso={handlePagoExitoso} />
          </Elements>

          <button
            onClick={() => navigate('/notas')}
            className="mt-4 w-full text-center text-sm text-neutral-400 hover:underline"
          >
            Volver a mis notas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pago;