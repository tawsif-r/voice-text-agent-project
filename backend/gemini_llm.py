import os
import time

from dotenv import load_dotenv
from google import genai

from backend.app_logger import write_log, log_exception


# Load environment variables
load_dotenv()

# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Check your .env file.")


# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

# Gemini model
MODEL = "gemini-3.5-flash-lite"


def generate_response(
    prompt: str,
    request_id: str = None
) -> str:
    """
    Generate a response using the existing Gemini API.
    """

    start_time = time.perf_counter()

    try:
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        # Existing API call — unchanged
        interaction = client.interactions.create(
            model=MODEL,
            input=prompt
        )

        answer = interaction.output_text or ""

        processing_time = round(
            time.perf_counter() - start_time, 3
        )

        # Log successful LLM response
        write_log(
            event="llm_success",
            request_id=request_id,
            model=MODEL,
            prompt=prompt,
            response=answer,
            processing_time_seconds=processing_time
        )

        return answer

    except Exception as error:

        processing_time = round(
            time.perf_counter() - start_time, 3
        )

        # Log LLM failure
        log_exception(
            event="llm_failed",
            error=error,
            request_id=request_id,
            model=MODEL,
            processing_time_seconds=processing_time
        )

        if isinstance(error, ValueError):
            raise

        raise RuntimeError(
            f"Failed to generate Gemini response: {error}"
        ) from error


if __name__ == "__main__":

    user_prompt = input("Enter your prompt: ")

    try:
        answer = generate_response(user_prompt)

        print("\nGemini Response:")
        print(answer)

    except (ValueError, RuntimeError) as error:
        print(f"\nError: {error}")