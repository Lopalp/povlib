// components/POVlib/CreateDemoModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

const CreateDemoModal = ({
  isOpen,
  onClose,
  matchLink,
  onMatchLinkChange,
  onMatchLinkSubmit,
  selectedFile,
  onFileChange,
  onFileSubmit,
  uploadError,
  onLinkAccount
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-lg w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Demo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-400">Each run consumes <span className="font-bold text-yellow-400">1 credit</span>.</p>

          {/* Match Link Form */}
          <form onSubmit={onMatchLinkSubmit} className="flex gap-2">
            <input
              type="text"
              value={matchLink}
              onChange={e => onMatchLinkChange(e.target.value)}
              placeholder="Paste match link here"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              disabled={!matchLink}
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
            >
              Run Link
            </button>
          </form>

          {/* Faceit Link Button */}
          <button
            onClick={onLinkAccount}
            className="w-full text-center px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            Link Faceit Account
          </button>

          {/* Upload .dem Form */}
          <form onSubmit={onFileSubmit} className="flex items-center gap-2">
            <label className="flex-1 px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center">
              {selectedFile ? selectedFile.name : 'Upload .dem file'}
              <input type="file" accept=".dem" onChange={onFileChange} className="hidden" />
            </label>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
            >
              Run Upload
            </button>
          </form>

          {uploadError && <p className="text-red-500">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreateDemoModal;
