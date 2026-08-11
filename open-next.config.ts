import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Default in-memory/ISR caching is fine to start with. Once traffic is
  // real, swap in the R2 or KV incremental cache adapter here — see
  // https://opennext.js.org/cloudflare/caching for the current API.
});
