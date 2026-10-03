/**
 * Self-host convenience: a local Docker instance has no Clerk/Convex
 * entitlement backend, so premium panels stay behind a "Sign In" CTA that can
 * never succeed. When the image is built with VITE_SELFHOST_PRO_KEY — a local
 * enterprise key already present in the server's WORLDMONITOR_VALID_KEYS —
 * establish the browser tester session on boot so the operator gets their own
 * instance's premium surfaces without pasting the key into DevTools.
 *
 * Deliberately opt-in and build-time only:
 *   - no VITE_SELFHOST_PRO_KEY -> nothing happens (default for hosted builds)
 *   - key present but Clerk configured -> hosted auth wins, key ignored
 *
 * The key ends up in the client bundle, so only bake it into images that are
 * not publicly reachable. Public deployments should use the hosted auth flow
 * or hand out keys deliberately.
 */
import { isClerkAuthEnabled } from '@/services/clerk';
import { setProKey } from '@/services/widget-store';

export function seedSelfHostProKey(): void {
  const key = import.meta.env.VITE_SELFHOST_PRO_KEY?.trim();
  if (!key || isClerkAuthEnabled()) return;
  setProKey(key);
}
