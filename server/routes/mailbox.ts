import { Hono } from "hono";
import Mailbox from "../models/Mailbox";
import { generateId } from "../utils/generateId";

const mailbox = new Hono();

mailbox.post("/create", async (c) => {
  const body = await c.req.json().catch(() => ({}));

  const name = body.name || generateId();
  const email = `${name}@${process.env.MAIL_DOMAIN}`;

  const exists = await Mailbox.findOne({ email });
  if (exists)
    return c.json({ error: "Email exists" }, 400);

  await Mailbox.create({ email });

  return c.json({ email });
});

export default mailbox;
