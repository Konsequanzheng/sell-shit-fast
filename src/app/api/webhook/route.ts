import { NextResponse } from "next/server";

// Store messages by user ID
const sessions: Record<string, any[]> = {};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Webhook received:", data);

    const { user_id, message } = data;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Initialize session if it doesn't exist
    if (!sessions[user_id]) {
      sessions[user_id] = [];
    }

    // Ensure message has the correct format
    const formattedMessage = {
      text: message.text || message,
      images: message.images || [],
    };

    // Add message to session queue
    sessions[user_id].push(formattedMessage);
    console.log(
      "Stored message for user:",
      user_id,
      "Message:",
      formattedMessage
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Return messages for specific user and clear them
  const messages = sessions[user_id] || [];
  console.log("Returning messages for user:", user_id, "Messages:", messages);
  sessions[user_id] = [];

  return NextResponse.json({ messages });
}
