// Very simple language detection based on character ranges.
// Returns "Sinhala", "Tamil", or "English"
export function detectLanguage(text: string): "Sinhala" | "Tamil" | "English" {
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    // Sinhala block: U+0D80–U+0DFF (3456–3583)
    if (code >= 3456 && code <= 3583) return "Sinhala";
    // Tamil block: U+0B80–U+0BFF (2944–3071)
    if (code >= 2944 && code <= 3071) return "Tamil";
  }
  // fallback
  return "English";
}
