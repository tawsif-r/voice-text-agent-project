import { useState, useRef } from "react";
import "./VoiceWorkspace.css";

function VoiceWorkspace() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError("");
      setAudioURL(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <section className="voice-workspace">
      <div className="workspace-container">

        <div className="workspace-header">
          <span className="workspace-label">VOICE WORKSPACE</span>

          <h2>
            Your voice,
            <span> your words.</span>
          </h2>

          <p>
            Start recording and turn your conversations into text.
          </p>
        </div>

        <div className="recording-card">

          <div className={`recording-indicator ${isRecording ? "active" : ""}`}>
            <span></span>
            {isRecording ? "Recording in progress" : "Ready to record"}
          </div>

          <div className="microphone-icon">
            🎙️
          </div>

          <h3>
            {isRecording ? "Listening to your voice..." : "Start your recording"}
          </h3>

          <p>
            {isRecording
              ? "Speak naturally. Your recording is in progress."
              : "Click below and allow microphone access to begin."}
          </p>

          <div className="recording-actions">

            {!isRecording ? (
              <button
                className="record-button"
                onClick={startRecording}
              >
                <span className="record-dot"></span>
                Start Recording
              </button>
            ) : (
              <button
                className="stop-button"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            )}

          </div>

          {error && (
            <p className="recording-error">{error}</p>
          )}

          {audioURL && (
            <div className="audio-preview">
              <h4>Recording Preview</h4>
              <audio controls src={audioURL}></audio>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default VoiceWorkspace;
