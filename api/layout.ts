import { get, put } from "@vercel/blob";

const CONFIG_PATH = "futurefabric/layout.json";
const MAX_PAYLOAD_BYTES = 256 * 1024;

interface LayoutPayload {
  version: 1;
  storage: Record<string, string>;
}

function isLayoutPayload(value: unknown): value is LayoutPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<LayoutPayload>;
  return payload.version === 1 && !!payload.storage && typeof payload.storage === "object" && !Array.isArray(payload.storage);
}

export async function GET() {
  const blob = await get(CONFIG_PATH, { access: "private", useCache: false });

  if (!blob) {
    return Response.json({ version: 1, storage: {} } satisfies LayoutPayload);
  }

  const response = await new Response(blob.stream).json();
  if (!isLayoutPayload(response)) {
    return Response.json({ error: "Stored layout payload is invalid." }, { status: 502 });
  }

  return Response.json(response, { headers: { "cache-control": "no-store" } });
}

export async function PUT(request: Request) {
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_PAYLOAD_BYTES) {
    return Response.json({ error: "Layout payload is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "Layout payload must be valid JSON." }, { status: 400 });
  }

  if (!isLayoutPayload(payload)) {
    return Response.json({ error: "Layout payload is invalid." }, { status: 400 });
  }

  await put(CONFIG_PATH, JSON.stringify(payload), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return Response.json({ ok: true });
}
