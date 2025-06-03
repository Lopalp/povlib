'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';

const ParseDemoModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/parse-demo', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      setOutput(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            {loading ? 'Parsing…' : 'Upload & Parse'}
          </button>
        </form>
        {error && <div className="p-4 text-red-500 text-sm break-all">{error}</div>}
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
