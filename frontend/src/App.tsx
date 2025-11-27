import { useEffect, useState } from "react";
import ClaimEnvelope from "./pages/ClaimEnvelope";
import SendEnvelope from "./pages/SendEnvelope";
import NetworkWalletBar from "./components/NetworkWalletBar";
import "./App.css";

type RouteState =
  | { page: "send" }
  | {
      page: "claim";
      envelopeId: string;
    };

const parseRoute = (pathname: string): RouteState => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const claimMatch = normalized.match(/^\/claim\/([^/]+)$/);

  if (claimMatch) {
    return { page: "claim", envelopeId: decodeURIComponent(claimMatch[1]) };
  }

  return { page: "send" };
};

function App() {
  const [route, setRoute] = useState<RouteState>(() =>
    parseRoute(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (next: RouteState) => {
    if (next.page === "send") {
      window.history.pushState({}, "", "/");
      setRoute({ page: "send" });
      return;
    }

    const encodedId = encodeURIComponent(next.envelopeId.trim() || "demo-id");
    window.history.pushState({}, "", `/claim/${encodedId}`);
    setRoute({ page: "claim", envelopeId: encodedId });
  };

  return (
    <div className="page-shell">
      <div className="aurora" aria-hidden />
      <header className="top-bar">
        <div className="brand">
          <span className="dot" />
          链上红包
        </div>
        <div className="top-actions">
          <NetworkWalletBar/>
          {route.page === "claim" && (
            <button
              className="ghost-button"
              onClick={() => navigate({ page: "send" })}
            >
              回到发红包
            </button>
          )}
        </div>
      </header>

      {route.page === "send" ? (
        <SendEnvelope
          onPreviewClaim={(id) => navigate({ page: "claim", envelopeId: id })}
        />
      ) : (
        <ClaimEnvelope
          envelopeId={route.envelopeId}
          onBack={() => navigate({ page: "send" })}
        />
      )}
    </div>
  );
}

export default App;
