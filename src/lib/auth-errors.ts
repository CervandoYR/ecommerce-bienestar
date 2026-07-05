export function translateAuthError(error: string | null | undefined): string {
  if (!error) return "";

  const err = error.toLowerCase().trim();

  // 1. Credenciales inválidas (la más común de Supabase)
  if (
    err.includes("invalid login credentials") ||
    err.includes("invalid_credentials") ||
    err.includes("invalid grant") ||
    err.includes("credentials")
  ) {
    return "El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos e inténtalo nuevamente.";
  }

  // 2. Errores de URL Path / Redirección / OAuth
  if (
    err.includes("url path") ||
    err.includes("redirect_uri_mismatch") ||
    err.includes("redirect_uri") ||
    err.includes("mismatch") ||
    err.includes("url") ||
    err.includes("path")
  ) {
    return "Hubo un problema con la redirección o la ruta de enlace (URL Path). Por favor, intenta acceder nuevamente desde la página principal o recarga el navegador.";
  }

  // 3. Usuario ya registrado
  if (
    err.includes("user already registered") ||
    err.includes("user_already_exists") ||
    err.includes("already exists") ||
    err.includes("duplicate")
  ) {
    return "Este correo electrónico ya se encuentra registrado en Samay Munay. Por favor, inicia sesión con tu cuenta existente.";
  }

  // 4. Contraseña débil
  if (
    err.includes("password should be at least 6 characters") ||
    err.includes("weak_password") ||
    err.includes("password")
  ) {
    return "La contraseña elegida es muy corta. Debe tener al menos 6 caracteres para garantizar la seguridad de tu santuario.";
  }

  // 5. Correo no confirmado
  if (
    err.includes("email not confirmed") ||
    err.includes("unverified")
  ) {
    return "Tu correo electrónico aún no ha sido confirmado. Por favor, revisa tu bandeja de entrada o carpeta de spam para activar tu cuenta.";
  }

  // 6. Formato de correo inválido
  if (
    err.includes("invalid email") ||
    err.includes("unable to validate email") ||
    err.includes("format")
  ) {
    return "El formato del correo electrónico no es válido. Verifica que esté bien escrito (ejemplo: usuario@correo.com).";
  }

  // 7. Límite de intentos (Rate limit)
  if (
    err.includes("rate limit exceeded") ||
    err.includes("over_email_send_rate_limit") ||
    err.includes("too many requests") ||
    err.includes("rate limit")
  ) {
    return "Has realizado demasiados intentos en poco tiempo. Por seguridad, espera unos minutos antes de volver a intentarlo.";
  }

  // 8. Acceso denegado / OAuth cancelado
  if (
    err.includes("access_denied") ||
    err.includes("user_cancelled") ||
    err.includes("denied")
  ) {
    return "El inicio de sesión fue cancelado o no se concedieron los permisos necesarios de Google.";
  }

  // 9. Enlace expirado o inválido
  if (
    err.includes("email link is invalid or has expired") ||
    err.includes("otp_expired") ||
    err.includes("expired")
  ) {
    return "El enlace de seguridad o recuperación ha expirado o ya no es válido. Por favor, solicita uno nuevo.";
  }

  // 10. Si el mensaje ya está en español (contiene palabras en español)
  if (
    err.includes("error al") ||
    err.includes("debes aceptar") ||
    err.includes("inicio de sesión") ||
    err.includes("correo") ||
    err.includes("contraseña") ||
    err.includes("usuario") ||
    err.includes("políticas")
  ) {
    return error;
  }

  // Fallback para cualquier mensaje en inglés desconocido o técnico
  return "Ocurrió un problema de validación (" + error + "). Por favor, verifica tus datos e inténtalo nuevamente.";
}
