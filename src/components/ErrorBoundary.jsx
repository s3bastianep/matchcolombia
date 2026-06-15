import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    const message = error?.message || "";
    if (
      (message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Importing a module script failed")) &&
      !sessionStorage.getItem("lumora-chunk-reload")
    ) {
      sessionStorage.setItem("lumora-chunk-reload", "1");
      window.location.reload();
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-border/50 p-8 text-center shadow-lg">
            <p className="text-4xl mb-4">⚠️</p>
            <h1 className="font-extrabold text-xl mb-2">Algo salió mal</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Recarga la página. Si persiste, borra el caché del navegador.
            </p>
            {this.state.error?.message && (
              <p className="text-xs text-left bg-secondary/60 rounded-xl p-3 mb-4 font-mono break-all text-destructive">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="gradient-cta text-white font-bold px-6 py-3 rounded-xl"
              >
                Recargar
              </button>
              <button
                type="button"
                onClick={() => {
                  Object.keys(localStorage)
                    .filter((key) => key.startsWith("matchcolombia_"))
                    .forEach((key) => localStorage.removeItem(key));
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-secondary/60"
              >
                Limpiar datos locales
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
