"use client";

import { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import CreateMailbox from "@/components/CreateMailbox";
import LoginMailbox from "@/components/LoginMailbox";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import EmailList from "@/components/EmailList";
import SentEmailList from "@/components/SentEmailList";
import ComposeModal from "@/components/ComposeModal";

import { getEmails, getSentEmails } from "../../lib/api";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);

  const [mailbox, setMailbox] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  const [emails, setEmails] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);

  const [composeOpen, setComposeOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"create" | "login">("login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState("Inbox");

  /* ---------------- LOAD SAVED MAILBOX ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("mailbox");
    const savedName = localStorage.getItem("displayName");

    if (saved) setMailbox(saved);
    if (savedName) setDisplayName(savedName);
  }, []);

  /* ---------------- FETCH INBOX ---------------- */
  useEffect(() => {
    if (!mailbox) return;

    const fetchInbox = async () => {
      const data = await getEmails(mailbox);
      setEmails(data);
    };

    fetchInbox();

    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, [mailbox]);

  /* ---------------- FETCH SENT ---------------- */
  useEffect(() => {
    if (!mailbox) return;

    const fetchSent = async () => {
      const data = await getSentEmails(mailbox);
      setSentEmails(data);
    };

    fetchSent();
  }, [mailbox]);

  /* ---------------- AUTH SUCCESS ---------------- */
  const handleAuthSuccess = (email: string, userDisplayName?: string) => {
    localStorage.setItem("mailbox", email);

    if (userDisplayName) {
      localStorage.setItem("displayName", userDisplayName);
      setDisplayName(userDisplayName);
    }

    setMailbox(email);
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("mailbox");
    localStorage.removeItem("displayName");

    setMailbox(null);
    setDisplayName("");
    setAuthMode("login");
  };

  if (!loadingDone) {
    return <Loader onFinish={() => setLoadingDone(true)} />;
  }

  /* ---------------- AUTH SCREEN ---------------- */
  if (!mailbox) {
    return (
      <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">

          <div className="flex flex-col md:flex-row gap-10">

            {/* Left */}
            <div className="flex-1">
              <img
                className="w-11 mb-4"
                src="/log/mailmint.png"
              />

              <h1 className="text-4xl font-medium text-gray-900 mb-4">
                {authMode === "login" ? "Sign in" : "Create account"}
              </h1>

              <p className="text-gray-600 text-sm">
                {authMode === "login"
                  ? "Use your MailMint account"
                  : "Create a temporary mailbox instantly"}
              </p>
            </div>

            {/* Right */}
            <div className="flex-1">

              {authMode === "login" ? (
                <LoginMailbox onLogin={handleAuthSuccess} />
              ) : (
                <CreateMailbox onCreated={handleAuthSuccess} />
              )}

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "create" : "login")
                  }
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {authMode === "login"
                    ? "Create an account"
                    : "Already have an account?"}
                </button>
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

      <Topbar
        email={mailbox}
        displayName={displayName}
        onLogout={handleLogout}
        onToggleSidebar={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar
          collapsed={sidebarCollapsed}
          activeItem={activeTab}
          setActiveItem={setActiveTab}
          onCompose={() => setComposeOpen(true)}
        />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-3xl shadow-sm border-l border-t border-gray-100">

          {/* Inbox */}
          {activeTab === "Inbox" && (
            <EmailList emails={emails} />
          )}

          {/* Sent */}
          {activeTab === "Sent" && (
            <SentEmailList emails={sentEmails} />
          )}

          {/* Empty other tabs */}
          {activeTab !== "Inbox" && activeTab !== "Sent" && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4 opacity-20">📁</div>
              <h2 className="text-xl font-medium">
                {activeTab} folder is empty
              </h2>
              <p className="text-sm">
                There are no messages in this category yet.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* COMPOSE */}
      {composeOpen && (
        <ComposeModal
          from={mailbox}
          onClose={() => setComposeOpen(false)}
          onSent={async () => {
            const inbox = await getEmails(mailbox);
            const sent = await getSentEmails(mailbox);

            setEmails(inbox);
            setSentEmails(sent);
          }}
        />
      )}
    </div>
  );
}