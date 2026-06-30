import { Link, useLocation } from "wouter";
import { Activity, Stethoscope, Eye, Menu, X, ShieldAlert, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { HealthProfile } from "./HealthProfile";
import sponsorLogo from "@/assets/sponsor-logo.jpg";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home", icon: Activity, glow: "", hoverClass: "hover:text-primary" },
    { href: "/symptoms", label: "Symptom Checker", icon: Stethoscope, glow: "text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]", hoverClass: "hover:text-blue-500" },
    { href: "/vision", label: "Vision AI", icon: Eye, glow: "text-purple-500 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]", hoverClass: "hover:text-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-foreground">
              MedScope<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              const activeClass = link.glow && isActive ? link.glow : isActive ? "text-primary" : "text-muted-foreground";
              const hoverClass = link.glow ? link.hoverClass : "hover:text-primary";
              return (
                <Link key={link.href} href={link.href}>
                  <span className={`text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${activeClass} ${hoverClass}`}>
                    <link.icon className={`w-4 h-4 ${link.glow && isActive ? link.glow : ""}`} />
                    {link.label}
                  </span>
                </Link>
              );
            })}
            <div className="flex items-center gap-2">
              <HealthProfile />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <HealthProfile />
            <ThemeToggle />
            <button 
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border bg-background"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive = location === link.href;
                  const mobileActive = link.glow && isActive ? `${link.glow} bg-primary/5` : isActive ? "text-primary bg-primary/5" : "text-foreground";
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <span className={`block text-base font-medium p-2 rounded-md hover:bg-muted ${mobileActive}`}>
                        <div className="flex items-center gap-3">
                          <link.icon className={`w-5 h-5 ${link.glow && isActive ? link.glow : ""}`} />
                          {link.label}
                        </div>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-bold font-display">MedScope AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering individuals with advanced AI technology for early symptom detection and health awareness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/symptoms" className="hover:text-primary transition-colors">Symptom Checker</Link></li>
                <li><Link href="/vision" className="hover:text-primary transition-colors">Vision AI Analysis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors cursor-pointer">Terms of Service</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <h4 className="font-semibold mb-4">Support</h4>
              <p className="text-sm text-muted-foreground mb-4">Help us improve and keep our AI services accessible.</p>
              <Link href="/support">
                <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" variant="outline">
                  <Heart className="w-4 h-4 fill-current" />
                  Support Us
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col items-center gap-4 py-6 mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sponsored by</p>
              <div className="flex items-center justify-center gap-10 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-border">
                    <img src={sponsorLogo} alt="Ministry of Health" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Ministry of Health</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-border flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary leading-none">MBZ</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center" dir="rtl">مستشفى الشيخ محمد بن زايد</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-700 dark:text-yellow-400">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Medical Disclaimer</p>
                MedScope AI is an informational tool and does not provide medical diagnoses. It does not replace professional medical advice, diagnosis, or treatment. In case of a medical emergency, call emergency services immediately.
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} MedScope AI. All rights reserved.</p>
              <p className="font-semibold tracking-wide uppercase text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Made by Champions Crew</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
