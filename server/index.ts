import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { connectDB } from "./config/db";

import mailbox from "./routes/mailbox";
import email from "./routes/email";
import incoming from "./routes/incoming";

await connectDB();

const app = new Hono();

app.route("/mailbox", mailbox);
app.route("/emails", email);
app.route("/incoming", incoming);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});

console.log("Server running successfully");
