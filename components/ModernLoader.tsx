"use client";

import Image from "next/image";

interface ModernLoaderProps {
  visible: boolean;
}

const talimLetters = ["T", "a", "l", "i", "m"];

const ModernLoader: React.FC<ModernLoaderProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-[#071024] dark:via-[#0B1224] dark:to-[#111C31]"
      role="status"
      aria-live="polite"
      aria-label="Signing in"
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-400 blur-xl animate-talim-glow" />
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-2xl animate-talim-logo">
            <Image
              src="/icons/login/tree.svg"
              alt="Talim Logo"
              width={48}
              height={48}
              className="h-12 w-12 brightness-0 invert"
              priority
            />
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {talimLetters.map((letter, index) => (
            <span
              key={letter}
              className="text-4xl font-bold text-gray-800 dark:text-white animate-talim-letter"
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-300 animate-talim-dot"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes talim-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes talim-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes talim-letter {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-10px); opacity: 1; }
        }

        @keyframes talim-dot {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .animate-talim-glow {
          animation: talim-glow 2s ease-in-out infinite;
        }

        .animate-talim-logo {
          animation: talim-logo 2s ease-in-out infinite;
        }

        .animate-talim-letter {
          animation: talim-letter 1.5s ease-in-out infinite;
        }

        .animate-talim-dot {
          animation: talim-dot 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernLoader;
