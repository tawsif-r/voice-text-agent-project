from faster_whisper import WhisperModel

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
    cpu_threads=4
)

segments, info = model.transcribe(
    "audio.wav",
    beam_size=3,
    vad_filter=True
)

print("Detected language:", info.language)

for segment in segments:
    print(segment.text)