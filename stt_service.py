import os
import tempfile
import time
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException, Response

from transcribe import transcribe_audio
from app_logger import write_log, log_exception


app = FastAPI(title="VoiceNest STT Service")


@app.post("/transcribe")
async def transcribe(
    response: Response,
    file: UploadFile = File(...),
    language: str = None
):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    audio_path = None

    try:
        # Read uploaded audio
        audio_content = await file.read()

        suffix = os.path.splitext(file.filename or "")[1] or ".wav"

        # Add request ID to response header
        response.headers["X-Request-ID"] = request_id

        # Log received audio metadata
        write_log(
            event="audio_received",
            request_id=request_id,
            filename=os.path.basename(file.filename or "unknown"),
            content_type=file.content_type,
            file_size_bytes=len(audio_content),
            language_requested=language
        )

        # Save audio temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_audio:
            temp_audio.write(audio_content)
            audio_path = temp_audio.name

        # Transcribe audio
        result = transcribe_audio(
            audio_path,
            language,
            request_id=request_id
        )

        return result

    except Exception as error:
        processing_time = round(
            time.perf_counter() - start_time, 3
        )

        log_exception(
            event="transcription_failed",
            error=error,
            request_id=request_id,
            processing_time_seconds=processing_time
        )

        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed. Request ID: {request_id}"
        ) from error

    finally:
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except OSError:
                write_log(
                    event="temporary_file_cleanup_failed",
                    request_id=request_id,
                    audio_path=audio_path
                )
