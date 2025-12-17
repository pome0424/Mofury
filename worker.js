export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { username, code } = await request.json();

    const scratchRes = await fetch(
      `https://api.scratch.mit.edu/users/${username}/comments?limit=20`
    );

    if (!scratchRes.ok) {
      return new Response(JSON.stringify({ ok: false }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const comments = await scratchRes.json();
    const matched = comments.some(c =>
      c.content && c.content.includes(code)
    );

    if (!matched) {
      return new Response(JSON.stringify({ ok: false }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const sbRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/login_codes?scratch_username=eq.${username}&code=eq.${code}&used=eq.false`,
      {
        headers: {
          "apikey": env.SUPABASE_KEY,
          "Authorization": `Bearer ${env.SUPABASE_KEY}`
        }
      }
    );

    const rows = await sbRes.json();
    if (rows.length === 0) {
      return new Response(JSON.stringify({ ok: false }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    await fetch(
      `${env.SUPABASE_URL}/rest/v1/login_codes?id=eq.${rows[0].id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": env.SUPABASE_KEY,
          "Authorization": `Bearer ${env.SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ used: true })
      }
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
