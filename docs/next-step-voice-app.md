# Next Step – Live Voice App

Status: **Plan** (not started). Owner: TBD. Last updated: 2026-11-22.

## 1. Problem

Today the pipeline is two separate scripts:

1. Save a recording as `audio.wav`.
2. Run `python transcribe.py`, which loads the Whisper model, transcribes and exits.
3. Copy the text into `python gemini_llm.py` by hand.

Every request reloads the model (several seconds), needs a file on disk, and needs a manual copy-paste step.

## 2. Goal

One long-running app: press a button (or hotkey), speak, release, and get the transcript and the Gemini response on screen.

### Requirements

| # | Requirement |
|---|---|
| R1 | Record directly from the microphone. No manual file handling. |
| R2 | Load the Whisper model once at startup and reuse it for every request. |
| R3 | Send the transcript to Gemini automatically and show both the transcript and the response. |
| R4 | Support English and Bangla (auto-detect, with an optional language override). |
| R5 | Skip the LLM call when the transcript is empty or silence only. |
| R6 | Keep the API key in `.env`. Never hard-code it or send it to the client. |
| R7 | Fit the target architecture in [architecture.md](architecture.md) (React frontend → ASP.NET backend → Python STT → LLM). |

### Out of scope (for now)

- Streaming / real-time partial transcripts while speaking.
- Text-to-speech playback of the response.
- Conversation history, user accounts, a database.

## 3. Approach

Build in three phases. Each phase produces something usable on its own, and each one reuses the previous phase's code.

```text
Phase 1: Local push-to-talk app      mic → Whisper → Gemini → terminal
Phase 2: Python STT service (HTTP)   POST audio → { transcript, response }
Phase 3: Browser recorder (React)    browser mic → backend → STT service → UI
```

### Phase 1 – Local push-to-talk app (quickest win)

A single Python process that stays running.

