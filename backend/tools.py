"""
Digital FTE — Tool Definitions & Registry
Each tool is a plain Python function that takes a dict of args and returns a string.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
_gen_model = genai.GenerativeModel("gemini-2.5-flash")


def _ask(prompt: str) -> str:
    """Helper: single-shot Gemini call used by tools that need real generation."""
    response = _gen_model.generate_content(prompt)
    return response.text.strip()


# ── Tool implementations ─────────────────────────────────────────────

def generate_social_post(args: dict) -> str:
    topic = args.get("topic", "")
    platform = args.get("platform", "twitter")
    tone = args.get("tone", "professional")

    length_guide = {
        "twitter": "under 280 characters, punchy",
        "linkedin": "3-5 sentences, one detailed paragraph, professional storytelling",
        "instagram": "2-4 sentences, engaging and visual, caption style",
    }.get(platform, "2-4 sentences")

    prompt = (
        f"Write a detailed, high-quality {platform} post about: \"{topic}\".\n"
        f"Tone: {tone}.\n"
        f"Length/style: {length_guide}.\n"
        f"Requirements:\n"
        f"- Write a genuine, well-developed paragraph (not just a one-liner) that gives real value or insight, not generic filler.\n"
        f"- End with 5-7 relevant, specific hashtags on their own line (not generic like #love #instagood).\n"
        f"- Do not use markdown formatting, asterisks, or emojis unless the tone is 'casual' or 'witty'.\n"
        f"- Return ONLY the post text, nothing else (no preamble, no 'Here is your post:')."
    )
    return _ask(prompt)


def draft_email(args: dict) -> str:
    purpose = args.get("purpose", "")
    recipient = args.get("recipient", "")
    key_points = args.get("key_points", [])
    tone = args.get("tone", "professional")
    points = "\n".join(f"- {p}" for p in key_points)

    prompt = (
        f"Draft a {tone} email.\n"
        f"To: {recipient}\n"
        f"Purpose: {purpose}\n"
        f"Key points to cover:\n{points}\n\n"
        f"Write a complete, well-structured email with a clear subject line, greeting, "
        f"body paragraphs that naturally incorporate the key points, and a sign-off.\n"
        f"Format exactly as:\nSubject: <subject>\n\n<body>\n\n"
        f"Return ONLY the email, nothing else."
    )
    return _ask(prompt)


def summarize_text(args: dict) -> str:
    text = args.get("text", "")
    max_bullets = args.get("max_bullets", 5)
    prompt = (
        f"Summarize the following text into at most {max_bullets} clear, "
        f"information-dense bullet points (start each with •). "
        f"Return ONLY the bullets.\n\nText:\n{text}"
    )
    return _ask(prompt)


def analyze_sentiment(args: dict) -> str:
    text = args.get("text", "")
    prompt = (
        "Analyze the sentiment of this text. Return ONLY valid JSON, no markdown, "
        'in exactly this shape: {"score": <-1 to 1>, "label": "positive|negative|neutral|mixed", '
        '"confidence": <0-1>, "themes": ["..."]}\n\n'
        f"Text: {text}"
    )
    return _ask(prompt)


def extract_data(args: dict) -> str:
    text = args.get("text", "")
    extract_types = args.get("extract_types", [])
    prompt = (
        f"Extract the following entity types from the text: {', '.join(extract_types)}. "
        f"Return ONLY valid JSON, no markdown, mapping each type to a list of extracted values.\n\n"
        f"Text: {text}"
    )
    return _ask(prompt)


def web_research(args: dict) -> str:
    query = args.get("query", "")
    prompt = (
        f"Provide a structured research brief on: \"{query}\". "
        f"Return ONLY valid JSON, no markdown, in this shape: "
        f'{{"query": "...", "summary": "...", "key_points": ["...", "..."]}}'
    )
    return _ask(prompt)


# ── Registry: tool name → function ───────────────────────────────────

TOOL_REGISTRY = {
    "generate_social_post": generate_social_post,
    "draft_email": draft_email,
    "summarize_text": summarize_text,
    "analyze_sentiment": analyze_sentiment,
    "extract_data": extract_data,
    "web_research": web_research,
}

# ── Function declarations (Gemini function-calling schema) ──────────

TOOL_DEFINITIONS = [
    {
        "name": "generate_social_post",
        "description": "Write a detailed social media post with a full paragraph and hashtags for a topic, platform, and tone.",
        "parameters": {
            "type": "object",
            "properties": {
                "topic": {"type": "string"},
                "platform": {"type": "string", "enum": ["twitter", "linkedin", "instagram"]},
                "tone": {"type": "string", "enum": ["professional", "casual", "witty", "inspirational"]},
            },
            "required": ["topic", "platform", "tone"],
        },
    },
    {
        "name": "draft_email",
        "description": "Draft a professional email given purpose, recipient, key points.",
        "parameters": {
            "type": "object",
            "properties": {
                "purpose": {"type": "string"},
                "recipient": {"type": "string"},
                "key_points": {"type": "array", "items": {"type": "string"}},
                "tone": {"type": "string", "enum": ["formal", "friendly", "assertive"]},
            },
            "required": ["purpose", "recipient", "key_points"],
        },
    },
    {
        "name": "summarize_text",
        "description": "Summarize text into bullet points.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "max_bullets": {"type": "number"},
            },
            "required": ["text"],
        },
    },
    {
        "name": "analyze_sentiment",
        "description": "Analyze sentiment and themes of text. Returns JSON.",
        "parameters": {
            "type": "object",
            "properties": {"text": {"type": "string"}},
            "required": ["text"],
        },
    },
    {
        "name": "extract_data",
        "description": "Extract structured entities from raw text.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "extract_types": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["text", "extract_types"],
        },
    },
    {
        "name": "web_research",
        "description": "Research a topic and return a structured findings brief.",
        "parameters": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
]