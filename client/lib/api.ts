const BASE_URL = "https://mailmint-8fza.onrender.com";

export async function createMailbox() {
  const res = await fetch(`${BASE_URL}/mailbox/create`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to create mailbox");

  return res.json();
}

export async function getEmails(address: string) {
  const res = await fetch(`${BASE_URL}/emails/${address}`);
  return res.json();
}
