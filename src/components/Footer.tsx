import justiceBotLogo from "@/assets/justice-bot-logo.png";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Scale } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-foreground text-background py-8 sm:py-12 md:py-16 border-t-4 border-primary" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-8" role="navigation" aria-label="Footer navigation">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold block">Justice-Bot</span>
                <span className="text-xs text-background/60 uppercase tracking-wider">Technologies Inc.</span>
              </div>
            </div>
            <p className="text-sm text-primary font-semibold italic border-l-2 border-primary pl-3">
              ignorance is not an option
            </p>
            <p className="text-sm text-background/80 leading-relaxed">
              Empowering Canadians with knowledge of their rights.
            </p>
          </div>

          <nav aria-labelledby="services-heading">
            <h3 id="services-heading" className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-background/80">
              <li><a href="/triage" className="hover:text-background transition-colors">Smart Triage</a></li>
              <li><a href="/tribunal-locator" className="hover:text-background transition-colors">Court Locator</a></li>
              <li><a href="/forms" className="hover:text-background transition-colors">Legal Forms</a></li>
              <li><a href="/assessment" className="hover:text-background transition-colors">Merit Score</a></li>
              <li><a href="/pricing" className="hover:text-background transition-colors">Pricing</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="guides-heading">
            <h3 id="guides-heading" className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Guides</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-background/80">
              <li><a href="/ltb-toronto" className="hover:text-background transition-colors">LTB Toronto</a></li>
              <li><a href="/how-to-fight-n4-eviction-ontario" className="hover:text-background transition-colors">Fight N4 Eviction</a></li>
              <li><a href="/how-to-file-t2-ontario" className="hover:text-background transition-colors">File T2</a></li>
              <li><a href="/hrto-toronto" className="hover:text-background transition-colors">HRTO Toronto</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="company-heading">
            <h3 id="company-heading" className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-background/80">
              <li><a href="/about" className="hover:text-background transition-colors">About</a></li>
              <li><a href="/blog" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-background transition-colors">Contact</a></li>
              <li><a href="/partners" className="hover:text-background transition-colors">Partners</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="legal-heading">
            <h3 id="legal-heading" className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-background/80">
              <li><a href="/liability" className="hover:text-background transition-colors text-red-300">⚠️ Disclaimer</a></li>
              <li><a href="/user-terms" className="hover:text-background transition-colors">User Terms</a></li>
              <li><a href="/terms" className="hover:text-background transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-background transition-colors">Privacy</a></li>
              <li><a href="/accessibility" className="hover:text-background transition-colors">Accessibility</a></li>
              <li><a href="/complaint-process" className="hover:text-background transition-colors">Complaints</a></li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-background/20 pt-6 sm:pt-8">
          {/* Critical Legal Warnings Section - Simplified for mobile */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="text-center mb-2 sm:mb-3">
              <span className="text-red-300 font-bold text-sm sm:text-lg">⚠️ NOT LEGAL ADVICE ⚠️</span>
            </div>
            <div className="text-xs text-background/80 text-center space-y-1">
              <p>Not a law firm. No lawyer-client relationship. Information only.</p>
              <p className="text-red-300 font-semibold">
                Emergency? Legal Aid: 1-800-668-8258
              </p>
            </div>
          </div>

          {/* Social Media Links - More compact on mobile */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61579916761955"
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/JusticeBotCA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/justice-bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/justicebotofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@JusticeBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-background/80 text-center sm:text-left">
              © 2025 Justice Bot Technologies Inc. | Ontario, Canada
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-background/80">
              <a href="/liability" className="hover:text-background transition-colors text-red-300 font-semibold">⚠️ Disclaimer</a>
              <a href="/privacy" className="hover:text-background transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-background transition-colors">Terms</a>
            </div>
          </div>
          
          {/* Simplified Data Protection Notice */}
          <div className="mt-4 p-3 bg-background/10 rounded-lg">
            <p className="text-xs text-background/60 leading-relaxed text-center">
              Enterprise-grade encryption. Canadian data storage. PIPEDA compliant.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;