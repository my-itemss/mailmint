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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState("Inbox");

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

  if (!loadingDone) return <Loader onFinish={() => setLoadingDone(true)} />;

  /* ---------------- AUTH SCREEN ---------------- */
  // if (!mailbox) {
  //   return (
  //     <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
  //       <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 px-6">
  //         <div className="hidden md:block max-w-lg">
  //           <h1 className="text-[#1877f2] text-6xl font-bold mb-4">mailmint</h1>
  //           <p className="text-2xl text-gray-800">Create temporary inboxes and access your messages instantly.</p>
  //         </div>
  //         <div className="w-full max-w-sm">
  //           <div className="bg-white p-6 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex flex-col gap-4">
  //             {authMode === "login" ? <LoginMailbox onLogin={handleAuthSuccess} /> : <CreateMailbox onCreated={handleAuthSuccess} />}
  //             <div className="flex items-center mt-3">
  //               <hr className="flex-grow border-gray-300" /><span className="mx-2 text-gray-500">or</span><hr className="flex-grow border-gray-300" />
  //             </div>
  //             <div className="flex justify-center pt-2">
  //               <button
  //                 onClick={() => setAuthMode(authMode === "login" ? "create" : "login")}
  //                 className={authMode === "login" ? "bg-[#42b72a] hover:bg-[#36a420] text-white font-semibold px-6 py-3 rounded-lg text-sm" : "text-sm text-blue-600 font-medium hover:underline"}
  //               >
  //                 {authMode === "login" ? "Create new account" : "Already have an account?"}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  if (!mailbox) {
  return (
    <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
      
      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left Section */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-3xl font-semibold text-gray-800 mb-2">
                mailmint
              </div>

              <h1 className="text-2xl font-medium text-gray-900 mb-2">
                {authMode === "login" ? "Sign in" : "Create account"}
              </h1>

              <p className="text-gray-600 text-sm">
                {authMode === "login"
                  ? "Use your MailMint account"
                  : "Create a temporary mailbox instantly"}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1">

            {authMode === "login" ? (
              <LoginMailbox onLogin={handleAuthSuccess} />
            ) : (
              <CreateMailbox onCreated={handleAuthSuccess} />
            )}

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Switch Mode */}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "create" : "login")
              }
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              {authMode === "login"
                ? "Create account"
                : "Already have an account?"}
            </button>

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
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeItem={activeTab}
          setActiveItem={setActiveTab}
          onCompose={() => setComposeOpen(true)}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-3xl shadow-sm border-l border-t border-gray-100">
          {activeTab === "Inbox" ? (
            <EmailList emails={emails} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4 opacity-20">📁</div>
              <h2 className="text-xl font-medium">{activeTab} folder is empty</h2>
              <p className="text-sm">There are no messages in this category yet.</p>
            </div>
          )}
        </div>
      </div>

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
