import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { DOMParser, Element as DOMElement } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Site configurations for different court form websites
const SITE_CONFIGS = {
  'ontariocourtforms': {
    baseUrl: 'https://ontariocourtforms.on.ca',
    endpoints: {
      family: '/en/family-forms/',
      smallClaims: '/en/small-claims-court-forms/',
      criminal: '/en/criminal-forms/',
      civil: '/en/civil-forms/'
    }
  },
  'tribunalsontario': {
    baseUrl: 'https://tribunalsontario.ca',
    endpoints: {
      ltb: '/ltb/forms/',
      hrto: '/hrto/forms-and-filing/'
    }
  }
};

interface ScrapedForm {
  form_code: string;
  title: string;
  description?: string;
  tribunal_type: string;
  category: string;
  pdf_url: string;
  price_cents: number;
  is_active: boolean;
  purchasable: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { site = 'ontariocourtforms', category } = await req.json();
    
    console.log(`Scraping court forms from ${site}...`);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate admin user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .is('revoked_at', null)
      .single();

    if (!adminData) {
      return new Response(JSON.stringify({ 
        error: 'Admin access required' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const siteConfig = SITE_CONFIGS[site as keyof typeof SITE_CONFIGS];
    if (!siteConfig) {
      throw new Error(`Unknown site: ${site}`);
    }

    const forms: ScrapedForm[] = [];
    
    // Scrape based on site type
    if (site === 'ontariocourtforms') {
      const categories = category ? [category] : Object.keys(siteConfig.endpoints);
      
      for (const cat of categories) {
        const endpoint = siteConfig.endpoints[cat as keyof typeof siteConfig.endpoints];
        if (endpoint) {
          const categoryForms = await scrapeOntarioCourtForms(
            siteConfig.baseUrl + endpoint,
            cat
          );
          forms.push(...categoryForms);
        }
      }
    } else if (site === 'tribunalsontario') {
      const categories = category ? [category] : Object.keys(siteConfig.endpoints);
      
      for (const cat of categories) {
        const endpoint = siteConfig.endpoints[cat as keyof typeof siteConfig.endpoints];
        if (endpoint) {
          const categoryForms = await scrapeTribunalsForms(
            siteConfig.baseUrl + endpoint,
            cat
          );
          forms.push(...categoryForms);
        }
      }
    }

    console.log(`Scraped ${forms.length} forms`);

    // Sync forms to database
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const formData of forms) {
      try {
        // Check if form exists
        const { data: existing } = await supabase
          .from('forms')
          .select('id')
          .eq('form_code', formData.form_code)
          .single();

        if (existing) {
          // Update existing form
          const { error: updateError } = await supabase
            .from('forms')
            .update({
              title: formData.title,
              description: formData.description,
              pdf_url: formData.pdf_url,
              tribunal_type: formData.tribunal_type,
              category: formData.category,
              price_cents: formData.price_cents,
              is_active: formData.is_active,
              purchasable: formData.purchasable,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          updated++;
          console.log(`Updated: ${formData.form_code}`);
        } else {
          // Create new form
          const { error: insertError } = await supabase
            .from('forms')
            .insert({
              form_code: formData.form_code,
              title: formData.title,
              description: formData.description,
              pdf_url: formData.pdf_url,
              tribunal_type: formData.tribunal_type,
              category: formData.category,
              price_cents: formData.price_cents,
              is_active: formData.is_active,
              purchasable: formData.purchasable,
              usage_count: 0
            });

          if (insertError) throw insertError;
          created++;
          console.log(`Created: ${formData.form_code}`);
        }
      } catch (error) {
        console.error(`Error processing ${formData.form_code}:`, error);
        errors++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total: forms.length,
        created,
        updated,
        errors
      },
      forms: forms.map(f => ({ code: f.form_code, title: f.title })),
      message: `Scrape complete: ${created} created, ${updated} updated, ${errors} errors`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scrape-court-forms:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scrapeOntarioCourtForms(url: string, category: string): Promise<ScrapedForm[]> {
  try {
    console.log(`Scraping Ontario forms from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML');
      return [];
    }

    const forms: ScrapedForm[] = [];
    
    // Try multiple selectors to find form links
    const linkSelectors = [
      'a[href$=".pdf"]',
      'a[href$=".docx"]',
      'a[href*="/static/media"]',
      '.form-link',
      'li a',
      'table a'
    ];

    for (const selector of linkSelectors) {
      const links = doc.querySelectorAll(selector);
      
      for (const link of links) {
        const element = link as DOMElement;
        const href = element.getAttribute?.('href');
        const text = element.textContent?.trim() || '';
        
        if (href && (href.includes('.pdf') || href.includes('.docx'))) {
          const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();
          
          // Extract form code from filename or text
          const formCodeMatch = text.match(/Form\s+(\d+[A-Z]?)/i) || 
                               href.match(/(\d+[A-Z]?)\.(pdf|docx)/i);
          
          const formCode = formCodeMatch ? 
            `ON-${category.toUpperCase()}-${formCodeMatch[1]}` : 
            `ON-${category.toUpperCase()}-${crypto.randomUUID().split('-')[0]}`;

          forms.push({
            form_code: formCode,
            title: text || `Form ${formCodeMatch?.[1] || 'Unknown'}`,
            description: extractDescription(element, doc),
            tribunal_type: getCategoryTribunal(category),
            category: category,
            pdf_url: fullUrl,
            price_cents: 0,
            is_active: true,
            purchasable: false
          });
        }
      }
      
      if (forms.length > 0) break; // Found forms with this selector
    }

    return forms;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return [];
  }
}

async function scrapeTribunalsForms(url: string, tribunal: string): Promise<ScrapedForm[]> {
  try {
    console.log(`Scraping Tribunals Ontario from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML');
      return [];
    }

    const forms: ScrapedForm[] = [];
    
    // Tribunals Ontario uses document links
    const links = doc.querySelectorAll('a[href*=".pdf"], a[href*="/documents/"]');
    
    for (const link of links) {
      const element = link as DOMElement;
      const href = element.getAttribute?.('href');
      const text = element.textContent?.trim() || '';
      
      if (href && text) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();
        
        // Extract form code (e.g., T2, L1, F1)
        const formCodeMatch = text.match(/([A-Z]\d+)/);
        const formCode = formCodeMatch ? 
          `ON-${tribunal.toUpperCase()}-${formCodeMatch[1]}` : 
          `ON-${tribunal.toUpperCase()}-${crypto.randomUUID().split('-')[0]}`;

        forms.push({
          form_code: formCode,
          title: text,
          description: extractDescription(element, doc),
          tribunal_type: getTribunalName(tribunal),
          category: tribunal,
          pdf_url: fullUrl,
          price_cents: 0,
          is_active: true,
          purchasable: false
        });
      }
    }

    return forms;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return [];
  }
}

function extractDescription(link: DOMElement, _doc: unknown): string {
  // Try to find description near the link
  const parent = link.parentElement;
  if (parent) {
    const nextSibling = parent.nextElementSibling;
    if (nextSibling && nextSibling.textContent) {
      return nextSibling.textContent.trim().substring(0, 200);
    }
    
    const parentText = parent.textContent?.trim();
    if (parentText && parentText.length > 50) {
      return parentText.substring(0, 200);
    }
  }
  
  return '';
}

function getCategoryTribunal(category: string): string {
  const map: Record<string, string> = {
    'family': 'Superior Court of Justice - Family Court',
    'smallClaims': 'Small Claims Court',
    'criminal': 'Ontario Court of Justice - Criminal Division',
    'civil': 'Superior Court of Justice - Civil Division'
  };
  return map[category] || 'Ontario Court';
}

function getTribunalName(tribunal: string): string {
  const map: Record<string, string> = {
    'ltb': 'Landlord and Tenant Board',
    'hrto': 'Human Rights Tribunal of Ontario'
  };
  return map[tribunal] || 'Tribunals Ontario';
}
