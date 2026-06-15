import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, File, FileText, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'text/javascript': '.js',
  'application/javascript': '.js',
  'text/typescript': '.ts',
  'application/typescript': '.ts',
  'text/x-python': '.py',
  'application/x-python': '.py',
  'text/x-java': '.java',
  'text/x-c++src': '.cpp',
  'application/json': '.json',
  'text/yaml': '.yaml',
  'application/x-yaml': '.yaml',
  'text/markdown': '.md',
  'text/html': '.html',
  'text/css': '.css',
};

const ALLOWED_EXTENSIONS = ['.pdf','.txt','.js','.ts','.py','.java','.cpp','.json','.yaml','.yml','.md','.html','.css','.jsx','.tsx'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 3;

function getFileIcon(name) {
  const ext = '.' + name.split('.').pop().toLowerCase();
  if (ext === '.pdf') return '📄';
  if (['.js','.ts','.jsx','.tsx'].includes(ext)) return '⚡';
  if (['.py'].includes(ext)) return '🐍';
  if (['.java'].includes(ext)) return '☕';
  if (['.cpp','.c'].includes(ext)) return '⚙️';
  if (['.json','.yaml','.yml'].includes(ext)) return '🗂️';
  if (['.md'].includes(ext)) return '📝';
  if (['.html'].includes(ext)) return '🌐';
  if (['.css'].includes(ext)) return '🎨';
  return '📎';
}

async function extractText(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();

  if (ext === '.pdf') {
    try {
      // Dynamic import to avoid bundling issues
      const pdfjs = await import('pdfjs-dist');
      // Set worker source
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(s => s.str).join(' ') + '\n';
      }
      return text.trim();
    } catch (err) {
      console.error('PDF extraction error:', err);
      return '[PDF text extraction failed — binary content]';
    }
  }

  // All other text-based files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default function FileUpload({ files, onFilesChange, disabled }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});

  const handleFiles = async (newFiles) => {
    if (files.length + newFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files per message`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const valid = [];
    for (const f of newFiles) {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`${f.name}: unsupported file type`);
        setTimeout(() => setError(''), 3000);
        continue;
      }
      if (f.size > MAX_SIZE) {
        setError(`${f.name}: exceeds 10MB limit`);
        setTimeout(() => setError(''), 3000);
        continue;
      }
      valid.push(f);
    }

    if (valid.length === 0) return;
    setUploading(true);

    const extracted = [];
    for (const f of valid) {
      setProgress(p => ({ ...p, [f.name]: 10 }));
      try {
        const text = await extractText(f);
        setProgress(p => ({ ...p, [f.name]: 100 }));
        extracted.push({ file: f, text, name: f.name, size: f.size });
      } catch (err) {
        setProgress(p => ({ ...p, [f.name]: -1 }));
      }
    }

    onFilesChange([...files, ...extracted]);
    setUploading(false);
    setProgress({});
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    handleFiles(dropped);
  };

  const removeFile = (idx) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
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
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              marginBottom: 4,
            }}
          >
            <AlertCircle size={13} color="#f87171" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#f87171' }}>
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(Array.from(e.target.files))}
        onClick={(e) => { e.target.value = ''; }}
      />

      {/* Paperclip Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => !disabled && inputRef.current?.click()}
        disabled={disabled || files.length >= MAX_FILES}
        title="Attach file (max 3, 10MB each)"
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          border: files.length > 0
            ? '1px solid rgba(0,255,213,0.4)'
            : '1px solid rgba(255,255,255,0.1)',
          background: files.length > 0
            ? 'rgba(0,255,213,0.10)'
            : 'rgba(255,255,255,0.04)',
          cursor: (disabled || files.length >= MAX_FILES) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <Paperclip size={15} color={files.length > 0 ? '#00ffd5' : 'rgba(225,247,252,0.45)'} />
        {files.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#00ffd5',
            color: '#000',
            fontSize: 8,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono',
          }}>
            {files.length}
          </span>
        )}
      </motion.button>

      {/* File chips rendered inside the input bar — parent passes this as a portal */}
    </div>
  );
}

// File chips to show in input area
export function FileChips({ files, onRemove }) {
  if (!files || files.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
      {files.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(0,255,213,0.08)',
            border: '1px solid rgba(0,255,213,0.22)',
            fontSize: 11,
            fontFamily: 'JetBrains Mono',
            color: '#76fff0',
            maxWidth: 200,
          }}
        >
          <span>{getFileIcon(f.name)}</span>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 120,
            fontSize: 10,
          }}>
            {f.name}
          </span>
          <span style={{ color: 'rgba(0,255,213,0.5)', fontSize: 9 }}>
            {(f.size / 1024).toFixed(0)}K
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(i)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(0,255,213,0.5)',
              flexShrink: 0,
            }}
          >
            <X size={11} />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

// Build message context from files
export function buildFileContext(files, userMessage) {
  if (!files || files.length === 0) return userMessage;

  const fileContexts = files.map(f =>
    `[FILE CONTENT: ${f.name}]\n${f.text}\n`
  ).join('\n---\n');

  return `${fileContexts}\n---\nUser query: ${userMessage}`;
}

// Badge to show in chat message bubble
export function FileBadges({ fileNames }) {
  if (!fileNames || fileNames.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
      {fileNames.map((name, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 20,
            background: 'rgba(0,255,213,0.06)',
            border: '1px solid rgba(0,255,213,0.15)',
            fontSize: 9,
            fontFamily: 'JetBrains Mono',
            color: 'rgba(0,255,213,0.7)',
          }}
        >
          📎 {name}
        </span>
      ))}
    </div>
  );
}
