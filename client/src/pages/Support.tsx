import { useState, useEffect } from "react";
import { Heart, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import teamLogo from "@/assets/team-logo.jpg";
import schoolLogo from "@/assets/school-logo.jpg";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

function useEasterEgg() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hp_data");
      if (!raw) return;
      const d = JSON.parse(raw);
      if (
        d.gender === "male" &&
        d.weight === "60" &&
        d.height === "179.5" &&
        d.goal === "bulk"
      ) {
        setActive(true);
      }
    } catch {}
  }, []);
  return active;
}

export default function Support() {
  const easterEgg = useEasterEgg();
  const [eggOpen, setEggOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Heart className="w-8 h-8 text-primary fill-primary/20" />
        <h1 className="text-4xl font-bold font-display text-foreground">Support Our Mission</h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
        We are dedicated to bringing advanced AI health technology to everyone. 
        Join our journey and follow our updates on social media.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="bg-card/50 border-border/50 overflow-visible hover-elevate transition-all">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-6 bg-white p-2 shadow-sm">
              <img src={schoolLogo} alt="Al Ittihad Schools" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold mb-2">Al Ittihad Schools</h3>
            <p className="text-sm text-muted-foreground mb-8 min-h-[3rem]">
              Our educational partner fostering innovation and excellence.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <a href="https://www.instagram.com/ittihadschools_aqaba/" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90 text-white gap-2 h-11">
                  <SiInstagram className="w-5 h-5" />
                  Follow on Instagram
                </Button>
              </a>
              <a href="https://www.facebook.com/ittihad.school/" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2 h-11">
                  <SiFacebook className="w-5 h-5" />
                  Follow on Facebook
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 overflow-visible hover-elevate transition-all">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-6 bg-white p-2 shadow-sm">
              <img src={teamLogo} alt="Champions Crew" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold mb-2">Champions Crew</h3>
            <p className="text-sm text-muted-foreground mb-8 min-h-[3rem]">
              The visionary team behind MedScope AI.
            </p>
            <a href="https://www.instagram.com/champions.crew.elo14/" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90 text-white gap-2 h-11">
                <SiInstagram className="w-5 h-5" />
                Follow on Instagram
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="relative inline-block">
        <p className="text-muted-foreground italic text-sm mt-12">
          "Innovation distinguishes between a leader and a follower."
        </p>

        <AnimatePresence>
          {easterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.6, type: "spring" }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2"
            >
              <button
                onClick={() => setEggOpen(true)}
                className="relative w-5 h-5 rounded-full cursor-pointer border-0 bg-transparent p-0 group"
                aria-label="."
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 dark:from-amber-500 dark:via-yellow-300 dark:to-amber-600 animate-pulse opacity-60 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="relative w-3 h-3 mx-auto mt-1 text-amber-700 dark:text-amber-900 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={eggOpen} onOpenChange={setEggOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold font-display flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Secret Found
              <Sparkles className="w-5 h-5 text-amber-500" />
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-amber-800" />
            </motion.div>
            <p className="text-lg font-semibold text-foreground">
              Congratulations, you found an easter egg!
            </p>
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Created & Owned by</p>
              <p className="text-lg font-bold font-display bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                JABER MAHMOUD YASEEN
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              You are one of the few who discovered this secret.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
