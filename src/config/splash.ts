/**
 * Splash screen timing. Tweak these freely to find the right feel.
 * All values are in milliseconds.
 */
export const splashConfig = {
  /**
   * How long the splash stays on screen before it rolls up to reveal the site.
   * The castle, procession, and monogram finish arriving in the first ~3.5s,
   * then everything lingers until this total elapses. Try values between
   * 8000 and 10000 to taste.
   */
  durationMs: 9000,

  /** Do not show the splash again within this window, per browser. */
  showEveryMs: 1000 * 60 * 60 * 12,
};
