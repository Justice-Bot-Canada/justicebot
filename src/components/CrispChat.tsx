import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

// Crisp Chat Widget - Free plan available, 3-5% conversion lift
export function CrispChat() {
  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "YOUR_CRISP_WEBSITE_ID"; // User needs to replace with their Crisp ID

    // Only load if ID is configured
    if (window.CRISP_WEBSITE_ID === "YOUR_CRISP_WEBSITE_ID") {
      console.log("Crisp Chat: Configure your website ID at https://crisp.chat");
      return;
    }

    // Load Crisp script
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    // Style customization
    window.$crisp.push(["config", "color:theme", ["blue"]]);
    window.$crisp.push(["config", "position:reverse", [true]]);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

export default CrispChat;
