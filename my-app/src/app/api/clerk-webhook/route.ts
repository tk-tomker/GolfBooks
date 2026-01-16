import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabaseServer";

export async function POST(req: Request) {
  const payload = await req.json();
  const hdrs = headers();

  const wh = new Webhook(process.env.CLER_WEBHOOK_SECRET!);
  let evt;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": hdrs.get("svix-id")!,
      "svix-timestamp": hdrs.get("svix-timestamp")!,
      "svix-signature": hdrs.get("svix-signature")!,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("Webhook event:", evt.type);

  const supabase = supabaseAdmin;

  if (evt.type === "user.created") {
    const userData = evt.data;
    const { id, email_addresses, username, first_name, last_name } = userData;
    const email = email_addresses?.[0]?.email_address ?? null;

    console.log("Creating user:", { id, email, username });

    const { error } = await supabase.from("users").insert({
      clerk_id: id,
      username: username ?? email,
      email,
      full_name: [first_name, last_name].filter(Boolean).join(" ") || null,
      role: 0,
      membership_type: null,
    });

    if (error) console.error("Supabase insert error:", error);
    else console.log("User created successfully");
  }

  return NextResponse.json({ status: "ok" });
}