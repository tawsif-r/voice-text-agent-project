# VoiceNest API Documentation

## 1. Overview

VoiceNest provides a REST API for converting audio files into text using a Speech-to-Text (STT) model.

The API is developed using FastAPI and implemented in `stt_service.py`.

## 2. Base URL

For local development:

```text
http://127.0.0.1:8000
```

## 3. API Endpoint

### POST `/transcribe`

Accepts an audio file and returns its transcription.

**Request Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Audio file to be transcribed. |
| `language` | String | No | Language code for transcription (e.g., `bn`, `en`). |

**Content-Type:**

```text
multipart/form-data
```

### Example Request

Using cURL:

```bash
curl -X POST "http://127.0.0.1:8000/transcribe" \
  -F "file=@audio.mp3" \
  -F "language=bn"
```

### Successful Response

**HTTP Status:** `200 OK`

Example:

```json
{
    "transcript": "আপনার অডিও থেকে পাওয়া টেক্সট",
    "language": "bn"
}
```

The response contains the generated transcription and language information.

## 4. Error Responses

The API may return error responses when a request is invalid or when an issue occurs during audio processing.

| HTTP Status Code | Description |
|---|---|
| 422 | Request validation failed, such as a missing required file. |
| 500 | An unexpected server-side error occurred during processing. |

**Note:** These responses must be verified through API testing against the current implementation.

## 5. Supported Audio Formats

The API accepts audio file uploads for transcription.

The following formats have been tested during development:

- MP3 (`.mp3`)
- WAV (`.wav`)

Other commonly used formats that may be processable by the underlying audio decoder include:

- M4A (`.m4a`)
- FLAC (`.flac`)
- OGG (`.ogg`)
- OPUS (`.opus`)
- AAC (`.aac`)
- WMA (`.wma`)
- WebM (`.webm`)

**Note:** The additional formats have not yet been individually tested. Actual compatibility depends on the audio decoder and file encoding.

## 6. API Workflow

```text
       Client
          |
          v
    POST /transcribe
          |
          v
    Upload Audio File
          |
          v
     stt_service.py
          |
          v
    transcribe_audio()
          |
          v
    Speech-to-Text Processing
          |
          v
    Generate Transcription
          |
          v
      JSON Response
          |
          v
        Client
```

The uploaded audio is temporarily stored for processing and cleaned up after the request finishes.

## 7. Running the API

Start the FastAPI server using:

```bash
uvicorn stt_service:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

## 8. Interactive API Documentation

FastAPI automatically generates interactive API documentation using Swagger UI.

Open the following address in a browser after starting the server:

```text
http://127.0.0.1:8000/docs
```

Swagger UI allows developers to:

- View available endpoints.
- Inspect request parameters.
- Upload audio files.
- Execute API requests.
- Inspect response data.

## 9. Implementation Files

| File | Responsibility |
|---|---|
| `stt_service.py` | Handles API requests and audio uploads. |
| `transcribe.py` | Handles speech-to-text processing. |
| `app_logger.py` | Records application events and exceptions. |


## 10. Conclusion

The VoiceNest API provides an interface for audio-to-text conversion through a FastAPI endpoint.

It accepts audio uploads, processes them through the transcription module, and returns the generated text as a response.