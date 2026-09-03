import { prefillWhenReady } from "@/lib/form";

export const HELPDESK_FIELDS = ["no_registrasi", "nib", "judul", "deskripsi"] as const;

export function run(): void {
  // prefill only — never auto-submit
  void prefillWhenReady([...HELPDESK_FIELDS], { timeout: 8000 });
}
