import { mux } from "@/lib/mux";
import { headers } from "next/headers";

import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { db } from "@/index";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not defined");
  }

  const headersPlayload = await headers();
  const maxSignature = headersPlayload.get("mux-signature");

  if (!maxSignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": maxSignature,
    },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }

      await db
        .update(videos)
        .set({ muxAssetId: data.id, muxStatus: data.status })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      // playback id only exist when video is ready(video.asset.ready)
      const playbackId = data.playback_ids?.[0].id;
      console.log(data);

      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }

      if (!playbackId) {
        return new Response("Missing playback id", { status: 400 });
      }
      // all these informtion will available in mux dashboard
      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.png`;
      const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          previewUrl,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }
  }

  return new Response("webhook received", { status: 200 }); // always webhook need to return ok status 200
}
