import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // This handles BOTH signup verification and magic links
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/welcome");
        return;
      }

      if (data.session) {
        // Success — user verified or logged in
        navigate("/dashboard");
      } else {
        // No session — fallback
        navigate("/welcome");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Verifying your account…</h1>
      <p>Please wait.</p>
    </div>
  );
};

export default Callback;
