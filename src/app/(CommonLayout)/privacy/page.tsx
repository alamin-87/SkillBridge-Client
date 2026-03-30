import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SkillBridge",
  description: "Learn how SkillBridge collects, uses, and protects your personal information.",
};

const lastUpdated = "March 30, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* 🚀 Hero Header */}
      <section className="relative pt-24 pb-16 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-gradient-to-br from-[#3b82f6] to-[#10b981] opacity-10 blur-[100px] rounded-full animate-blob pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 size-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-xl">
             <ShieldCheck className="h-8 w-8 text-[#10b981]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7]">Policy</span>
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Your privacy is critically important to us. Here is how we protect your data.
          </p>
          <p className="text-sm text-white/50 mt-4 font-medium uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* 📜 Content Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="card-3d bg-card/80 backdrop-blur-xl border border-border/40 shadow-xl rounded-3xl p-8 md:p-12 prose prose-zinc dark:prose-invert max-w-none">
          
          <h2 className="text-2xl font-bold text-foreground mt-0">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to SkillBridge ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">2. The Data We Collect About You</h2>
          <p className="text-muted-foreground leading-relaxed">
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#7c3aed]">
            <li><strong className="text-foreground">Identity Data</strong> includes first name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
            <li><strong className="text-foreground">Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong className="text-foreground">Financial Data</strong> includes bank account and payment card details (processed securely via our third-party payment providers).</li>
            <li><strong className="text-foreground">Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
            <li><strong className="text-foreground">Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">3. How Is Your Personal Data Collected?</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use different methods to collect data from and about you including through:
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#7c3aed]">
            <li><strong className="text-foreground">Direct interactions.</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you create an account, subscribe to our service, or request marketing to be sent to you.</li>
            <li><strong className="text-foreground">Automated technologies or interactions.</strong> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">4. How We Use Your Personal Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#7c3aed]">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., matching a student with a tutor and facilitating the video session).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">5. Video Recording and Audio Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            As a tutoring platform, <strong className="text-foreground">SkillBridge records audio and video data during tutoring sessions</strong> strictly for trust, safety, and dispute resolution purposes. These recordings are kept securely encrypted and are only accessed by the internal Trust and Safety team in the event of a reported user violation or billing dispute. They are automatically permanently wiped after 30 days unless subject to an active investigation. Both parties are notified in the session interface that recording is active.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">6. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">7. Your Legal Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#7c3aed]">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data (Right to be Forgotten).</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            If you wish to exercise any of the rights set out above, please contact us at our privacy desk.
          </p>

          <hr className="my-10 border-border" />

          <div className="bg-muted/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-border/50">
            <div>
              <h3 className="text-lg font-bold text-foreground m-0 mb-1">Questions about our Privacy Policy?</h3>
              <p className="text-sm text-muted-foreground m-0">Our Data Protection Officer is available to address your concerns.</p>
            </div>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap"
            >
              <Mail className="h-4 w-4" /> Contact DPO
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
