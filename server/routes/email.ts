import { Hono } from "hono";
import Email from "../models/Email";

const email = new Hono();

email.get("/:address", async (c) => {
  const address = c.req.param("address");

  const emails = await Email.find({ to: address })
    .sort({ createdAt: -1 });

  return c.json(emails);
});

export default email;
