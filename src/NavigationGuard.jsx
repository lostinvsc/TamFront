import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationGuard = ({ when, message }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const handleBeforeRouteChange = (e) => {
      if (when && !window.confirm(message)) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("popstate", handleBeforeRouteChange);
    window.history.pushState = function (...args) {
      if (when && !window.confirm(message)) return;
      return originalPushState.apply(this, args);
    };
    window.history.replaceState = function (...args) {
      if (when && !window.confirm(message)) return;
      return originalReplaceState.apply(this, args);
    };

    return () => {
      window.removeEventListener("popstate", handleBeforeRouteChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [when, message]);

  return null;
};

export default NavigationGuard;
