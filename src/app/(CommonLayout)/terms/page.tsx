import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service | SkillBridge",
  description: "Read the terms and conditions for using the SkillBridge tutoring platform.",
};

const lastUpdated = "March 30, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* 🚀 Hero Header */}
      <section className="relative pt-24 pb-16 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1035] via-[#2d1b54] to-[#1a1035] dark:from-[#0f0a1e] dark:via-[#1a1230] dark:to-[#0f0a1e]" />
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] opacity-10 blur-[100px] rounded-full animate-blob pointer-events-none z-0" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 size-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-xl">
             <FileText className="h-8 w-8 text-[#f59e0b]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#8b5cf6]">Service</span>
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Please read these terms carefully before using the SkillBridge marketplace.
          </p>
          <p className="text-sm text-white/50 mt-4 font-medium uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* 📜 Content Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="card-3d bg-card/80 backdrop-blur-xl border border-border/40 shadow-xl rounded-3xl p-8 md:p-12 prose prose-zinc dark:prose-invert max-w-none">
          
          <h2 className="text-2xl font-bold text-foreground mt-0">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the SkillBridge platform ("SkillBridge," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any of these Terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">2. The SkillBridge Marketplace</h2>
          <p className="text-muted-foreground leading-relaxed">
            SkillBridge is an online marketplace that connects independent contractors who offer tutoring services ("Tutors") with individuals seeking tutoring services ("Students").
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#ec4899]">
            <li><strong>Independent Contractors:</strong> Tutors are independent contractors, not employees. We do not control the methods they use, their schedules, or their physical locations.</li>
            <li><strong>Contractual Relationship:</strong> When a Student books a Tutor, a direct contract is formed between the Student and the Tutor. SkillBridge is not a party to this contract, but acts solely as an agent facilitating payment and scheduling.</li>
            <li><strong>No Guarantees:</strong> While we vet our Tutors, we do not guarantee the outcome or success of any tutoring session.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">4. Payments, Fees, and Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            SkillBridge facilitates payments from Students to Tutors. All payment processing is handled by our third-party payment partner (e.g., Stripe). 
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#ec4899]">
            <li><strong>Platform Fee:</strong> SkillBridge charges a service fee on every completed transaction. This fee goes toward maintaining the platform infrastructure, video hosting, and trust and safety operations.</li>
            <li><strong>Cancellations:</strong> Students may cancel a booked session up to 24 hours in advance for a full refund. Cancellations made within 24 hours of the start time may be subject to a cancellation fee or forfeit of the booking cost at the Tutor's discretion.</li>
            <li><strong>Disputes:</strong> If a Student claims that a Tutor did not show up or the session quality was severely negligent, they must file a dispute within 48 hours of the session's end time. SkillBridge will review the session recording and issue a refund if the Tutor is found at fault.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">5. Prohibited Conduct</h2>
          <p className="text-muted-foreground leading-relaxed">
            You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="text-muted-foreground space-y-2 mt-4 list-disc pl-6 marker:text-[#ec4899]">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content, asking for personally identifiable information, or otherwise.</li>
            <li>To bypass the platform. You may not attempt to take payment or communication off the SkillBridge platform. Attempting to circumvent SkillBridge fees by processing payments externally will result in immediate permanent account termination.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm SkillBridge or users of the Service or expose them to liability.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10">6. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10">7. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <hr className="my-10 border-border" />

          <div className="bg-muted/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-border/50">
            <div>
              <h3 className="text-lg font-bold text-foreground m-0 mb-1">Have legal concerns?</h3>
              <p className="text-sm text-muted-foreground m-0">Review our Privacy Policy for information on data protection.</p>
            </div>
            <Link 
              href="/privacy" 
              className="inline-flex items-center justify-center gap-2 bg-[#ec4899] text-white hover:bg-[#db2777] px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap"
            >
              Privacy Policy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
