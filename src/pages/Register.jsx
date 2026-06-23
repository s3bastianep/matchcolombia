import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, User, Lock, Mail, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
      setError("Usuario: 3 a 20 caracteres (letras, números, . _ -)");
      return;
    }

    setLoading(true);
    try {
      await api.auth.register({ name, username, email, password });
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para guardar favoritos y publicar inmuebles"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-brand-violet hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nombre completo
          </Label>
          <Input
            id="name"
            autoComplete="name"
            autoFocus
            placeholder="María González"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border-border/60"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Usuario *
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="username"
              autoComplete="username"
              placeholder="maria_arriendos"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 rounded-xl border-border/60"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Correo (opcional)
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-xl border-border/60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contraseña *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 rounded-xl border-border/60"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Confirmar contraseña *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12 rounded-xl border-border/60"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl gradient-cta btn-glow text-white font-bold text-sm hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Crear cuenta
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
