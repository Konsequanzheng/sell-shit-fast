import { NextResponse } from "next/server";

// Simple message queue
let messageQueue: any[] = [];

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Webhook received:", data);

    // Add message to queue
    messageQueue.push(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all messages in queue and clear it
  const messages = [...messageQueue];
  messageQueue = [];

  return NextResponse.json({ messages });
}
