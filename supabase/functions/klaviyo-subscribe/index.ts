import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source?: string;
  listId?: string;
  properties?: Record<string, any>;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const KLAVIYO_PRIVATE_KEY = Deno.env.get("KLAVIYO_PRIVATE_KEY");
    
    if (!KLAVIYO_PRIVATE_KEY) {
      console.error("KLAVIYO_PRIVATE_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Klaviyo not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, firstName, lastName, phone, source, listId, properties } = await req.json() as SubscribeRequest;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default list ID for Justice-Bot subscribers
    const targetListId = listId || Deno.env.get("KLAVIYO_DEFAULT_LIST_ID");

    // Create or update profile
    const profilePayload = {
      data: {
        type: "profile",
        attributes: {
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          properties: {
            source: source || "website",
            signup_date: new Date().toISOString(),
            ...properties
          }
        }
      }
    };

    // Create/update profile
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        "Content-Type": "application/json",
        "revision": "2024-02-15"
      },
      body: JSON.stringify(profilePayload)
    });

    let profileId: string;

    if (profileResponse.status === 201) {
      const profileData = await profileResponse.json();
      profileId = profileData.data.id;
      console.log("Created new Klaviyo profile:", profileId);
    } else if (profileResponse.status === 409) {
      // Profile exists, get the ID from the error response
      const errorData = await profileResponse.json();
      profileId = errorData.errors?.[0]?.meta?.duplicate_profile_id;
      console.log("Profile already exists:", profileId);
      
      // Update existing profile
      if (profileId) {
        await fetch(`https://a.klaviyo.com/api/profiles/${profileId}/`, {
          method: "PATCH",
          headers: {
            "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
            "Content-Type": "application/json",
            "revision": "2024-02-15"
          },
          body: JSON.stringify({
            data: {
              type: "profile",
              id: profileId,
              attributes: profilePayload.data.attributes
            }
          })
        });
      }
    } else {
      const errorText = await profileResponse.text();
      console.error("Klaviyo profile error:", errorText);
      throw new Error(`Failed to create profile: ${errorText}`);
    }

    // Subscribe to list if list ID provided
    if (targetListId && profileId) {
      const subscribeResponse = await fetch(`https://a.klaviyo.com/api/lists/${targetListId}/relationships/profiles/`, {
        method: "POST",
        headers: {
          "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
          "Content-Type": "application/json",
          "revision": "2024-02-15"
        },
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }]
        })
      });

      if (!subscribeResponse.ok) {
        console.warn("Failed to add to list, but profile was created");
      } else {
        console.log("Added profile to list:", targetListId);
      }
    }

    return new Response(
      JSON.stringify({ success: true, profileId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Klaviyo subscribe error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
