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
import { motion, AnimatePresence } from "framer-motion";

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
       <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6">
      {/* Main Container with Material 3 Shadow */}
      <motion.div 
        layout
        className="w-full max-w-[1024px] min-h-[540px] bg-white rounded-[28px] shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col md:flex-row overflow-hidden"
      >
        
        {/* LEFT SIDE: Branding (Static) */}
        <div className="flex-1 p-10 md:p-14 flex flex-col">
          <div className="mb-auto">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 mb-8" 
              src="/log/mailmint.png" 
              alt="MailMint"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-[32px] md:text-[40px] font-normal text-[#1F1F1F] leading-tight tracking-tight mb-4">
                  {authMode === "login" ? "Sign in" : "Create account"}
                </h1>
                <p className="text-[#444746] text-lg font-normal">
                  {authMode === "login" ? "to continue to MailMint" : "Get your private mailbox"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden md:block text-gray-400 text-sm">
            MailMint Secure Infrastructure
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Form */}
        <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
          <div className="w-full max-w-[360px] mx-auto">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {authMode === "login" ? (
                  <LoginMailbox onLogin={handleAuthSuccess} />
                ) : (
                  <CreateMailbox onCreated={handleAuthSuccess} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setAuthMode(authMode === "login" ? "create" : "login")}
                className="w-full py-2.5 rounded-full border border-[#747775] text-[#0B57D0] text-sm font-semibold hover:bg-[#F1F3F4] transition-colors"
              >
                {authMode === "login" ? "Create an account" : "Sign in instead"}
              </button>
              
              <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
                Not your computer? Use Guest mode to sign in privately. <br/>
                <a href="#" className="text-[#0B57D0] font-medium hover:underline">Learn more</a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
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
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
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
            <EmailList
              emails={emails}
              mailbox={mailbox}
              onDeleted={(id) =>
                setEmails((prev) => prev.filter((m) => m._id !== id))
              }
            />
          )}

          {/* Sent */}
          {activeTab === "Sent" && (
            <SentEmailList
              emails={sentEmails}
              mailbox={mailbox}
              onDeleted={(id) =>
                setSentEmails((prev) => prev.filter((m) => m._id !== id))
              }
            />
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
