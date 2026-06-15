import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

export default function VoiceInput({ onTranscript, onInterim, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, 3000);
  }, [stopRecording]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }
    if (isRecording) {
      stopRecording();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      resetSilenceTimer();
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final) onTranscript(final);
      if (interim && onInterim) onInterim(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isRecording, stopRecording, resetSilenceTimer, onTranscript, onInterim]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            style={{
              position: 'absolute',
              bottom: '110%',
              right: 0,
              background: 'rgba(5,13,18,0.97)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              zIndex: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}
          >
            <AlertTriangle size={13} color="#f87171" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#f87171' }}>
              Web Speech API not supported in this browser
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={startRecording}
        disabled={disabled}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
        style={{
          position: 'relative',
          width: 38,
          height: 38,
          borderRadius: 12,
          border: isRecording
            ? '1px solid rgba(0,255,213,0.5)'
            : '1px solid rgba(255,255,255,0.1)',
          background: isRecording
            ? 'rgba(0,255,213,0.12)'
            : 'rgba(255,255,255,0.04)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Pulse rings when recording */}
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.span
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  border: '2px solid rgba(0,255,213,0.6)',
                  pointerEvents: 'none',
                }}
              />
              <motion.span
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  border: '2px solid rgba(0,255,213,0.35)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {isRecording ? (
          <MicOff size={15} color="#00ffd5" />
        ) : (
          <Mic size={15} color="rgba(225,247,252,0.45)" />
        )}
      </motion.button>
    </div>
  );
}
