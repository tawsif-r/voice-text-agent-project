# Application Logger (`app_logger.py`)

## 1. Overview

The `app_logger.py` module provides a centralized logging mechanism for the VoiceNest Speech-to-Text application.

It records application events, processing activities, and exceptions in structured JSONL files. The logger helps developers monitor application behavior, trace requests, and troubleshoot errors.

## 2. Implementation

The logger is implemented using Python's built-in standard library. No external logging framework is used.

### Python Modules Used

| Module | Purpose |
|---|---|
| `json` | Serializes log records into JSON format. |
| `logging` | Reports failures encountered while writing logs. |
| `traceback` | Captures exception traceback information. |
| `datetime` | Generates timestamps. |
| `pathlib` | Manages log directory and file paths. |
| `zoneinfo` | Provides Asia/Dhaka timezone support. |
| `threading` | Provides a lock for thread-safe file writing. |

## 3. Log Storage

The logger automatically creates a `logs/` directory in the project directory.

Log files are organized by date using the JSON Lines (`.jsonl`) format.

Example:

```text
logs/
├── 2026-11-23.jsonl
└── 2026-11-24.jsonl
```

Each line represents an independent JSON log record.

## 4. Core Functions

### 4.1 `write_log()`

Records application events in the daily JSONL log file.

**Parameters:**
- `event`: Name of the application event.
- `request_id`: Identifier associated with the request.
- `**details`: Additional event-specific information.

**Responsibilities:**
- Generates a timezone-aware timestamp.
- Creates a structured log record.
- Selects the appropriate daily log file.
- Serializes the record into JSON.
- Appends the record to the file.
- Uses a thread lock to protect concurrent writes.

### 4.2 `log_exception()`

Records exception information when an error occurs.

**Parameters:**
- `event`: Event associated with the failure.
- `error`: Exception object.
- `request_id`: Associated request identifier.
- `**details`: Additional contextual information.

**Responsibilities:**
- Captures the exception message.
- Identifies the exception type.
- Captures the traceback.
- Sends the error information to `write_log()`.

Reusing `write_log()` ensures that normal events and exceptions follow the same logging format.

## 5. Request Tracking

Each request can be associated with a unique `request_id`.

This identifier connects log entries generated during different stages of the same request.

For example, developers can use a request ID to trace an audio request from API reception through transcription and subsequent LLM processing.

## 6. Integration

The centralized logger is imported and used by the following modules:

| Module | Purpose |
|---|---|
| `stt_service.py` | Records API-level events and request activities. |
| `transcribe.py` | Records transcription events and errors. |
| `gemini_llm.py` | Records LLM operations and errors. |

This approach maintains consistent logging across the application.

## 7. Logging Workflow

```text
VoiceNest Application
        |
        v
Application Modules
        |
        v
   app_logger.py
        |
   +----+----+
   |         |
write_log()  log_exception()
   |         |
   +----+----+
        |
        v
  Structured JSON Record
        |
        v
   Daily JSONL File
        |
        v
     logs/
```

## 8. Key Features

- Centralized application logging.
- Structured JSONL log storage.
- Date-based log file organization.
- Asia/Dhaka timezone-aware timestamps.
- Request-level event tracking.
- Exception messages and traceback capture.
- Thread-safe file writing within the same process.
- Reusable logging functions.
- No external logging framework dependency.

## 9. Conclusion

The custom application logger provides a lightweight and centralized approach to recording application events and exceptions in VoiceNest.

It improves debugging, request tracking, and application maintainability while keeping the implementation independent of external logging frameworks.