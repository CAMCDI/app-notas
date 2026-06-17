import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Star, CheckCircle2, Infinity, Palette, BookTemplate, CalendarDays, Moon, Unlock } from 'lucide-react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

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
        className="mt-2 rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
        {cargando ? 'Procesando...' : 'Pagar $9.99 USD'}
      </button>
    </form>
  );
};

// Lista de beneficios de la suscripción Premium
const beneficios = [
  { icon: Infinity,       texto: 'Notas ilimitadas (gratis: máximo 10)' },
  { icon: Palette,        texto: 'Colores personalizados en tus notas' },
  { icon: BookTemplate,   texto: 'Plantillas: Apuntes, Diario, Tareas, Proyecto' },
  { icon: CalendarDays,   texto: 'Fechas de evento en cada nota' },
  { icon: Moon,           texto: 'Modo oscuro y claro a tu gusto' },
  { icon: Star,           texto: 'Insignia Premium en tu perfil' },
];

const Pago = () => {
  const navigate = useNavigate();
  const { setEsPremium } = useUser();

  // Al pago exitoso actualizamos el estado global de premium
  const handlePagoExitoso = () => {
    setEsPremium(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <NotebookPen size={42} strokeWidth={1.75} className="text-amber-600" />
          <h1 className="text-2xl font-bold text-neutral-800">Note App</h1>
        </div>
        {/* Muestra los beneficios del Premium */}
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Unlock size={16} className="text-amber-600" />
            <h3 className="font-semibold text-neutral-800 text-sm">¿Qué desbloqueas con Premium?</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {beneficios.map(({ icon: Icon, texto }) => (
              <li key={texto} className="flex items-start gap-2 text-sm text-neutral-700">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Formulario de pago */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="flex justify-center">
              <Star size={42} strokeWidth={1.75} className="text-amber-500 fill-amber-500" />
            </span>
            <h2 className="mt-2 text-xl font-semibold text-neutral-800">Hazte Premium</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Todo lo anterior por solo <span className="font-semibold text-amber-600">$9.99 USD</span>
            </p>
          </div>
          <Elements stripe={stripePromise}>
            <PagoForm onPagoExitoso={handlePagoExitoso} />
          </Elements>
          <button
            onClick={() => navigate('/notas')}
            className="mt-4 w-full text-center text-sm text-neutral-400 hover:underline">
            Volver a mis notas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pago;