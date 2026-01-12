import { cookies, headers } from "next/headers";

export async function readCookie(name: string): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    // Use get() if available
    // @ts-ignore
    const val = cookieStore?.get?.(name)?.value;
    if (val) return val;
  } catch (e) {
    // ignore and try header fallback
  }

  try {
    const cookieHeader = headers()?.get?.("cookie") || "";
    if (cookieHeader) {
      const pairs = cookieHeader.split(";").map((s) => s.trim());
      for (const p of pairs) {
        const idx = p.indexOf("=");
        if (idx > -1) {
          const k = p.substring(0, idx);
          const v = p.substring(idx + 1);
          if (k === name) return decodeURIComponent(v);
        }
      }
    }
  } catch (e) {
    // final fallback
  }

  return undefined;
}

export default readCookie;
