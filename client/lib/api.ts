const BASE = "https://mailmint-8fza.onrender.com";


export async function createMailbox(name?: string) {
  const res = await fetch(`${BASE}/mailbox/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function getEmails(address: string) {
  const res = await fetch(`${BASE}/emails/${address}`);
  return res.json();
}

export async function sendEmail(payload: any) {
  const res = await fetch(`${BASE}/emails/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
