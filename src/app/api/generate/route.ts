import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: Request) {
  try {
    const { profession, keywords, tone } = await req.json();

    if (!profession || !keywords || !tone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `Generate 5 short bios for a person with the following details:
Profession: ${profession}
Keywords: ${keywords}
Tone: ${tone}

Requirements:
- Each bio must be under 160 characters.
- Return a JSON object with a key "bios" containing an array of 5 strings.
- Do not include any other text or numbering.
- Focus on the specified tone: ${tone}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional bio writer. You generate engaging, short bios for social media profiles. Return output as a JSON object with a 'bios' key.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsed = JSON.parse(content);
    // The model might return { "bios": [...] } or just [...] if we are lucky, but since we asked for a JSON array,
    // let's handle both or specify the key.

    // Better prompt: "Return a JSON object with a key 'bios' containing an array of 5 strings."

    const bios = Array.isArray(parsed) ? parsed : parsed.bios || Object.values(parsed)[0];

    if (!Array.isArray(bios)) {
      throw new Error("Invalid format received from OpenAI");
    }

    return NextResponse.json({ bios: bios.slice(0, 5) });
  } catch (error: any) {
    console.error("Error generating bios:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate bios" },
      { status: 500 }
    );
  }
}
