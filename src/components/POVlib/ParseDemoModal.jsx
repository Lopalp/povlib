'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';

const ParseDemoModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [stage, setStage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    setProgress(0);
    setStage('upload');
    try {
      const urlRes = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name }),
      });
      if (!urlRes.ok) {
        let msg = await urlRes.text();
        try {
          msg = JSON.parse(msg).error || msg;
        } catch {}
        throw new Error(msg);
      }
      const { uploadUrl, gcsUri } = await urlRes.json();

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onload = () => (xhr.status < 400 ? resolve() : reject(new Error('Upload failed')));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });

      setStage('parse');

      const parseRes = await fetch('/api/parse-gcs-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcsUri }),
      });
      if (!parseRes.ok) {
        let msg = await parseRes.text();
        try {
          msg = JSON.parse(msg).error || msg;
        } catch {}
        throw new Error(msg);
      }
      const json = await parseRes.json();
      setOutput(json);
      setStage('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-xl">Parse Demo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-yellow-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            type="file"
            accept=".dem"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-gray-200"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded disabled:opacity-50"
          >
            {loading
              ? stage === 'upload'
                ? `Uploading ${progress ?? 0}%`
                : 'Parsing…'
              : 'Upload & Parse'}
          </button>
          {loading && stage === 'upload' && (
            <div className="text-sm text-gray-400">{progress ?? 0}% uploaded</div>
          )}
        </form>
        {error && <div className="p-4 text-red-500 text-sm break-all">{error}</div>}
        {loading && stage === 'parse' && (
          <div className="p-4 text-gray-400 text-sm">Parsing…</div>
        )}
        {output && (
          <pre className="p-4 text-gray-300 text-xs max-h-64 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(output, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ParseDemoModal;
