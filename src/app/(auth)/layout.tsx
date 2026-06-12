import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex w-full">
      {/* Left Column: Form & Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10 w-full max-w-[600px] lg:max-w-none">
        
        {/* Brand Logo - Top Left */}
        <div className="absolute top-8 left-6 sm:left-12 lg:left-20">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage-50 group-hover:bg-sage-100 transition-colors duration-300">
              <Leaf className="w-5 h-5 text-sage-600" />
            </div>
            <span className="text-xl font-bold text-warm-900 tracking-tight">
              {STORE_NAME.split(" ")[0]}
            </span>
          </Link>
        </div>

        {/* Dynamic Content (Login/Registro Forms) */}
        <div className="w-full max-w-md mx-auto mt-12 lg:mt-0">
          {children}
        </div>
        
        {/* Footer info - Bottom Left */}
        <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 text-xs text-warm-400 font-light">
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
