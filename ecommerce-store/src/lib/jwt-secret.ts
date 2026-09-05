export function getJwtSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "lumen-dev-jwt-secret-change-in-production",
  );
}
