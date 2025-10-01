import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentTemplates from "@/components/DocumentTemplates";
import { FileText, Shield, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TemplateLibrary() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Document Templates</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Professional Legal Document Templates
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Download ready-to-use templates for letters, evidence organization, 
              witness statements, and more.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Fill-in-the-blank templates that guide you through each section
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Legally Sound</h3>
              <p className="text-sm text-muted-foreground">
                Created based on Ontario legal requirements and best practices
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Professional Format</h3>
              <p className="text-sm text-muted-foreground">
                Properly formatted documents that tribunals and courts expect
              </p>
            </Card>
          </div>

          <DocumentTemplates />
        </div>
      </main>
      <Footer />
    </div>
  );
}
