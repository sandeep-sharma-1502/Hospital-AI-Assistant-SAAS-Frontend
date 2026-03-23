/**
 * Utility to suppress annoying third-party console errors that are outside 
 * of the application's control, such as Chrome extension conflicts.
 */

const EXTENSION_ERRORS = [
  "Could not establish connection. Receiving end does not exist.",
  "Unchecked runtime.lastError",
];

export function initErrorFilter() {
  const originalError = console.error;

  console.error = (...args) => {
    const errorString = args.join(" ");
    
    // Check if the error matches any known extension-related noise
    const isExtensionNoise = EXTENSION_ERRORS.some(msg => 
      errorString.includes(msg)
    );

    if (isExtensionNoise) {
      // Silently skip this error to keep the console clean
      return;
    }

    originalError.apply(console, args);
  };

  // Also catch unhandled promise rejections which often trigger this
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && EXTENSION_ERRORS.some(msg => 
      event.reason.message?.includes(msg) || String(event.reason).includes(msg)
    )) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Global error handler for similar string-based errors
  const originalWindowError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (EXTENSION_ERRORS.some(msg => String(message).includes(msg))) {
      return true; // Prevents the firing of the default event handler
    }
    if (originalWindowError) {
      return originalWindowError(message, source, lineno, colno, error);
    }
    return false;
  };
}
