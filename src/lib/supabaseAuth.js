import { ROLES } from "./roles";
import { supabase, authEmailForUsername, isSupabaseConfigured } from "./supabaseClient";

let cachedUserId = null;

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function profileToUser(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    email: profile.display_email || profile.email || "",
    role: profile.role || ROLES.SEEKER,
    created_at: profile.created_at,
  };
}

async function fetchProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function register({ name, username, email, password, role = ROLES.SEEKER }) {
  if (!isSupabaseConfigured()) throw new Error("Backend no configurado");

  if (!name?.trim()) throw new Error("Ingresa tu nombre");
  if (!username?.trim()) throw new Error("Ingresa un usuario");
  if (!password || password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

  const normalized = normalizeUsername(username);
  const { data: exists, error: existsError } = await supabase.rpc("username_exists", {
    p_username: normalized,
  });
  if (existsError) throw new Error(existsError.message);
  if (exists) throw new Error("Ese usuario ya está registrado");

  const authEmail = authEmailForUsername(normalized);
  const { data, error } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      data: {
        username: normalized,
        name: name.trim(),
        role: role || ROLES.SEEKER,
        display_email: email?.trim() || "",
      },
    },
  });

  if (error) throw new Error(error.message);

  const userId = data.user?.id;
  if (!userId) throw new Error("No se pudo crear la cuenta");

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    username: normalized,
    name: name.trim(),
    role: role || ROLES.SEEKER,
    display_email: email?.trim() || "",
    auth_email: authEmail,
  });

  if (profileError) throw new Error(profileError.message);

  if (data.session) {
    cachedUserId = data.session.user?.id || null;
    const profile = await fetchProfile(userId);
    return { user: profileToUser(profile), access_token: data.session.access_token };
  }

  return login(username, password);
}

export async function login(username, password) {
  if (!isSupabaseConfigured()) throw new Error("Backend no configurado");
  if (!username?.trim() || !password) throw new Error("Usuario y contraseña son obligatorios");

  const normalized = normalizeUsername(username);
  const { data: authEmail, error: rpcError } = await supabase.rpc("get_auth_email", {
    p_username: normalized,
  });
  if (rpcError) throw new Error(rpcError.message);
  if (!authEmail) throw new Error("Usuario o contraseña incorrectos");

  const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password });
  if (error) throw new Error("Usuario o contraseña incorrectos");

  cachedUserId = data.user?.id || null;
  const profile = cachedUserId ? await fetchProfile(cachedUserId) : null;

  return {
    user: profileToUser(profile),
    access_token: data.session?.access_token || null,
  };
}

export async function loginViaEmailPassword(identifier, password) {
  return login(identifier, password);
}

export async function me() {
  if (!isSupabaseConfigured()) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    cachedUserId = null;
    return null;
  }
  cachedUserId = session.user.id;
  const profile = await fetchProfile(session.user.id);
  return profileToUser(profile);
}

export function getToken() {
  return null;
}

export function getCurrentUserId() {
  return cachedUserId;
}

export async function getCurrentUserIdAsync() {
  if (cachedUserId) return cachedUserId;
  const { data: { session } } = await supabase.auth.getSession();
  cachedUserId = session?.user?.id || null;
  return cachedUserId;
}

export function setToken() {
  /* Supabase gestiona la sesión */
}

export async function logout() {
  if (!isSupabaseConfigured()) return;
  cachedUserId = null;
  await supabase.auth.signOut();
}

export async function resetPasswordRequest(email) {
  if (!email?.trim()) throw new Error("Ingresa tu correo");
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/olvide-contrasena`,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function resetPassword() {
  throw new Error("Usa el enlace enviado a tu correo para restablecer la contraseña.");
}

export async function verifyOtp() {
  throw new Error("Verificación OTP no disponible");
}

export async function resendOtp() {
  throw new Error("Reenvío OTP no disponible");
}

export function loginWithProvider() {
  throw new Error("Inicio con Google estará disponible pronto");
}

export function initSupabaseAuth() {
  if (!supabase) return;
  supabase.auth.getSession().then(({ data: { session } }) => {
    cachedUserId = session?.user?.id || null;
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    cachedUserId = session?.user?.id || null;
  });
}
