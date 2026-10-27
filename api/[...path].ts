
import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_ORIGIN = "https://ts.idicorp.ir";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const requestPath = req.url ?? "/api";
  const targetUrl = new URL(requestPath, API_ORIGIN);

  const headers = new Headers();

  // Forward request headers needed for authentication.
  const authorization = req.headers.authorization;
  const cookie = req.headers.cookie;
  const contentType = req.headers["content-type"];

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (cookie) {
    headers.set("cookie", cookie);
  }

  if (contentType) {
    headers.set("content-type", contentType);
  }

  try {
    const hasBody = !["GET", "HEAD"].includes(req.method ?? "GET");

    let body: string | undefined;

    if (hasBody && req.body !== undefined) {
      body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body);
    }

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });

    res.status(upstream.status);

    // Rewrite upstream cookies for the Vercel host.
    const setCookies = upstream.headers.getSetCookie();

    if (setCookies.length > 0) {
      res.setHeader(
        "Set-Cookie",
        setCookies.map((value) =>
          value.replace(/;\s*Domain=ts\.idicorp\.ir/gi, ""),
        ),
      );
    }

    const responseType = upstream.headers.get("content-type");

    if (responseType) {
      res.setHeader("Content-Type", responseType);
    }

    const cacheControl = upstream.headers.get("cache-control");

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const responseBody = Buffer.from(await upstream.arrayBuffer());
    return res.send(responseBody);
  } catch (error) {
    console.error("API proxy error:", error);
    return res.status(502).json({ detail: "API proxy failed" });
  }
}
