import { Hono } from "hono";
import Mailbox from "../models/Mailbox";
import Email from "../models/Email"; 
import { generateId } from "../utils/generateId";

const mailbox = new Hono();

mailbox.post("/create", async (c) => {
  const body = await c.req.json().catch(() => ({}));

  const name = body.name || generateId();
  const email = `${name}@${process.env.MAIL_DOMAIN}`;
  const password = body.password;

  if (!password) {
    return c.json({ error: "Password required" }, 400);
  }

  // Check if NAME already exists
  const exists = await Mailbox.findOne({ 
    email: { $regex: new RegExp(`^${name}@`, 'i') }
  });
  
  if (exists)
    return c.json({ error: "Name already taken" }, 400);

  await Mailbox.create({ email, name, password });

  return c.json({ email });
});

mailbox.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  
  const { email, password } = body;
  
  if (!email || !password) {
    return c.json({ error: "Email and password required" }, 400);
  }

  const mailbox = await Mailbox.findOne({ email });
  
  if (!mailbox || mailbox.password !== password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({ 
    success: true, 
    email: mailbox.email 
  });
});

mailbox.delete("/delete", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  
  const { email, password } = body;
  
  if (!email || !password) {
    return c.json({ error: "Email and password required" }, 400);
  }

  const mailbox = await Mailbox.findOne({ email });
  
  if (!mailbox || mailbox.password !== password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  await Email.deleteMany({ to: email });

  await Mailbox.deleteOne({ email });

  return c.json({ 
    success: true, 
    message: "Mailbox and all emails deleted successfully" 
  });
});

export default mailbox;