- **Refactor first:** turn `transcribe.py` into a reusable module with a `Transcriber` class that loads `WhisperModel` once and exposes `transcribe(audio) -> (text, language)`. Accept a file path or a NumPy array (faster-whisper accepts 16 kHz mono float32 arrays directly, so no temp file is needed).
- **Recording:** use [`sounddevice`](https://python-sounddevice.readthedocs.io/) to capture 16 kHz mono audio into memory.
- **Controls:** press Enter to start recording, Enter again to stop. (A global hotkey via `pynput` can come later, but it needs extra permissions on Wayland/Hyprland, so it is not the default.)
- **Pipeline:** recording → `Transcriber.transcribe()` → if text is not empty → `gemini_llm.generate_response()` → print both.
- **Entry point:** `python voice_app.py`. Ctrl+C exits.

New dependency: `sounddevice` (needs the system PortAudio library: `sudo pacman -S portaudio` on Arch).

**Done when:** you can record, see the transcript and the Gemini reply, and record again without restarting, with the model loaded only once.

### Phase 2 – Python STT service

Wrap the same modules in a small HTTP service so other components can call it. This becomes the `python-stt/` component from the architecture doc.

- Framework: **FastAPI** + `uvicorn`.
- Load the `Transcriber` once on startup (FastAPI lifespan).
- Endpoints:

| Method | Route | Body | Returns |
|---|---|---|---|
| `GET` | `/health` | – | `{ "status": "ok", "model": "small" }` |
| `POST` | `/transcribe` | `multipart/form-data`, field `audio`, optional `language` | `{ "text", "language", "duration" }` |
| `POST` | `/process` | same as above | `{ "text", "language", "response" }` (transcribe + Gemini) |

- Validation: reject missing files, unsupported types, and files above a size limit (for example 10 MB). Return `422` for an empty transcript instead of calling Gemini.
- Run CPU transcription in a thread pool (`run_in_threadpool`) so the event loop is not blocked.
- Configuration through env vars: `WHISPER_MODEL`, `WHISPER_DEVICE`, `WHISPER_COMPUTE_TYPE`, `CPU_THREADS`, `MAX_UPLOAD_MB`, `GEMINI_MODEL`.
- Add a `Dockerfile`. Mount `~/.cache/huggingface` as a volume so the model does not download on every container start.

New dependencies: `fastapi`, `uvicorn`, `python-multipart`.

**Done when:** `curl -F audio=@audio.wav localhost:8000/process` returns the transcript and the response.

> **Decision for Milestone 1:** whether the ASP.NET backend calls Gemini itself (and only uses `/transcribe`) or delegates to `/process`. The architecture doc puts the LLM call in the backend, so `/transcribe` is the long-term contract. `/process` stays useful for local testing.

### Phase 3 – Browser recorder (React frontend)

- Record with the browser `MediaRecorder` API (records `audio/webm;codecs=opus`). faster-whisper decodes webm through PyAV, so no conversion step is needed.
- UI: one hold-to-talk / click-to-toggle button, a recording timer, and panels for the transcript and the response, with loading and error states.
- The frontend sends audio to the ASP.NET backend (`POST /api/voice/process`), which forwards it to the Python service. During early development the frontend can call the Python service directly (enable CORS for the Vite dev server only).
- Browsers only allow mic access on `https` or `localhost`.

**Done when:** the full flow from [architecture.md §6](architecture.md#6-key-flows) works end to end in the browser.

## 4. Proposed layout

```text
speech-to-text/
├── stt/
│   ├── transcriber.py     # Transcriber class (model loaded once)
│   ├── recorder.py        # Phase 1: sounddevice capture
│   └── llm.py             # moved from gemini_llm.py
├── voice_app.py           # Phase 1 entry point
├── server.py              # Phase 2 FastAPI app
├── Dockerfile             # Phase 2
└── requirements.txt
```

Keep `transcribe.py` and `gemini_llm.py` as thin wrappers until nothing depends on them, so the existing commands keep working.

## 5. Docker and audio

Microphone access from inside a container is awkward (you have to pass through the PipeWire/PulseAudio socket and `/dev/snd`). To avoid that:

- **Phase 1** runs on the host, in the venv.
- **Phases 2 and 3** record audio in the browser and send it over HTTP, so the container never needs a microphone. Only the STT service runs in Docker.

## 6. Risks

| Risk | Mitigation |
|---|---|
| CPU latency with `small` on longer clips | Keep `vad_filter=True`. Measure latency and try `base` for English or `beam_size=1`. Note the GPU option in config. |
| Bangla accuracy with `small` | Test with Bangla samples early. Be ready to switch to `medium` or `large-v3` for Bangla. |
| Gemini rate limits or outages | Show the transcript even when the LLM call fails. Add a timeout and one retry. |
| Concurrent requests on one CPU model | Process one transcription at a time (a lock or a single worker) in Milestone 1. |
| API key leaking to the browser | The key stays server side only. The frontend never calls Gemini. |

## 7. Task checklist

**Phase 1**
- [ ] Extract `Transcriber` class from `transcribe.py`
- [ ] Add `recorder.py` with `sounddevice` (16 kHz mono, in memory)
- [ ] Add `voice_app.py` loop: record → transcribe → Gemini → print
- [ ] Skip the LLM on an empty transcript
- [ ] Add `sounddevice` to `requirements.txt`, and PortAudio to the README

**Phase 2**
- [ ] FastAPI app with `/health`, `/transcribe`, `/process`
- [ ] Upload validation and size limit
- [ ] Env-var config
- [ ] Dockerfile and model cache volume
- [ ] Measure latency for 5 s, 15 s and 60 s clips (English and Bangla)

**Phase 3**
- [ ] React recorder component with `MediaRecorder`
- [ ] Transcript and response display, loading and error states
- [ ] Connect through the ASP.NET backend
- [ ] End-to-end test of the full flow

## 8. Open questions

1. Push-to-talk (hold) or click-to-toggle as the default control?
2. Should the LLM get a system prompt (for example "reply in the same language as the user")?
3. Maximum recording length: 60 s?
4. Does Phase 1 stay in the repo after Phase 3, as a developer tool?
