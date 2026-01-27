import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type FormSource = {
  id: string;
  jurisdiction: string;
  authority: string;
  source_url: string;
  last_checked_at: string | null;
  created_at: string | null;
};

type DocumentTemplate = {
  id: string;
  source_id: string | null;
  form_code: string;
  title: string;
  jurisdiction: string;
  template_type: string;
  version: string | null;
  created_at: string | null;
};

export default function AdminFormSources() {
  const [sources, setSources] = useState<FormSource[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data: sourcesData, error: sourcesErr } = await supabase
        .from("form_sources")
        .select("id,jurisdiction,authority,source_url,last_checked_at,created_at")
        .order("created_at", { ascending: false });

      if (sourcesErr) {
        if (!cancelled) setErr(`form_sources error: ${sourcesErr.message}`);
        if (!cancelled) setLoading(false);
        return;
      }

      const { data: templatesData, error: templatesErr } = await supabase
        .from("document_templates")
        .select("id,source_id,form_code,title,jurisdiction,template_type,version,created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (templatesErr) {
        if (!cancelled) setErr(`document_templates error: ${templatesErr.message}`);
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) {
        setSources((sourcesData ?? []) as FormSource[]);
        setTemplates((templatesData ?? []) as DocumentTemplate[]);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin: Form Sources & Templates</h1>
      <p style={{ opacity: 0.8 }}>
        Read-only sanity check: what sources exist, when they were last checked, and what templates are stored.
      </p>

      {loading && <p>Loading…</p>}
      {err && (
        <div style={{ padding: 12, border: "1px solid #ff6b6b", borderRadius: 8, marginTop: 12 }}>
          <strong>Data load failed:</strong>
          <div style={{ marginTop: 6 }}>{err}</div>
          <div style={{ marginTop: 10, opacity: 0.85 }}>
            If this says “permission denied” or “RLS”, we need a read policy (I’ll guide you).
          </div>
        </div>
      )}

      {!loading && !err && (
        <>
          <h2 style={{ marginTop: 20, fontSize: 18 }}>Form Sources ({sources.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Jurisdiction</th>
                  <th style={th}>Authority</th>
                  <th style={th}>Source URL</th>
                  <th style={th}>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.jurisdiction}</td>
                    <td style={td}>{s.authority}</td>
                    <td style={td}>
                      <a href={s.source_url} target="_blank" rel="noreferrer">
                        {s.source_url}
                      </a>
                    </td>
                    <td style={td}>{s.last_checked_at ? new Date(s.last_checked_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {sources.length === 0 && (
                  <tr>
                    <td style={td} colSpan={4}>
                      No rows yet. (That’s okay — you can insert sources next.)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: 24, fontSize: 18 }}>Document Templates (latest {templates.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Form Code</th>
                  <th style={th}>Title</th>
                  <th style={th}>Jurisdiction</th>
                  <th style={th}>Version</th>
                  <th style={th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td style={td}>{t.form_code}</td>
                    <td style={td}>{t.title}</td>
                    <td style={td}>{t.jurisdiction}</td>
                    <td style={td}>{t.version ?? "—"}</td>
                    <td style={td}>{t.created_at ? new Date(t.created_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr>
                    <td style={td} colSpan={5}>
                      No templates yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid #333",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #222",
  verticalAlign: "top",
};
