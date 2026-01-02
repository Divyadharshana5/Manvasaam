"use client";

import { useState, useEffect, Component, ReactNode } from "react";
import Link from "next/link";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("HomePageSimple error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #f0fdf4, #f0f9ff)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "#e53e3e", marginBottom: "16px" }}>Oops!</h1>
            <p style={{ color: "#4b5563" }}>
              Something went wrong. Please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function HomePageSimpleContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #f0fdf4, #f0f9ff)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              animation: "spin 1s linear infinite",
              width: "48px",
              height: "48px",
              border: "4px solid #dcfce7",
              borderTop: "4px solid #16a34a",
              borderRadius: "50%",
              margin: "0 auto 16px",
            }}
          ></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#4b5563" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0fdf4, #f0f9ff, #f3f0ff)",
        padding: "32px 16px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Manvaasam
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          Empowering Farmers, Delivering Freshness
        </p>
        <p
          style={{
            color: "#6b7280",
          }}
        >
          Connect farmers, hubs, customers, and restaurants in a seamless
          agricultural marketplace.
        </p>
      </div>

      {/* Role Selection */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "48px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "48px",
            color: "#111827",
          }}
        >
          Join Our Community
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              name: "Farmer",
              desc: "Join our network to sell your produce directly.",
              href: "/login/farmer",
              color: "#16a34a",
            },
            {
              name: "Customer",
              desc: "Get fresh, organic products delivered to your doorstep.",
              href: "/login/retail",
              color: "#2563eb",
            },
            {
              name: "Hub Manager",
              desc: "Manage logistics and connect farmers to customers.",
              href: "/login/transport",
              color: "#9333ea",
            },
            {
              name: "Transport",
              desc: "Deliver fresh produce with our logistics network.",
              href: "/login/transport",
              color: "#ea580c",
            },
          ].map((role) => (
            <div
              key={role.href}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "24px",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  color: role.color,
                }}
              >
                {role.name}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                {role.desc}
              </p>
              <Link href={role.href}>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: role.color,
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Continue
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          paddingTop: "32px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          Our Mission
        </h3>
        <p
          style={{
            color: "#4b5563",
            lineHeight: "1.6",
          }}
        >
          Manvaasam connects you directly with local farmers through our trusted
          hub network, ensuring you receive the freshest organic products while
          supporting sustainable agriculture.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "48px",
          paddingTop: "32px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/privacy"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Privacy Policy
          </Link>
          <span style={{ color: "#9ca3af" }}>•</span>
          <Link
            href="/terms"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Terms of Service
          </Link>
          <span style={{ color: "#9ca3af" }}>•</span>
          <Link
            href="/support"
            style={{
              color: "#4b5563",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Support
          </Link>
        </div>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          © 2024 Manvaasam. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function HomePageSimple() {
  return (
    <ErrorBoundary>
      <HomePageSimpleContent />
    </ErrorBoundary>
  );
}
