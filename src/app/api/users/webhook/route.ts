// //////////////////////// every route.ts will return a Response with some status code ///////////////////////

////////////////////////// NEW WAY without svix page/////////////////////////
import { users } from "@/db/schema";
import { db } from "@/index";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { data } = evt;
      await db.insert(users).values({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      });
    }

    if (eventType === "user.updated") {
      const { data } = evt;
      await db
        .update(users)
        .set({
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id)); // where(eq(users.clerkId, data.id)) means: any user which its clerkId is equal to data.id should be updated
    }

    if (eventType === "user.deleted") {
      const { data } = evt;

      if (!data.id) {
        return new Response("Error: Missing user id", { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, data.id)); //where(eq(users.clerkId, data.id)) means: any user which its clerkId is equal to data.id should be deleted
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

///////////////////// OLD WAY with svix page /////////////////////////
// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { db } from "@/index";
// import { users } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       "Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from clerk dashboard to .env.local or .env"
//     );
//   }

//   // create new Svix instance with signing key
//   const wh = new Webhook(SIGNING_SECRET);

//   // get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // if there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing sivx headers", { status: 400 });
//   }

//   // get body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   // verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error: Could not verify webhook:", err);
//     return new Response("Error: Verification error", { status: 400 });
//   }

//   const eventType = evt.type;

//   if (eventType === "user.created") {
//     const { data } = evt;
//     await db.insert(users).values({
//       clerkId: data.id,
//       name: `${data.first_name} ${data.last_name}`,
//       imageUrl: data.image_url,
//     });
//   }

//   if (eventType === "user.updated") {
//     const { data } = evt;
//     await db
//       .update(users)
//       .set({
//         name: `${data.first_name} ${data.last_name}`,
//         imageUrl: data.image_url,
//       })
//       .where(eq(users.clerkId, data.id)); // where(eq(users.clerkId, data.id)) means: any user which its clerkId is equal to data.id should be updated
//   }

//   if (eventType === "user.deleted") {
//     const { data } = evt;

//     if (!data.id) {
//       return new Response("Error: Missing user id", { status: 400 });
//     }

//     await db.delete(users).where(eq(users.clerkId, data.id)); //where(eq(users.clerkId, data.id)) means: any user which its clerkId is equal to data.id should be deleted
//   }

//   return new Response("webhook received", { status: 200 });
// }
