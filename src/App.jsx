import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for both standard and webkit prefixed versions
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          setTranscripts(prev => [...prev, transcript]);
        }
      };

      recognition.onerror = (event) => {
        setTranscripts(prev => [...prev, `Error: ${event.error}`]);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setTranscripts(['Speech recognition is not supported in this browser.']);
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscripts([]);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Speech to Text
          </h1>

          <div className="mb-6 flex justify-center space-x-4">
            {!isListening ? (
              <button
                onClick={startListening}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MicrophoneIcon className="h-5 w-5 mr-2" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <StopIcon className="h-5 w-5 mr-2" />
                Stop Recording
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
            {isListening && (
              <div className="text-blue-500 mb-4 text-center">
                Listening... Speak now
              </div>
            )}
            {transcripts.map((text, index) => (
              <div
                key={index}
                className="mb-3 p-3 bg-white rounded shadow"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;