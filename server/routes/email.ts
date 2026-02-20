import { Hono } from "hono";
import Email from "../models/Email";

const email = new Hono();

/* GET inbox */
email.get("/:address", async (c) => {
  try {
    // 1. Get address from params (Hono automatically decodes %40 back to @)
    const address = c.req.param("address");

    // 2. Use a case-insensitive regex for the search
    const emails = await Email.find({ 
      to: { $regex: new RegExp(`^${address}$`, 'i') } 
    }).sort({ createdAt: -1 });

    return c.json(emails);
  } catch (err) {
    console.error("Fetch error:", err);
    return c.json({ error: "Failed to load emails" }, 500);
  }
});


/* SEND EMAIL */
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


/* TOGGLE STAR */
email.patch("/star/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const mail = await Email.findById(id);
    if (!mail) return c.json({ error: "Not found" }, 404);

    mail.starred = !mail.starred;
    await mail.save();

    return c.json(mail);
  } catch (err) {
    return c.json({ error: "Star update failed" }, 500);
  }
});


/* MARK AS READ */
email.patch("/read/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const mail = await Email.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    return c.json(mail);
  } catch (err) {
    return c.json({ error: "Read update failed" }, 500);
  }
});


/* DELETE EMAIL */
email.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    await Email.findByIdAndDelete(id);

    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: "Delete failed" }, 500);
  }
});

export default email;