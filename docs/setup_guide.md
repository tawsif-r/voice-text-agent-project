# VoiceNest – Setup Guide

## 1. Project Overview

VoiceNest is a speech-to-text service built with FastAPI and Google's Gemini API.

## 2. Prerequisites

- Python
- pip
- Git

## 3. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd speech_to_text
```

## 4. Create a Virtual Environment

```bash
python3 -m venv .venv
```

Activate the virtual environment:

```bash
source .venv/bin/activate
```

## 5. Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

## 6. Environment Configuration

Create a `.env` file in the project root directory.

Add the required environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_huggingface_token
```

Replace the placeholder values with your own API credentials.

Keep your `.env` file private. Never commit API keys to Git.

## 7. Run the Application

Start the FastAPI server:

```bash
uvicorn stt_service:app --reload
```

## 8. API Documentation

After starting the server, open:

```text
http://127.0.0.1:8000/docs
```

This opens the interactive FastAPI Swagger documentation.

## 9. Deactivate Virtual Environment

When finished, run:

```bash
deactivate
