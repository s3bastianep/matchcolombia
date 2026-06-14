import { useLocation, Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-brand-violet/30">404</h1>
            <div className="h-0.5 w-16 bg-border mx-auto" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-foreground">
              Página no encontrada
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              La página <span className="font-medium text-foreground">"{pageName}"</span> no existe.
            </p>
          </div>

          <div className="pt-6">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-sm font-bold text-white gradient-cta rounded-xl hover:opacity-95 transition-opacity"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
