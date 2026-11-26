from fastapi import FastAPI, UploadFile, File, HTTPException
from transcribe import transcribe_audio
import tempfile
import os

app = FastAPI(title="VoiceNest STT Service")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: str = None):

    suffix = os.path.splitext(file.filename or "")[1] or ".wav"

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_audio:

            temp_audio.write(await file.read())
            audio_path = temp_audio.name

        result = transcribe_audio(audio_path, language)

        return result

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

    finally:
        if "audio_path" in locals() and os.path.exists(audio_path):
            os.remove(audio_path)
