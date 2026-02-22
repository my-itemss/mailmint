import { Hono } from "hono";
import bcrypt from "bcrypt";
import Mailbox from "../models/Mailbox";
import Email from "../models/Email"; 
import { generateId } from "../utils/generateId";

const mailbox = new Hono();

mailbox.post("/create", async (c) => {
  const body = await c.req.json().catch(() => ({}));

  const emailUser = body.customEmail || generateId(8);
  const email = `${emailUser}@${process.env.MAIL_DOMAIN}`;
  const password = body.password;
  const displayName = body.displayName;

  if (!emailUser || !password || !displayName) {
    return c.json({ error: "Name, email and password are required" }, 400);
  }

  const exists = await Mailbox.findOne({ 
    email: { $regex: new RegExp(`^${emailUser}@`, 'i') }
  });
  
  if (exists) {
    return c.json({ error: "Email already taken" }, 400);
  }

    const hashedPassword = await bcrypt.hash(password, 10);

  await Mailbox.create({ 
    email, 
    emailUser,
    displayName,
    password: hashedPassword
  });

  return c.json({ email, displayName });
});


mailbox.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "Email and password required" }, 400);
  }

  const mailbox = await Mailbox.findOne({ email });

  if (!mailbox) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isMatch = await bcrypt.compare(password, mailbox.password);

  if (!isMatch) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({ 
    success: true,
    email: mailbox.email,
    displayName: mailbox.displayName
  });
});


mailbox.delete("/delete", async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    return c.json({ success: false, error: "Missing email" }, 400);
  }

  await Mailbox.deleteOne({ email });

  // also delete all emails of that user
  await Email.deleteMany({
    $or: [{ from: email }, { to: email }],
  });

  return c.json({ success: true });
});


mailbox.delete("/delete-email", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { emailId, userEmail } = body;

  if (!emailId || !userEmail) {
    return c.json({ error: "Missing fields" }, 400);
  }

  const mail = await Email.findById(emailId);

  if (!mail) {
    return c.json({ error: "Mail not found" }, 404);
  }

  /* ---------- RECEIVER DELETE ---------- */
  if (mail.to === userEmail) {
    mail.deletedByReceiver = true;
  }

  /* ---------- SENDER DELETE ---------- */
  if (mail.from === userEmail) {
    mail.deletedBySender = true;
  }

  /* ---------- BOTH DELETED → PERMANENT DELETE ---------- */
  if (mail.deletedByReceiver && mail.deletedBySender) {
    await Email.findByIdAndDelete(emailId);
    return c.json({ success: true, message: "Mail permanently deleted" });
  }

  await mail.save();

  return c.json({
    success: true,
    message: "Mail deleted for this user only",
  });
});

export default mailbox;