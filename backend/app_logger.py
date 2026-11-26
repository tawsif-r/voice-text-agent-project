import json
import logging
import traceback

from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from threading import Lock


# Log directory
LOG_DIR = Path(__file__).resolve().parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# Bangladesh timezone
TIMEZONE = ZoneInfo("Asia/Dhaka")

# Prevent simultaneous writes within this process
_log_lock = Lock()

# Internal logger for logging-system errors
logger = logging.getLogger(__name__)


def write_log(event: str, request_id: str = None, **details):
    """
    Write application events to a date-wise JSONL log file.
    """

    try:
        timestamp = datetime.now(TIMEZONE)

        log_entry = {
            "timestamp": timestamp.isoformat(),
            "event": event,
            "request_id": request_id,
            **details
        }

        log_file = LOG_DIR / f"{timestamp.strftime('%Y-%m-%d')}.jsonl"

        with _log_lock:
            with open(log_file, "a", encoding="utf-8") as file:
                file.write(
                    json.dumps(log_entry, ensure_ascii=False, default=str)
                    + "\n"
                )

    except Exception:
        # Logging failure must not hide the original application result.
        logger.exception("Failed to write application log.")


def log_exception(
    event: str,
    error: Exception,
    request_id: str = None,
    **details
):
    """
    Write exception details, traceback, and additional metadata.
    """

    write_log(
        event=event,
        request_id=request_id,
        **details,
        error=str(error),
        exception_type=type(error).__name__,
        traceback=traceback.format_exc()
    )
