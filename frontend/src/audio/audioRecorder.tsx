import React, { useState, useRef } from 'react';

export function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      audioChunksRef.current = []; // Clear recorded chunks

      // Notify parent component if a callback is provided
      if (onRecordingComplete) {
        onRecordingComplete(audioBlob);
      }
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <div>
      <button
        className="btn check w-full active"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Deixar de grabar' : 'Començar a grabar'}
      </button>
    </div>
  );
}

export default AudioRecorder;
