# Ostinato

Ostinato is an early prototype of a piano practice app. It connects to a MIDI-enabled piano or keyboard in the browser and responds to notes as they are played.

The goal is to guide users through piano exercises and score their performance on timing, note accuracy, and other practice metrics.

## Current state

The prototype currently:

- Connects to MIDI input devices using the Web MIDI API
- Detects note-on and note-off events
- Highlights matching keys on an on-screen keyboard

Exercise guidance and performance scoring are planned but not yet implemented.

## Run locally

Serve the repository with any local web server. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser that supports the Web MIDI API, connect a MIDI keyboard, and select **Connect MIDI**.
