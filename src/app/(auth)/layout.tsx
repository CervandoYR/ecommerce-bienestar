import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex w-full">
      {/* Left Column: Form & Content */}
      <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-20 xl:px-24 py-8 relative z-10 w-full max-w-[600px] lg:max-w-none overflow-y-auto">
        
        {/* Header (Back link) */}
        <div className="mb-8 mt-4">
          <Link href="/" className="text-warm-500 hover:text-warm-900 text-sm font-medium transition-colors flex items-center gap-2 w-fit">
            &larr; Volver a la tienda
          </Link>
        </div>

        {/* Dynamic Content (Login/Registro Forms) */}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
          
          {/* Centered Brand Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo.ico" 
                  alt={STORE_NAME} 
                  fill 
                  className="object-contain"
                  unoptimized 
                />
              </div>
              <span className="font-bold text-2xl text-warm-900 tracking-wide font-serif">
                {STORE_NAME}
              </span>
            </Link>
          </div>

          {children}
        </div>
        
        {/* Footer info */}
        <div className="mt-12 mb-4 text-center text-xs text-warm-400 font-light">
          &copy; {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Column: High Quality Split-Screen Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-warm-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"
          alt="Rituales de bienestar y relajación"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Elegant Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
        
        {/* Atmospheric Floating Quote */}
        <div className="absolute inset-x-0 bottom-24 p-16 text-white text-center">
          <p className="text-3xl md:text-4xl font-light italic mb-6 leading-relaxed">
            "Transforma tu rutina en un ritual sagrado de calma y conexión."
          </p>
          <div className="w-12 h-[1px] bg-white/50 mx-auto" />
        </div>
      </div>
    </div>
  );
}
