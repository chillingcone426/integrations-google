import * as Sentry from "@sentry/cloudflare";

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handleRequest(request, env) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        "content-type": "application/json",
        allow: "POST",
      },
    });
  }

  if (request.headers.get("X-Tickets-Auth") !== env.GOOGLEDOCS_AUTH_KEY) {
    return jsonResponse(401, { error: "Invalid auth key" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request body" });
  }

  // Placeholder response so the Worker can be deployed and wired before
  // Google Sheets writing is implemented.
  return jsonResponse(501, {
    error: "Google Docs integration is not implemented yet",
    received: body,
  });
}

export default Sentry.withSentry(
  (env) => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
  }),
  {
    async fetch(request, env) {
      return handleRequest(request, env);
    },
  },
);
