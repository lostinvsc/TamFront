import { useEffect } from "react";

const useUnsavedChangesWarning = (shouldWarn) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldWarn) return;
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldWarn]);
};

export default useUnsavedChangesWarning;
