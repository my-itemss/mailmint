import { Hono } from "hono";
import Email from "../models/Email";

const email = new Hono();

email.get("/:address", async (c) => {
  const address = c.req.param("address");
  const emails = await Email.find({ to: address }).sort({ createdAt: -1 });
  return c.json(emails);
});

email.post("/send", async (c) => {
  try {
    const body = await c.req.json();
    const newEmail = await Email.create({
      to: body.to,
      from: body.from,
      subject: body.subject,
      body: body.body,
    });
    return c.json(newEmail, 201);
  } catch (err) {
    return c.json({ error: "Failed to send email" }, 500);
  }
});

export default email;
