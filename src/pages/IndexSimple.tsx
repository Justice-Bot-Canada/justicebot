import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Simplified Index page for debugging deployment issues
 * This minimal version helps isolate if component loading is the problem
 */
const IndexSimple = () => {
  useEffect(() => {
    console.log('✅ IndexSimple component mounted successfully');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            Justice-Bot is Live! 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground">
            If you can see this message, your React app is working correctly.
          </p>

          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h2 className="text-2xl font-semibold">Deployment Status</h2>
            <div className="grid gap-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>React app is rendering</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Routing is working</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Cloudflare Pages deployment successful</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">Next Steps</h3>
            <ol className="text-left space-y-2 list-decimal list-inside">
              <li>Open browser console (F12) and check for any errors</li>
              <li>If you see this page, the app is working</li>
              <li>Check CLOUDFLARE_SETUP.md for deployment configuration</li>
              <li>The full site will load once all components are verified</li>
            </ol>
          </div>

          <a 
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IndexSimple;
