export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo placeholder */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-sage-100" />
          <div className="absolute inset-0 rounded-full border-4 border-sage-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-warm-500 text-sm font-medium animate-pulse-soft">
          Cargando...
        </p>
      </div>
    </div>
  );
}
