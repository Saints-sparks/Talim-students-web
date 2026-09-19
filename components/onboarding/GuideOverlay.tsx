import type { TargetRect } from "@/lib/appGuide";

/**
 * The dimmed backdrop and the glowing frame around the element being explained.
 *
 * @param props - Component props.
 * @param props.rect - The target's box; without one only the backdrop shows.
 * @returns The overlay.
 */
export function GuideOverlay({ rect }: { rect: TargetRect | null }) {
  return (
    <>
      <div className="fixed inset-0 z-[999] bg-[#030E18]/35 backdrop-blur-[1px]" />
      {rect && (
        <div
          className="pointer-events-none fixed z-[1000] rounded-[22px] border-2 border-[#F4B740] shadow-[0_0_0_9999px_rgba(3,14,24,0.28),0_0_34px_rgba(244,183,64,0.66)] transition-all duration-200"
          style={{
            top: Math.max(rect.top - 8, 8),
            left: Math.max(rect.left - 8, 8),
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}
    </>
  );
}
