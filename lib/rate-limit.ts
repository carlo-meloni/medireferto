import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

function isConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function createRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export const loginLimiter = isConfigured()
  ? new Ratelimit({
      redis: createRedis(),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "rl:login",
    })
  : null;

export const registerLimiter = isConfigured()
  ? new Ratelimit({
      redis: createRedis(),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:register",
    })
  : null;

export async function getIP(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<RateLimitResult> {
  if (!limiter) return { allowed: true };

  try {
    const { success, reset } = await limiter.limit(key);
    if (success) return { allowed: true };

    const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
    return { allowed: false, retryAfterSeconds };
  } catch {
    return { allowed: true };
  }
}
