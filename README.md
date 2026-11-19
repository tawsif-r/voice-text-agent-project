# Speech to Text

Transcribes an audio file locally with [faster-whisper](https://github.com/SYSTRAN/faster-whisper), running the Whisper `small` model on the CPU.

## Requirements

- Python 3.10 or newer (tested with 3.14)
- About 500 MB of free disk space for the model, which downloads on the first run
- An internet connection for that first run only

You don't need to install FFmpeg separately, because the PyAV wheels bundle it.

## Setup

```bash
cd speech-to-text
python -m venv .venv
source .venv/bin/activate
pip install faster-whisper==1.2.1 "av<17"
```

> **Why `av<17`?** faster-whisper 1.2.1 passes `metadata_errors` to `av.open()`, and PyAV 17 and later no longer accept it. With a newer PyAV, the script fails with:
> `TypeError: open() got an unexpected keyword argument 'metadata_errors'`

## Run

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

## Troubleshooting

- **`metadata_errors` TypeError:** run `pip install "av<17"` (see Setup).
- **Slow transcription:** use a smaller model, such as `base`, or raise `cpu_threads`.
- **Wrong language detected:** pass a language explicitly, for example `model.transcribe("audio.wav", language="en", ...)`.
