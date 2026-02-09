/**
 * Custom hook for Modal component functionality
 * @param size - Modal size variant
 * @param height - Modal height variant
 * @param customHeight - Custom height value
 * @param variant - Modal visual variant
 * @param onClose - Close handler function
 * @param closeOnBackdropClick - Whether backdrop click closes modal
 * @returns Modal utility functions and state
 */

export default function useModal({
  size,
  height,
  customHeight,
  variant,
  onClose,
  closeOnBackdropClick,
}) {
  // Get modal size classes (responsive: full width minus margin on mobile)
  const getModalSizeClasses = () => {
    const sizeClasses = {
      sm: "w-[calc(100vw-2rem)] max-w-sm sm:w-full", // 384px
      md: "w-[calc(100vw-2rem)] max-w-md sm:w-full", // 448px
      lg: "w-[calc(100vw-2rem)] max-w-2xl sm:w-full", // 672px
      xl: "w-[calc(100vw-2rem)] max-w-4xl sm:w-full", // 896px
      full: "w-[calc(100vw-2rem)] max-w-7xl sm:w-full", // Almost full screen
    };

    return sizeClasses[size] || sizeClasses.md;
  };

  // Get modal height classes
  const getModalHeightClasses = () => {
    const heightClasses = {
      auto: "max-h-[90vh]",
      full: "h-[90vh]",
      custom: customHeight ? `h-[${customHeight}]` : "max-h-[90vh]",
    };

    return heightClasses[height] || heightClasses.auto;
  };

  // Get header classes based on variant
  const getHeaderClasses = () => {
    const baseClasses = "modal-header";

    const variantClasses = {
      default: "bg-primary-500 text-white",
      danger: "bg-danger-500 text-white",
      success: "bg-success-500 text-white",
      warning: "bg-warning-500 text-white",
    };

    return `${baseClasses} ${variantClasses[variant] || variantClasses.default}`;
  };

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (!closeOnBackdropClick || !onClose) return;

    // Only close if clicking the backdrop, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && onClose) {
      onClose();
    }
  };

  return {
    getModalSizeClasses,
    getModalHeightClasses,
    getHeaderClasses,
    handleBackdropClick,
    handleKeyDown,
  };
}
