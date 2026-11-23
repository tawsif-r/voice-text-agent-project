# VoiceNest – System Architecture

Living document. Update the Change Log whenever architecture, components, constraints, or endpoints change.

## 1. Overview

- VoiceNest Milestone 1 focuses on the core voice interaction pipeline: **Audio Recording → Speech-to-Text → LLM → Response**.
- Frontend: React + Vite for audio recording and displaying results.
- Backend: ASP.NET Core Web API (.NET 10) for handling requests and coordinating processing.
- Speech-to-Text: Python with Faster-Whisper for converting recorded audio into text.
- LLM: Google Gemini API (`google-genai`) for generating responses from transcribed text.
- The system supports the planned Bangla and English voice interaction requirements.
- No database is required for the core Milestone 1 pipeline.

## 2. Folder Layout

The project contains three main application components:

```text
VoiceNest/
├── frontend/             React + Vite application
├── backend/              ASP.NET Core Web API (.NET 10)
└── python-stt/           Python Speech-to-Text component
    └── transcribe.py     Faster-Whisper transcription script
```

Exact internal folder and file organization may change during implementation.

## 3. Conventions

| Topic | Rule |
|---|---|
| Naming | C# uses PascalCase, JavaScript uses camelCase, and Python uses snake_case. |
| API | Use lowercase routes under `/api`, dedicated request/response models, and consistent HTTP status codes. |
| Audio | Accept audio through `multipart/form-data` and validate file format, size, and required input before processing. |
| Configuration | Keep API URLs, model settings, file-size limits, and timeouts configurable. |
| Security | Store API keys and secrets in environment variables or development secrets. Never commit them to GitHub. |
| Logging & Errors | Use ASP.NET Core logging and return clear error messages for failed requests or processing errors. |
| Async & CORS | Use asynchronous operations for external service calls and configure CORS for the frontend. |
| Timeouts | Set appropriate timeouts for STT and LLM requests. |

## 4. Entities / Data Models

Milestone 1 uses logical data structures to transfer information between the frontend, backend, STT component, and LLM API. These are not database entities.

| Module | Data | Description |
|---|---|---|
| Audio Input | Audio File | Recorded audio submitted by the frontend. |
| Audio Input | Audio Metadata | File name, format, and size. |
| Speech-to-Text | Transcription Text | Text generated from the recorded audio by Faster-Whisper. |
| LLM | LLM Request | Transcribed text sent to the external LLM API. |
| LLM | LLM Response | Generated response received from the LLM API. |
| Final Response | Processing Result | Contains the transcription and generated response for the frontend. |

Exact request and response class names and JSON structures are to be finalized during API implementation.

## 5. API Endpoints

All backend API endpoints are expected to be under `/api`.

| Resource | Endpoints |
|---|---|
| voice | `POST /process` (proposed) — Accepts recorded audio, validates the input, processes it through Speech-to-Text and the LLM, and returns the transcription and generated response. |

The final route, request/response format, and Python integration method are pending implementation decisions.

## 6. Key Flows

### Voice Processing Flow

1. **Audio Recording:** User records audio through the React frontend.
2. **Audio Submission:** Frontend sends the recorded audio to the ASP.NET Core Web API.
3. **Input Validation:** Backend checks the audio file and required input.
4. **Speech-to-Text:** Python component uses Faster-Whisper to convert audio into text.
5. **LLM Processing:** Backend sends the transcription to the external LLM API.
6. **Response Generation:** LLM generates a response based on the transcribed text.
7. **Frontend Response:** Backend returns the transcription and generated response to the React frontend.

### Validation

| Stage | Validation |
|---|---|
| Audio Input | Check that an audio file is provided and its format and size are supported. |
| STT | Check that transcription completes successfully and produces usable text. |
| LLM Input | Ensure the transcription is not empty before sending it to the LLM. |
| LLM Response | Check that the API request succeeds and a valid response is returned. |
| Final Response | Ensure the result contains the expected transcription and response data. |

### Error Handling

| Situation | Expected Handling |
|---|---|
| Missing audio | Return a validation error. |
| Unsupported audio format | Reject the input with a clear error message. |
| Audio exceeds size limit | Reject the upload. |
| STT processing failure | Return an appropriate processing error. |
| Empty transcription | Stop processing and return a clear error. |
| LLM API failure | Return an appropriate external-service error. |
| Request timeout | Handle the timeout and return an appropriate error response. |

Exact error response formats and status-code mapping will be finalized during implementation.

## 7. Not Done Yet (Known Gaps)

- Final communication method between ASP.NET Core and the Python STT component.
- Final API routes and request/response contracts.
- Audio format and maximum file-size limits.
- Final validation rules and error response structure.
- LLM integration into the end-to-end pipeline (Gemini client exists as a standalone script, `gemini_llm.py`).
- End-to-end integration testing of the complete pipeline.
- Bangla and English transcription quality and performance testing.
- Response-time and latency measurement.

## 8. Running and Testing

### Python STT

```bash
python3 transcribe.py
```

Faster-Whisper transcription has been tested separately using an audio sample.

### ASP.NET Core Backend

```bash
dotnet run
```

### React Frontend

```bash
npm install
npm run dev
```

Run each component from its respective project directory. Exact commands may depend on the final project structure and configuration.

### Testing Scope

- Verify audio recording from the frontend.
- Verify audio submission to the backend.
- Verify Speech-to-Text transcription.
- Verify LLM request and response.
- Verify the complete audio-to-response workflow.
- Test invalid audio input and service failures.

## 9. Change Log

| Date | Changes |
|---|---|
| 2026-11-19 | Initial Milestone 1 architecture documented, covering React frontend, ASP.NET Core backend, Python Faster-Whisper STT, LLM integration, validation, and processing flow. |
| 2026-11-22 | LLM provider set to Google Gemini. Added `requirements.txt`. Next-step plan for a live voice app in [next-step-voice-app.md](next-step-voice-app.md). |
