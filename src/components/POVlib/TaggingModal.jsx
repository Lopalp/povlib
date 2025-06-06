import React, { useState } from 'react';
import { X } from 'lucide-react';

const TaggingModal = ({ selectedDemo, filterOptions, onClose, onUpdateTags, onUpdatePositions }) => {
  const [newTag, setNewTag] = useState('');
  const [demoTags, setDemoTags] = useState([...selectedDemo.tags]);
  const [demoPositions, setDemoPositions] = useState([...selectedDemo.positions]);
  
  const addTag = () => {
    if (newTag && !demoTags.includes(newTag)) {
      setDemoTags([...demoTags, newTag]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setDemoTags(demoTags.filter(tag => tag !== tagToRemove));
  };
  
  const addPosition = (position) => {
    if (!demoPositions.includes(position)) {
      setDemoPositions([...demoPositions, position]);
    }
  };
  
  const removePosition = (positionToRemove) => {
    setDemoPositions(demoPositions.filter(position => position !== positionToRemove));
  };
  
  const handleSave = () => {
    onUpdateTags(selectedDemo.id, demoTags);
    onUpdatePositions(selectedDemo.id, demoPositions);
    onClose();
  };
  
  return (
    <div
      className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Tag This Demo</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-700">
            <img src={selectedDemo.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-white">{selectedDemo.title}</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-sm mr-2">{selectedDemo.map}</span>
                <span className="text-gray-400 text-xs">{selectedDemo.players.join(', ')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Positions
              </label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-xl border border-gray-700 min-h-12">
                {demoPositions.map((position, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-yellow-400 text-gray-900 text-sm rounded-full px-3 py-1 font-medium"
                  >
                    {position}
                    <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removePosition(position)} />
                  </div>
                ))}
                
                <div className="relative inline-block">
                  <select
                    className="bg-gray-700 text-sm rounded-full px-3 py-1 cursor-pointer hover:bg-gray-600 text-white border-none outline-none"
                    onChange={(e) => {
                      if (e.target.value) {
                        addPosition(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">+ Add Position</option>
                    {filterOptions.positions[selectedDemo.map]?.map((pos, idx) => (
                      <option key={idx} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4">
                  {demoTags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-700 text-white text-sm rounded-full px-3 py-1 flex items-center group"
                    >
                      {tag}
                      <X 
                        className="ml-2 h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100" 
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Add new tag..."
                    className="flex-1 p-3 bg-gray-700 rounded-l-lg text-white text-sm border-0 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button 
                    onClick={addTag}
                    className="bg-yellow-400 text-gray-900 p-3 rounded-r-lg hover:bg-yellow-300 transition font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleSave}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
              >
                Save Tags
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaggingModal;
