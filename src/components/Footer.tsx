import { Scale } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-background rounded-lg">
                <Scale className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-lg font-bold">Justice-Bot</span>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Cutting through legal noise so you can move forward with confidence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#triage" className="hover:text-background transition-colors">Smart Triage</a></li>
              <li><a href="#locator" className="hover:text-background transition-colors">Court Locator</a></li>
              <li><a href="#forms" className="hover:text-background transition-colors">Form Builder</a></li>
              <li><a href="#merit" className="hover:text-background transition-colors">Merit Score</a></li>
              <li><a href="/pricing" className="hover:text-background transition-colors">Pricing</a></li>
              <li><a href="/low-income" className="hover:text-background transition-colors">Low-Income Program</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal Areas</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li>Landlord & Tenant (LTB)</li>
              <li>Human Rights (HRTO)</li>
              <li>Small Claims Court</li>
              <li>Family & CAS</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Coverage</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li>Ontario (Available Now)</li>
              <li>More Provinces Coming</li>
              <li>Mobile Optimized</li>
              <li>Free Beta Access</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/80">
              © 2024 Justice-Bot. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-background/80">
              <a href="/privacy" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-background transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-background transition-colors">Disclaimer</a>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-background/10 rounded-lg">
            <p className="text-xs text-background/70 leading-relaxed">
              <strong>Legal Disclaimer:</strong> Justice-Bot is not a law firm and does not provide legal advice. 
              This platform is designed to help users understand legal processes and prepare documentation. 
              For complex legal matters, consult with a qualified lawyer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;