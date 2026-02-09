"use client";

import { Component } from "react";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AlertTriangle } from "lucide-react";

/**
 * Error boundary for catching React errors and displaying a fallback UI.
 * Use to wrap route segments or feature components.
 *
 * @param {React.ReactNode} children - Child components
 * @param {React.ReactNode} [fallback] - Custom fallback UI (overrides default)
 * @param {string} [message] - Custom error message
 * @param {Function} [onRetry] - Called when user clicks "Try again" (also resets state)
 * @param {Function} [onGoHome] - Optional "Go to home" button handler
 * @param {string} [variant] - "default" | "page" - layout variant (page = full height)
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof window !== "undefined" && window.console?.error) {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPage = this.props.variant === "page";

      return (
        <div
          className={
            isPage
              ? "flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12"
              : "flex min-h-full flex-col items-center justify-center rounded-xl bg-danger-50/60 px-4 py-12 text-center sm:px-6 sm:py-16"
          }
          role="alert"
          aria-live="assertive"
          aria-label="Error"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 text-danger-600">
            <AlertTriangle className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="typography-h3 text-neutral-800">Something went wrong</h2>
          <p className="mt-2 max-w-sm typography-body text-neutral-600">
            {this.props.message ||
              "An unexpected error occurred. Please try again."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CustomButton
              text="Try again"
              variant="primary"
              onClick={this.handleRetry}
              className="rounded-lg px-5 py-2.5"
            />
            {this.props.onGoHome && (
              <CustomButton
                text="Go to home"
                variant="secondary"
                onClick={this.props.onGoHome}
                className="rounded-lg px-5 py-2.5"
              />
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  onGoHome: PropTypes.func,
  variant: PropTypes.oneOf(["default", "page"]),
};
