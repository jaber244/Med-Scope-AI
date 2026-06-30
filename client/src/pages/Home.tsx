import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Stethoscope, Eye, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Health Assistant
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-foreground mb-6 leading-[1.1]">
              Smart Health Insights, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Anytime, Anywhere.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              MedScope AI analyzes your symptoms and medical images instantly to provide reliable insights and guide your next steps.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/symptoms">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Check Symptoms
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/vision">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-primary/20 hover:bg-primary/5 transition-all">
                  Try Vision AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-black/20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={item} className="group p-8 rounded-3xl bg-background border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Symptom Checker</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe your symptoms in natural language. Our AI analyzes patterns to suggest potential causes and urgency levels.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={item} className="group p-8 rounded-3xl bg-background border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Vision AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload images of skin conditions or other visible symptoms. Our computer vision model provides instant analysis.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={item} className="group p-8 rounded-3xl bg-background border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Safety First</h3>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize your safety by flagging severe symptoms and recommending immediate medical attention when necessary.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MedScope AI?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bridging the gap between uncertainty and medical care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Instant Insights</h4>
              <p className="text-muted-foreground">No more waiting. Get preliminary analysis in seconds to make informed decisions.</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Accessible Everywhere</h4>
              <p className="text-muted-foreground">Designed for remote areas and students. Quality health support wherever you are.</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Privacy Focused</h4>
              <p className="text-muted-foreground">Your health data is sensitive. We handle your inquiries with strict privacy standards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
