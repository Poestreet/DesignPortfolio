// ── Shared animation constants & types ────────────────────────────────────────
//
// Single source of truth for all Framer Motion / CSS transition values.
// Page-specific values (CHARS_PER_TICK, TYPING_START_DELAY on homepage) stay
// co-located with their component.

// Phase state machine used by binary typing sequences
export type Phase = "idle" | "typing" | "revealing" | "done";

// Cubic-bezier shared across every transition in the project
export const EASE = [0.4, 0, 0.05, 1] as const;
// Typed tuple form required by Framer Motion's transition.ease
export const EASE_TUPLE = [0.4, 0, 0.05, 1] as [number, number, number, number];

// Binary typing engine
export const TICK_MS = 16; // ~60fps interval

// Fade durations (ms)
export const BG_FADE_DURATION    = 700; // AnimatedBackground crossfade (Homepage)
export const PHOTO_FADE_DURATION = 600; // Photo / hero image crossfade (About, Cases)

// Text reveal timing (ms)
export const TEXT_REVEAL_DELAY  = 350;  // delay after photo fade before text appears
export const TYPING_START_DELAY = 1400; // delay before binary typing starts (About, Cases)
