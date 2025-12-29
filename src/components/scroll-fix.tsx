"use client";

import { useEffect } from "react";

export function ScrollFix() {
  useEffect(() => {
    // Check if we're on the client side
    if (typeof document === "undefined") return;

    // Ultra-aggressive scrollbar hiding
    const hideScrollbars = () => {
      // Force hide scrollbars with inline styles (highest priority)
      const elements = [document.documentElement, document.body];

      elements.forEach((element) => {
        if (element) {
          element.style.setProperty("scrollbar-width", "none", "important");
          element.style.setProperty("-ms-overflow-style", "none", "important");
          element.style.setProperty("overflow-y", "auto", "important");
          element.style.setProperty("overflow-x", "hidden", "important");
        }
      });

      // Add CSS to hide webkit scrollbars
      const style = document.createElement("style");
      style.textContent = `
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        *::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        html, body, * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `;
      document.head.appendChild(style);

      // Add classes to ensure scrollbar hiding
      document.documentElement.classList.add(
        "hide-scrollbar",
        "no-scrollbar",
        "scrollbar-hidden"
      );
      document.body.classList.add(
        "hide-scrollbar",
        "no-scrollbar",
        "scrollbar-hidden"
      );

      // Find and update all containers
      const containers = document.querySelectorAll(
        '.mobile-container, .scrollable-container, .home-page, [data-page="home"]'
      );
      containers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.setProperty("scrollbar-width", "none", "important");
          container.style.setProperty(
            "-ms-overflow-style",
            "none",
            "important"
          );
          container.classList.add(
            "hide-scrollbar",
            "no-scrollbar",
            "scrollbar-hidden"
          );
        }
      });
    };

    // Apply immediately
    hideScrollbars();

    // Apply after DOM changes
    const observer = new MutationObserver(() => {
      hideScrollbars();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Apply after any navigation or route changes
    const handleRouteChange = () => {
      setTimeout(hideScrollbars, 10);
      setTimeout(hideScrollbars, 100);
      setTimeout(hideScrollbars, 500);
    };

    // Listen for all possible events that might affect scrollbars
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);
    window.addEventListener("load", hideScrollbars);
    window.addEventListener("resize", hideScrollbars);
    document.addEventListener("DOMContentLoaded", hideScrollbars);

    // Continuous monitoring to ensure scrollbars stay hidden
    const continuousHiding = setInterval(() => {
      hideScrollbars();

      // Remove any overflow hidden styles that might block scrolling
      const elementsWithHiddenOverflow = document.querySelectorAll(
        '[style*="overflow: hidden"], [style*="overflow-y: hidden"]'
      );
      elementsWithHiddenOverflow.forEach((element) => {
        if (
          element instanceof HTMLElement &&
          !element.classList.contains("dropdown-menu")
        ) {
          element.style.setProperty("overflow-y", "auto", "important");
          element.style.setProperty("scrollbar-width", "none", "important");
          element.style.setProperty("-ms-overflow-style", "none", "important");
        }
      });
    }, 100);

    return () => {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        window.removeEventListener("popstate", handleRouteChange);
        window.removeEventListener("beforeunload", handleRouteChange);
        window.removeEventListener("load", hideScrollbars);
        window.removeEventListener("resize", hideScrollbars);
        document.removeEventListener("DOMContentLoaded", hideScrollbars);
        observer.disconnect();
        clearInterval(continuousHiding);
      }
    };
  }, []);

  return null;
}
