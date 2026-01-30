import { Hono } from "hono";
import Email from "../models/Email";

const incoming = new Hono();

incoming.post("/", async (c) => {
  const body = await c.req.json();

  await Email.create({
    to: body.to,
    from: body.from,
    subject: body.subject,
    body: body.body,
  });

  return c.json({ message: "Email received" });
});

export default incoming;
