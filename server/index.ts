import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { connectDB } from "./config/db";
import { cors } from "hono/cors";
import mailbox from "./routes/mailbox";
import email from "./routes/email";
import incoming from "./routes/incoming";

await connectDB();

const app = new Hono()

app.get('/', (c) => c.text('Runningg'))
app.use("*", cors());
app.route("/mailbox", mailbox);
app.route("/emails", email);
app.route("/incoming", incoming);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 9000,
});

console.log("Server running successfully");
