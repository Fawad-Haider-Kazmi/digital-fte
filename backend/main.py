"""
Digital FTE — FastAPI Server
Streams agent progress to the frontend via Server-Sent Events (SSE).
"""

import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from agent import DigitalFTE

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

fte = DigitalFTE()


class TaskRequest(BaseModel):
    task: str


@app.post("/api/agent")
async def run_agent(req: TaskRequest):
    def event_stream():
        events = []

        def on_event(event_type, data):
            events.append((event_type, data))

        # Run agent synchronously, collect events, then yield them.
        # (Simple approach — for true real-time streaming, run in a thread
        # with a queue instead.)
        result = fte.run(req.task, on_event=on_event)

        for event_type, data in events:
            yield f"data: {json.dumps({'event': event_type, 'data': data})}\n\n"

        yield f"data: {json.dumps({'event': 'done', 'data': {}})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/health")
async def health():
    return {"status": "ok"}