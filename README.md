# Speech to Text

Transcribes an audio file locally with [faster-whisper](https://github.com/SYSTRAN/faster-whisper), running the Whisper `small` model on the CPU, and generates responses with the Google Gemini API.

| Script | What it does |
|---|---|
| [transcribe.py](transcribe.py) | Transcribes `audio.wav` to text. |
| [gemini_llm.py](gemini_llm.py) | Sends a prompt to Gemini and prints the response. |

See [docs/architecture.md](docs/architecture.md) for the system design and [docs/next-step-voice-app.md](docs/next-step-voice-app.md) for the planned live-recording app.

## Requirements

- Python 3.10 or newer (tested with 3.14)
- About 500 MB of free disk space for the model, which downloads on the first run
- An internet connection for that first run, and for every Gemini request
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

You don't need to install FFmpeg separately, because the PyAV wheels bundle it.

## Setup

```bash
cd speech-to-text
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the project root with your Gemini key:

```bash
GEMINI_API_KEY=your-key-here
```

`.env` is in `.gitignore`. Never commit it.

> **Why does `requirements.txt` pin `av<17`?** faster-whisper 1.2.1 passes `metadata_errors` to `av.open()`, and PyAV 17 and later no longer accept it. With a newer PyAV, the script fails with:
> `TypeError: open() got an unexpected keyword argument 'metadata_errors'`

## Run

### Transcribe

Put the audio file in this directory as `audio.wav`, then run:

```bash
source .venv/bin/activate
python transcribe.py
```

Or skip activating the venv:

```bash
.venv/bin/python transcribe.py
```

Example output:

```
Detected language: en
 The stale smell of old beer lingers.
 It takes heat to bring out the odor.
 ...
```

The first run downloads the model into `~/.cache/huggingface/hub/`. Later runs use the cached copy and work offline.

### Ask Gemini

```bash
.venv/bin/python gemini_llm.py
```

The script prompts for input and prints the response:

```
Enter your prompt: Summarize: the stale smell of old beer lingers.

Gemini Response:
...
```

You can also import it from other code:

```python
from gemini_llm import generate_response

print(generate_response("Hello"))
```

Right now the two scripts run separately. To send a transcript to Gemini, copy the text from `transcribe.py` into `gemini_llm.py`.

## Configuration

Change these settings at the top of [transcribe.py](transcribe.py):

| Setting | Current value | Notes |
|---|---|---|
| Model size | `"small"` | Options are `tiny`, `base`, `small`, `medium`, `large-v3`. Larger models are more accurate but slower. |
| `device` | `"cpu"` | Use `"cuda"` on an NVIDIA GPU, which needs CUDA and cuDNN. |
| `compute_type` | `"int8"` | Good for CPU. On a GPU, use `"float16"`. |
| `cpu_threads` | `4` | Set this to the number of CPU cores you want to use. |
| Input file | `"audio.wav"` | Any format FFmpeg can read works, such as mp3, m4a or flac. |
| `beam_size` | `3` | Higher values can be slightly more accurate but are slower. |
| `vad_filter` | `True` | Skips silent parts before transcribing. |

Gemini settings live in [gemini_llm.py](gemini_llm.py):

| Setting | Current value | Notes |
|---|---|---|
| `MODEL` | `"gemini-3.8-flash"` | Any Gemini model your key can access. |
| `GEMINI_API_KEY` | from `.env` | Loaded with `python-dotenv`. |

## Troubleshooting

- **`metadata_errors` TypeError:** run `pip install "av<17"` (see Setup).
- **Slow transcription:** use a smaller model, such as `base`, or raise `cpu_threads`.
- **Wrong language detected:** pass a language explicitly, for example `model.transcribe("audio.wav", language="en", ...)`.
- **`GEMINI_API_KEY is missing`:** create `.env` in the project root (see Setup).
- **`ModuleNotFoundError: No module named 'google'`:** run `pip install -r requirements.txt` inside the venv.
