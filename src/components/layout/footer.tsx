import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STORE_NAME,
  STORE_DESCRIPTION,
  FOOTER_LINKS,
  WHATSAPP_NUMBER,
  STORE_EMAIL,
  STORE_ORIGIN,
} from "@/lib/constants";

const PAYMENT_METHODS = [
  { label: "Visa", display: "VISA" },
  { label: "Mastercard", display: "MC" },
  { label: "Yape", display: "YAPE" },
  { label: "Plin", display: "PLIN" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A100D] text-warm-200 relative overflow-hidden" role="contentinfo">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-sage-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sage-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter (Takes 5 columns on desktop) */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden",
                  "bg-sage-600/20 group-hover:bg-sage-600/30 border border-sage-500/20",
                  "transition-all duration-300"
                )}
              >
                <Image 
                  src="/logo.ico" 
                  alt="Logo" 
                  fill 
                  className="object-contain p-2"
                  unoptimized 
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {STORE_NAME}
              </span>
            </Link>

            <p className="text-base font-light leading-relaxed text-warm-400 max-w-md mb-8">
              Transformamos momentos cotidianos en rituales de bienestar. Descubre nuestra colección premium de aceites esenciales, aromaterapia y cuidado personal.
            </p>

            {/* Newsletter */}
            <div className="max-w-md">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Únete a nuestra comunidad</h4>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-white placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center text-white hover:bg-sage-500 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections (Takes 7 columns on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Column 2: Tienda */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
                Explorar
              </h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.tienda.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-warm-400 hover:text-white transition-colors duration-200 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
                Legal
              </h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.legal.map((link) => {
                  const isReclamaciones = link.href === "/libro-reclamaciones";
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-warm-400 hover:text-white transition-colors duration-200 font-light inline-flex items-center gap-2"
                      >
                        {isReclamaciones && <BookOpen className="w-4 h-4 text-sage-500" />}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 4: Contacto */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
                Soporte
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-warm-400 hover:text-white transition-colors duration-200 font-light"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-sage-400" />
                    </div>
                    <span>+{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 5)} {WHATSAPP_NUMBER.slice(5)}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${STORE_EMAIL}`}
                    className="flex items-center gap-3 text-warm-400 hover:text-white transition-colors duration-200 font-light"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-sage-400" />
                    </div>
                    <span>{STORE_EMAIL}</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-warm-400 font-light">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-sage-400" />
                    </div>
                    <span>{STORE_ORIGIN}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-warm-500 font-light">
              © {currentYear} {STORE_NAME}. Todos los derechos reservados.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.label}
                  className="w-10 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/50 tracking-wider"
                  title={method.label}
                >
                  {method.display}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
