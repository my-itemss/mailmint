"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import CreateMailbox from "@/components/CreateMailbox";
import LoginMailbox from "@/components/LoginMailbox";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import EmailList from "@/components/EmailList";
import ComposeModal from "@/components/ComposeModal";
import { getEmails } from "../../lib/api";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);

  const [mailbox, setMailbox] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  const [emails, setEmails] = useState<any[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);

  const [authMode, setAuthMode] = useState<"create" | "login">("login");

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ---------------- LOAD SAVED MAILBOX ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("mailbox");
    const savedName = localStorage.getItem("displayName");

    if (saved) setMailbox(saved);
    if (savedName) setDisplayName(savedName);
  }, []);

  /* ---------------- FETCH EMAILS ---------------- */
  useEffect(() => {
    if (!mailbox) return;

    const fetchEmails = async () => {
      const data = await getEmails(mailbox);
      setEmails(data);
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, [mailbox]);

  const handleAuthSuccess = (email: string, userDisplayName?: string) => {
    localStorage.setItem("mailbox", email);

    if (userDisplayName) {
      localStorage.setItem("displayName", userDisplayName);
      setDisplayName(userDisplayName);
    }

    setMailbox(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("mailbox");
    localStorage.removeItem("displayName");

    setMailbox(null);
    setDisplayName("");
    setAuthMode("login");
  };

  /* ---------------- LOADER ---------------- */
  if (!loadingDone) {
    return <Loader onFinish={() => setLoadingDone(true)} />;
  }

  /* ---------------- AUTH SCREEN ---------------- */

  if (!mailbox) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 px-6">
          <div className="hidden md:block max-w-lg">
            <h1 className="text-[#1877f2] text-6xl font-bold mb-4">mailmint</h1>
            <p className="text-2xl text-gray-800">
              Create temporary inboxes and access your messages instantly.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <div className="bg-white p-6 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex flex-col gap-4">
              {authMode === "login" ? (
                <LoginMailbox onLogin={handleAuthSuccess} />
              ) : (
                <CreateMailbox onCreated={handleAuthSuccess} />
              )}
              <div className="flex items-center mt-3">
  <hr className="flex-grow border-gray-300" />
  <span className="mx-2 text-gray-500">or</span>
  <hr className="flex-grow border-gray-300" />
</div>
              <div className="flex justify-center pt-2">
                {authMode === "login" ? (
                  <button
                    onClick={() => setAuthMode("create")}
                    className="bg-[#42b72a] hover:bg-[#36a420] text-white font-semibold px-6 py-3 rounded-lg text-sm w-fit"
                  >
                    Create new account
                  </button>
                ) : (
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Already have an account?
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN APP ---------------- */
  return (
    <div className="h-screen flex flex-col bg-[#f6f8fc]">
      {/* TOPBAR (FULL WIDTH) */}
      <Topbar
        email={mailbox}
        displayName={displayName}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onCompose={() => setComposeOpen(true)}
        />

        {/* EMAIL AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EmailList emails={emails} />
        </div>
      </div>

      {/* COMPOSE MODAL */}
      {composeOpen && (
        <ComposeModal
          from={mailbox}
          onClose={() => setComposeOpen(false)}
          onSent={async () => {
            const data = await getEmails(mailbox);
            setEmails(data);
          }}
        />
      )}
    </div>
  );
}
