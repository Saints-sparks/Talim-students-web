/**
 * Chat media kit — one voice note plays at a time.
 *
 * Every `VoicePlayer` registers here when it starts; the one that was
 * playing before is paused.
 */

export interface PausablePlayer {
  pause(): void;
}

export interface ActivePlayerController {
  /** `player` starts playing: pauses whichever other player was active. */
  activate(player: PausablePlayer): void;
  /** `player` stopped (paused, ended, unmounted). */
  release(player: PausablePlayer): void;
  /** The player playing now, if any. */
  current(): PausablePlayer | null;
}

export function createActivePlayerController(): ActivePlayerController {
  let active: PausablePlayer | null = null;
  return {
    activate(player) {
      if (active && active !== player) {
        const previous = active;
        active = player;
        try {
          previous.pause();
        } catch {
          // A player that fails to pause must not stop the new one.
        }
        return;
      }
      active = player;
    },
    release(player) {
      if (active === player) active = null;
    },
    current() {
      return active;
    },
  };
}

/** The page-wide controller every `VoicePlayer` uses. */
export const activePlayerController = createActivePlayerController();
