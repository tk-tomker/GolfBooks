import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "../lib/supabase/server"

export async function POST(req: Request) {
    const payload=await req.json();
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
        console.error("❌ Error while verifying webhook: ", err);
        return new NextResponse("Invalid signature", {status: 400});
    }

const supabase = createClient();

switch (evt.type){
    case "user.created":
        const { id, email_addresses, username } = evt.data;
        const email = email addresses[0]?.email_address;

        await supabase.from("users").insert({
            clerk-id: id,
            username: username || email,
            email,
            role: "Player",
            membership_type: null,
        });
        break;
}

case "user.deleted": {
    const { id } = evt.data;
    await supabase.from("users").delete().eq("clerk_id", id);
    break;
}
}

return NextResponse.json({status: "ok"});
}