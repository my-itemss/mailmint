import { Hono } from "hono";
import Email from "../models/Email";

const email = new Hono();

/* GET inbox */
email.get("/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const emails = await Email.find({ 
      to: { $regex: new RegExp(`^${address}$`, 'i') } 
    }).sort({ createdAt: -1 });

    return c.json(emails);
  } catch (err) {
    console.error("Fetch error:", err);
    return c.json({ error: "Failed to load emails" }, 500);
  }
});

/* GET sent mails */
email.get("/sent/:address", async (c) => {
  try {
    const address = c.req.param("address");

    const emails = await Email.find({
      from: { $regex: new RegExp(`^${address}$`, "i") },
      deletedBySender: false,
    }).sort({ createdAt: -1 });

    return c.json(emails);
  } catch (err) {
    return c.json({ error: "Failed to load sent mails" }, 500);
  }
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