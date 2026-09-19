/**
 * Utility functions for generating consistent colors and initials
 * Used across the chat system for Google-style avatars
 */

// Material colors dark enough for white avatar text and for names on a white
// bubble: every entry has at least 4.5:1 contrast against white (WCAG AA), which
// the lighter 400/500 shades (lime, amber, light green …) did not.
export const MATERIAL_COLORS = [
  "#D32F2F", // Red 700
  "#C2185B", // Pink 700
  "#7B1FA2", // Purple 700
  "#512DA8", // Deep Purple 700
  "#303F9F", // Indigo 700
  "#1976D2", // Blue 700
  "#0277BD", // Light Blue 800
  "#00838F", // Cyan 800
  "#00695C", // Teal 800
  "#2E7D32", // Green 800
  "#33691E", // Light Green 900
  "#827717", // Lime 900
  "#9A5B00", // Amber, darkened
  "#BF360C", // Deep Orange 900
  "#6D4C41", // Brown 600
  "#455A64", // Blue Grey 700
];

/**
 * Generate a consistent Google-style Material color based on a string
 * The same string will always produce the same color
 */
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colorIndex = Math.abs(hash) % MATERIAL_COLORS.length;
  return MATERIAL_COLORS[colorIndex];
}

/**
 * Extract initials from a name for avatar display
 * Returns up to 2 characters in uppercase
 */
export function getUserInitials(name?: string): string {
  if (!name) return 'U';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  } else if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  
  return 'U';
}

/**
 * Get avatar props for consistent styling across the app
 */
export function getAvatarProps(name?: string, avatar?: string) {
  const initials = getUserInitials(name);
  const backgroundColor = generateColorFromString(name || 'Unknown');
  
  return {
    initials,
    backgroundColor,
    hasImage: !!avatar,
  };
}
