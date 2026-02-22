const BASE = process.env.NEXT_PUBLIC_BASE_URL;

type LoginResponse = {
  success: boolean;
  email: string;
  displayName: string;
};

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

export async function loginMailbox(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/mailbox/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Login failed");
  }

  // Extra safety check (this fixes your issue)
  if (!data.email || !data.displayName) {
    throw new Error("Invalid login response (missing user data)");
  }

  return data;
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

export async function deleteWholeUser(email: string, password: string) {
  const res = await fetch(`${BASE}/mailbox/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete user account");
  return data; 
}


export async function getSentEmails(userEmail: string) {
  const res = await fetch(`${BASE}/emails/sent/${userEmail}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch sent mails");
  }

  return data;
}


export async function deleteEmail(emailId: string, userEmail: string) {
  const res = await fetch(`${BASE}/mailbox/delete-email`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailId,
      userEmail,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to delete email");
  }

  return data;
}