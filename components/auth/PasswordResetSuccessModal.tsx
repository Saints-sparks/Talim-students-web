"use client";

/**
 * The confirmation shown after a password reset completes, before redirecting
 * to sign-in.
 *
 * @param props - Component props.
 * @param props.visible - Whether the modal is showing.
 * @returns The modal element.
 */
export default function PasswordResetSuccessModal({ visible }: { visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`mx-4 max-w-md transform rounded-2xl bg-white p-8 text-center transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <div className="checkmark-container">
            <svg className="checkmark h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className="checkmark-path"
              />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-800">Password Reset Successful!</h2>
        <p className="mb-6 text-gray-600">
          Your password has been successfully updated. You will be redirected to the sign-in page.
        </p>

        <div className="flex justify-center space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#003366]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#003366]" style={{ animationDelay: "0.1s" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#003366]" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .checkmark-path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkmark 0.6s ease-in-out 0.3s forwards;
        }
        .checkmark-container {
          animation: scale-up 0.3s ease-in-out;
        }
        @keyframes scale-up {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
