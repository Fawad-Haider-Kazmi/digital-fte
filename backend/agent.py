"""
Digital FTE — ReAct Agent Core (Gemini)
Reason → Act → Observe loop, max 8 iterations.
"""

import os
from dataclasses import dataclass, field

import google.generativeai as genai

from tools import TOOL_DEFINITIONS, TOOL_REGISTRY

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def _to_python(value):
    """Recursively convert protobuf Struct/ListValue types to plain Python."""
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if hasattr(value, "items"):
        return {k: _to_python(v) for k, v in value.items()}
    if hasattr(value, "__iter__"):
        return [_to_python(v) for v in value]
    return value


def _to_python_dict(mapping) -> dict:
    return {k: _to_python(v) for k, v in mapping.items()}

SYSTEM = """You are a Digital FTE (Full-Time Employee) — an autonomous AI agent.

Your loop:
1. THINK  — reason about what the task needs. State your plan briefly.
2. ACT    — call exactly one tool per step.
3. OBSERVE — read the result, decide next action.
4. DELIVER — write a polished, complete, immediately usable final answer.

Rules:
- Never ask for clarification. Make smart assumptions and execute.
- Be decisive and professional.
- Final answer must be well-formatted and ready to use.
- When you have enough information, stop calling tools and write the final answer."""


@dataclass
class Step:
    iteration: int
    thought: str = ""
    tool_name: str | None = None
    tool_input: dict = field(default_factory=dict)
    tool_result: str | None = None
    final_answer: str | None = None


@dataclass
class AgentResult:
    task: str
    steps: list
    answer: str
    success: bool
    total_iterations: int


class DigitalFTE:
    def __init__(self):
        self.model = genai.GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=SYSTEM,
            tools=[{"function_declarations": TOOL_DEFINITIONS}],
        )

    def run(self, task: str, on_event=None) -> AgentResult:
        def emit(event: str, data: dict):
            if on_event:
                on_event(event, data)

        emit("start", {"task": task})

        chat = self.model.start_chat()
        steps = []
        message = task

        for i in range(1, 9):
            emit("iteration", {"i": i})

            response = chat.send_message(message)
            candidate = response.candidates[0]
            parts = candidate.content.parts
            step = Step(iteration=i)

            text_part = next((p for p in parts if hasattr(p, "text") and p.text), None)
            fn_part = next((p for p in parts if hasattr(p, "function_call") and p.function_call.name), None)

            if text_part:
                step.thought = text_part.text
                emit("thought", {"text": text_part.text, "i": i})

            if fn_part:
                fn = fn_part.function_call
                name = fn.name
                args = _to_python_dict(fn.args)
                step.tool_name = name
                step.tool_input = args
                emit("tool_start", {"name": name, "input": args, "i": i})

                if name in TOOL_REGISTRY:
                    result = TOOL_REGISTRY[name](args)
                else:
                    result = f"Unknown tool: {name}"

                step.tool_result = result
                emit("tool_result", {"name": name, "result": result, "i": i})
                steps.append(step)

                message = {
                    "parts": [{
                        "function_response": {
                            "name": name,
                            "response": {"content": result},
                        }
                    }]
                }
                continue

            final = text_part.text if text_part else "Task complete."
            step.final_answer = final
            steps.append(step)

            emit("final", {"answer": final, "iterations": i})

            return AgentResult(
                task=task,
                steps=steps,
                answer=final,
                success=True,
                total_iterations=i,
            )

        return AgentResult(
            task=task,
            steps=steps,
            answer="Agent reached maximum iterations without a final answer.",
            success=False,
            total_iterations=8,
        )