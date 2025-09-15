import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

export default function VoiceInput({ onTranscript }) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const transcriptRef = useRef(null);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null; // Ẩn component nếu không hỗ trợ
  }

  // Auto scroll transcript to bottom khi có text mới
  useEffect(() => {
    if (transcriptRef.current && transcript) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      language: "vi-VN",
      continuous: true,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    if (onTranscript && transcript.trim()) {
      onTranscript(transcript.trim());
    }
    resetTranscript();
  };

  const toggleListening = () => {
    if (listening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  // Tạo component sóng âm thanh
  const WaveAnimation = () => {
    const waves = [
      { height: "h-2", delay: "delay-0" },
      { height: "h-4", delay: "delay-75" },
      { height: "h-6", delay: "delay-150" },
      { height: "h-4", delay: "delay-200" },
      { height: "h-3", delay: "delay-300" },
    ];

    return (
      <div className="flex items-center justify-center space-x-0.5">
        {waves.map((wave, i) => (
          <div
            key={i}
            className={`w-0.5 bg-white rounded-full ${wave.height} ${wave.delay} animate-bounce`}
            style={{
              animationDuration: `${1 + i * 0.1}s`,
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-all duration-300 ${
          listening
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110"
            : "bg-gray-200 hover:bg-gray-300 text-gray-600"
        }`}
        title={listening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
      >
        {listening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Hiển thị UI khi đang listening */}
      {listening && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs min-w-48 max-w-72 max-h-36">
          <div className="flex items-center space-x-2 mb-1">
            <WaveAnimation />
            <span>Đang nghe...</span>
          </div>
          {/* Hiển thị transcript real-time với scroll */}
          {transcript && (
            <div
              ref={transcriptRef}
              className="text-gray-300 text-xs border-t border-gray-600 pt-1 mt-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scroll-smooth"
            >
              <div className="opacity-75 break-words">
                <span className="text-gray-400">"</span>
                {transcript}
                <span className="text-gray-400 animate-pulse">|</span>
              </div>
            </div>
          )}
          {/* Mũi tên chỉ xuống */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-opacity-90"></div>
        </div>
      )}

      {/* Hiệu ứng pulse khi đang recording */}
      {listening && (
        <div className="absolute inset-0 rounded-lg bg-red-500 opacity-30 animate-ping pointer-events-none"></div>
      )}
    </div>
  );
}
