/**
 * Placeholder until generated for real:
 *
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 *
 * Keeping `Database = any` here (rather than omitting the generic)
 * so every call site already passes <Database> and needs no changes
 * once real types are dropped in.
 */
export type Database = any;
