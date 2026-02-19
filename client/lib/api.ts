const BASE = process.env.NEXT_PUBLIC_BASE_URL;

export async function createMailbox(customEmail: string, password: string, displayName: string) {
  const res = await fetch(`${BASE}/mailbox/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      customEmail,
      password, 
      displayName
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create mailbox");
  }

  return res.json();
}

export async function loginMailbox(email: string, password: string) {
  const res = await fetch(`${BASE}/mailbox/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  return res.json();
}

export async function deleteMailbox(email: string, password: string) {
  const res = await fetch(`${BASE}/mailbox/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete mailbox");
  }

  return res.json();
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
