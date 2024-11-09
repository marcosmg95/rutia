import React, { useState, useRef } from 'react';

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      audioChunksRef.current = []; // Clear recorded chunks
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const sendAudioToApi = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://35.204.96.165:8200/upload_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Audio sent successfully!');
      } else {
        console.error('Failed to send audio');
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  return (
    <div>
      <button
        className={`btn check w-full active`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Deixar de grabar' : 'Començar a grabar'}
      </button>
      {audioBlob && (
        <button onClick={() => sendAudioToApi(audioBlob)}>
          Send to API
        </button>
      )}
    </div>
  );
}

export default AudioRecorder;
