import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Check your .env file.")

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

MODEL = "gemini-3.8-flash"


def generate_response(prompt: str) -> str:
    """Generate a response using the Gemini API."""

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty.")

    try:
        interaction = client.interactions.create(
            model=MODEL,
            input=prompt
        )

        return interaction.output_text

    except Exception as error:
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
