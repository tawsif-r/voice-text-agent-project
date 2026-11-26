import os
import time

from dotenv import load_dotenv
from google import genai

from backend.app_logger import write_log


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Check your .env file.")


# Initialize Gemini client
client = genai.Client(
    api_key=API_KEY,
    http_options={"api_version": "v1beta"}
)

MODEL = "gemini-3.5-transcribe"


def detect_language(text: str) -> str:
    """
    Detect Bengali or English from the transcript.
    """

    bengali_count = sum(
        1 for char in text
        if '\u0980' <= char <= '\u09FF'
    )

    english_count = sum(
        1 for char in text
        if 'a' <= char.lower() <= 'z'
    )

    if bengali_count > english_count:
        return "bn"

    elif english_count > 0:
        return "en"

    return "unknown"


def transcribe_audio(
    audio_path: str,
    language: str = None,
    request_id: str = None
) -> dict:
    """
    Transcribe audio using Gemini and return transcript and language.
    """

    start_time = time.perf_counter()

    # Upload audio
    audio_file = client.files.upload(file=audio_path)

    # Prepare audio input
    audio_input = [
        {
            "type": "audio",
            "uri": audio_file.uri,
            "mime_type": audio_file.mime_type
        }
    ]

    # Optional language configuration
    generation_config = None

    if language:
        language_code = {
            "bn": "bn-BD",
            "en": "en-US"
        }.get(language, language)

        generation_config = {
            "transcription_config": {
                "language_codes": [language_code]
            }
        }

    # Send audio to Gemini
    if generation_config:
        interaction = client.interactions.create(
            model=MODEL,
            input=audio_input,
            generation_config=generation_config
        )
    else:
        interaction = client.interactions.create(
            model=MODEL,
            input=audio_input
        )

    # Get transcript
    transcript = interaction.output_text or ""

    # Detect language automatically if not provided
    if language:
        detected_language = language.split("-")[0]
    else:
        detected_language = detect_language(transcript)

    # Calculate processing time
    processing_time = round(
        time.perf_counter() - start_time, 3
    )

    # Log successful transcription
    write_log(
        event="transcription_success",
        request_id=request_id,
        model=MODEL,
        transcript=transcript,
        language=detected_language,
        language_requested=language,
        processing_time_seconds=processing_time,
        transcript_empty=not bool(transcript.strip())
    )

    return {
        "transcript": transcript,
        "language": detected_language
    }
