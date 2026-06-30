export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-display text-foreground">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
          <p>Welcome to MedScope AI. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our health assistant tools.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Collection</h2>
          <p>We collect information that you provide directly to us, such as health symptoms, images for analysis, and profile details (age, weight, height, health goals). This data is used solely to provide and improve our AI-powered health insights.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal data. However, please remember that no method of transmission over the internet is 100% secure.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact the Champions Crew team.</p>
        </section>
      </div>
    </div>
  );
}
