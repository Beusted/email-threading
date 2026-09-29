// Renders an inline <script> for before-paint work (e.g. resolving the theme
// to avoid a flash) without tripping React's dev warning about script tags
// rendered by a component. It's a real executable script on the server, so it
// runs synchronously while the browser parses the HTML; on the client it's
// inert `text/plain` (where a rendered script would never execute anyway, since
// the work already happened during the initial parse). `suppressHydrationWarning`
// absorbs the resulting server/client `type` mismatch.
// See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
//
// SAFETY: `html` must be a static, developer-authored constant — never user
// input or otherwise untrusted data. It is injected verbatim via
// dangerouslySetInnerHTML, so any interpolated value would be an XSS vector.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
