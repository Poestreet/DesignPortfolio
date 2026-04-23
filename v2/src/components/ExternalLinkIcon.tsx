/**
 * ExternalLinkIcon — icône de lien externe (lucide: external-link)
 * Composant centralisé : modifier ici applique le changement partout.
 */
interface ExternalLinkIconProps {
  size?: number;
}

export function ExternalLinkIcon({ size = 14 }: ExternalLinkIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fafafa"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }}
    >
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  );
}
