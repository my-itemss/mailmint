import { Hono } from "hono";
import Email from "../models/Email";

const incoming = new Hono();

incoming.post("/", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.to || !body.from) {
        return c.json({ error: "Missing required fields" }, 400);
    }

    const saved = await Email.create({
      to: body.to,
      from: body.from,
      subject: body.subject || "(No Subject)",
      body: body.body || "",
    });

    return c.json({ message: "Email received", id: saved._id }, 201);
  } catch (err) {
    return c.json({ error: "Invalid payload" }, 400);
  }
});

export default incoming;
