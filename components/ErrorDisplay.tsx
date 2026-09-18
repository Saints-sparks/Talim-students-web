import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetryButton?: boolean;
  variant?: "default" | "network" | "auth" | "server";
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "Something went wrong",
  showRetryButton = true,
  variant = "default",
}: ErrorDisplayProps) {
  // Determine error type and customize message
  const getErrorInfo = (errorMessage: string, variant: string) => {
    const lowerError = errorMessage.toLowerCase();

    if (
      variant === "network" ||
      lowerError.includes("network") ||
      lowerError.includes("fetch")
    ) {
      return {
        icon: <WifiOff className="h-5 w-5" />,
        title: "Connection Problem",
        message:
          "Unable to connect to our servers. Please check your internet connection.",
        suggestion: "Check your internet connection and try again",
      };
    }

    if (
      variant === "auth" ||
      lowerError.includes("unauthorized") ||
      lowerError.includes("token") ||
      lowerError.includes("authentication")
    ) {
      return {
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "Authentication Issue",
        message: "Your session may have expired. Please log in again.",
        suggestion: "Try refreshing the page or logging in again",
      };
    }

    if (
      variant === "server" ||
      lowerError.includes("500") ||
      lowerError.includes("server")
    ) {
      return {
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "Server Error",
        message:
          "Our servers are experiencing issues. We're working to fix this.",
        suggestion: "Please try again in a few moments",
      };
    }

    // Default error
    return {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: title,
      message: "We encountered an issue while loading your data.",
      suggestion: "Please try again",
    };
  };

  const errorInfo = getErrorInfo(error, variant);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        <div className="text-red-600">{errorInfo.icon}</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {errorInfo.title}
        </h3>
        <p className="text-gray-600 max-w-md">{errorInfo.message}</p>
      </div>
    </div>
  );
}

// Compact error display for smaller spaces
export function CompactErrorDisplay({
  error,
  onRetry,
  showRetryButton = true,
}: Pick<ErrorDisplayProps, "error" | "onRetry" | "showRetryButton">) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <p className="text-sm font-medium text-red-800">
            Unable to load data
          </p>
          <p className="text-xs text-red-600">Please try again</p>
        </div>
      </div>

      {showRetryButton && onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}
