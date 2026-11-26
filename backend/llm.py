import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is missing. Check your .env file.")

client = InferenceClient(api_key=HF_TOKEN)

MODEL = "gemini-3.8-flash "


def generate_response(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=200
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    answer = generate_response(user_prompt)
    print("\nLLM Response:")
    print(answer)
