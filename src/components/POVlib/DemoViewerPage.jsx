// Welcome to your interactive 2D Demo Viewer!
// This component has been restructured to fit a single-file component pattern,
// similar to your project's existing structure. It includes the necessary logic
// to load external libraries before rendering the main view.

'use client';

import React, { useState, useReducer, useEffect, useRef, useCallback } from 'react';

// --- HELPER HOOKS & COMPONENTS ---
// These components are defined in the module scope. They will only be rendered
// after the main component confirms that all external libraries are loaded.

/**
 * A simple hook to load images for Konva.
 */
function useImage(url, crossOrigin) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.src = url;
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    img.onload = () => setImage(img);
  }, [url, crossOrigin]);
  return [image];
}

/**
 * ScoreDisplay Component
 * Shows a numerical value with a count-up animation.
 */
const ScoreDisplay = ({ score, previousScore, label, duration = 2, suffix = '', prefix = '' }) => {
  const CountUp = window.ReactCountUp.default;
  return (
    <div className="bg-white/10 p-4 rounded-lg shadow-lg mb-4 text-white">
      <h4 className="text-sm uppercase text-gray-400 font-semibold">{label}</h4>
      <div className="text-4xl font-bold text-cyan-300 tracking-wider" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.7)' }}>
        <CountUp
          start={previousScore || 0}
          end={score}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          separator="."
          useEasing={true}
        />
      </div>
    </div>
  );
};

/**
 * ControlPanel Component
 * Contains UI elements to interact with the viewer.
 */
const ControlPanel = ({ onResetZoom, zoomLevel }) => (
  <div className="bg-white/10 p-4 rounded-lg shadow-lg mb-4 text-white">
    <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">Steuerung</h3>
    <div className="space-y-4">
      <div>
        <label htmlFor="zoom-slider" className="block text-sm text-gray-300 mb-1">Zoom: {Math.round(zoomLevel * 100)}%</label>
        <input id="zoom-slider" type="range" min="0.2" max="3" step="0.1" value={zoomLevel} disabled className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>
      <button
        onClick={onResetZoom}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
      >
        Zoom zurücksetzen
      </button>
      <div className="text-xs text-gray-500 pt-2 border-t border-gray-700/50">
        <p>Weitere Steuerelemente können hier hinzugefügt werden.</p>
      </div>
    </div>
  </div>
);

/**
 * Inventory Reducer
 */
const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE_ITEM': {
      const { source, destination } = action.payload;
      if (!destination) return state;
      const newSlots = [...state.slots];
      const [movedItem] = newSlots.splice(source.index, 1);
      newSlots.splice(destination.index, 0, movedItem);
      return { ...state, slots: newSlots };
    }
    default:
      return state;
  }
};

/**
 * InventoryView Component
 */
const InventoryView = ({ initialInventoryState }) => {
  const { DragDropContext, Droppable, Draggable } = window.ReactBeautifulDnd;
  const [state, dispatch] = useReducer(inventoryReducer, initialInventoryState);
  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;
    if (!destination) { return; }
    dispatch({ type: 'MOVE_ITEM', payload: { source, destination } });
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/10 p-4 rounded-lg shadow-lg text-white">
        <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">Inventar</h3>
        <Droppable droppableId="inventoryGrid" direction="horizontal">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className={`grid grid-cols-4 gap-2 p-2 rounded-md transition-colors duration-300 ${snapshot.isDraggingOver ? 'bg-cyan-500/20' : 'bg-black/20'}`}>
              {state.slots.map((item, index) => (
                <Draggable key={item ? item.id : `empty-${index}`} draggableId={item ? item.id : `empty-${index}`} index={index} isDragDisabled={!item}>
                  {(providedDraggable, snapshotDraggable) => (
                    <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} className={`h-20 w-full rounded-md border-2 flex items-center justify-center relative ${snapshotDraggable.isDragging ? 'border-cyan-400 scale-110 shadow-2xl z-10' : 'border-gray-600'} ${item ? 'bg-gray-700/80 cursor-grab' : 'bg-gray-800/50'}`}>
                      {item ? (
                        <div className="text-center">
                          <img src={item.icon} alt={item.name} className="w-10 h-10 mx-auto" />
                          <div className="text-xs mt-1 truncate">{item.name}</div>
                          {item.quantity > 1 && <div className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</div>}
                        </div>
                      ) : <div className="text-gray-600 text-3xl">+</div>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

/**
 * HeatmapView Component
 */
const HeatmapView = ({ dataPoints, width, height }) => {
  const heatmapContainerRef = useRef(null);
  useEffect(() => {
    if (typeof window.h337 === 'undefined' || !heatmapContainerRef.current) return;
    const heatmapInstance = window.h337.create({
      container: heatmapContainerRef.current, radius: 60, maxOpacity: 0.6, minOpacity: 0.1, blur: 0.85, gradient: { '.1': 'blue', '.5': 'cyan', '.7': 'yellow', '.95': 'red' }
    });
    if (dataPoints) {
      heatmapInstance.setData({ max: 100, data: dataPoints });
    }
  }, [dataPoints, width, height]);
  return <div ref={heatmapContainerRef} className="absolute top-0 left-0 pointer-events-none" style={{ width, height }} />;
};

/**
 * MainCanvas Component
 */
const MainCanvas = ({ sceneData, width, height, stageScale, setStageScale, stagePos, setStagePos }) => {
  const { Stage, Layer, Rect, Text, Image: KonvaImage } = window.ReactKonva;
  const stageRef = useRef(null);
  const [backgroundImage] = useImage(sceneData.backgroundImageUrl, 'Anonymous');
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStageScale(newScale);
    setStagePos({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
  }, [setStageScale, setStagePos]);

  return (
    <Stage width={width} height={height} scaleX={stageScale} scaleY={stageScale} x={stagePos.x} y={stagePos.y} draggable onWheel={handleWheel} ref={stageRef}>
      <Layer>
        {backgroundImage && <KonvaImage image={backgroundImage} />}
        <Text text="Willkommen im 2D Demo Viewer" fontSize={24} x={20} y={20} fill="white" shadowColor="black" shadowBlur={5} />
        {sceneData.items.map(item => <Rect key={item.id} x={item.x} y={item.y} width={item.width} height={item.height} fill={item.color} shadowColor="black" shadowBlur={10} shadowOpacity={0.6} draggable />)}
      </Layer>
    </Stage>
  );
};

/**
 * DemoViewerContent Component
 * This holds the actual state and logic for the viewer, rendered after libraries are loaded.
 */
const DemoViewerContent = () => {
    // --- MOCK DATA ---
    const getMockData = () => ({
        scene: { backgroundImageUrl: 'https://placehold.co/1200x800/2c3e50/ffffff?text=2D+Spielwelt', items: [{ id: 'item-1', x: 150, y: 200, width: 50, height: 50, color: '#3498db' }, { id: 'item-2', x: 400, y: 350, width: 80, height: 40, color: '#e74c3c' }, { id: 'item-3', x: 600, y: 150, width: 60, height: 60, color: '#f1c40f' }] },
        heatmap: { maxValue: 100, dataPoints: [{ x: 180, y: 230, value: 80, radius: 50 }, { x: 450, y: 370, value: 95, radius: 60 }, { x: 700, y: 500, value: 40, radius: 70 }, { x: 200, y: 550, value: 60, radius: 55 }] },
        inventory: { slots: [{ id: 'inv-1', name: 'Heiltrank', icon: 'https://placehold.co/64x64/e74c3c/ffffff?text=HP', quantity: 3 }, { id: 'inv-2', name: 'Schlüssel', icon: 'https://placehold.co/64x64/f1c40f/ffffff?text=Key', quantity: 1 }, null, { id: 'inv-3', name: 'Münze', icon: 'https://placehold.co/64x64/2ecc71/ffffff?text=Gold', quantity: 42 }, null, null, null, null, { id: 'inv-4', name: 'Schwert', icon: 'https://placehold.co/64x64/95a5a6/ffffff?text=Swrd', quantity: 1 }, null, null, null, null, null, null, null] },
        scores: { points: 1337, level: 12 }
    });
    
    const [mockData] = useState(getMockData());
    const [scores, setScores] = useState(mockData.scores);
    const [prevScores, setPrevScores] = useState({ points: 0, level: 0 });
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateDimensions = () => { if (containerRef.current) { setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight }); } };
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const scoreInterval = setInterval(() => {
            setPrevScores(s => ({...s, points: s.points})); // Capture previous score correctly
            setScores(prev => ({ ...prev, points: prev.points + Math.floor(Math.random() * 500) }));
        }, 5000);
        return () => clearInterval(scoreInterval);
    }, []);

    const handleResetZoom = useCallback(() => {
        setStageScale(1);
        setStagePos({ x: 0, y: 0 });
    }, []);

    return (
        <div className="bg-gray-800 font-sans text-white h-screen w-screen flex flex-col p-4 gap-4">
            <header className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-center text-cyan-300">Umfangreicher 2D Demo Viewer</h1>
            </header>
            <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
                <main ref={containerRef} className="flex-grow bg-gray-900 rounded-xl shadow-2xl relative overflow-hidden">
                    {dimensions.width > 0 && (
                        <>
                            <MainCanvas sceneData={mockData.scene} width={dimensions.width} height={dimensions.height} stageScale={stageScale} setStageScale={setStageScale} stagePos={stagePos} setStagePos={setStagePos} />
                            <HeatmapView dataPoints={mockData.heatmap.dataPoints} width={dimensions.width} height={dimensions.height} />
                        </>
                    )}
                </main>
                <aside className="w-full md:w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
                    <ScoreDisplay score={scores.points} previousScore={prevScores.points} label="Punktestand" suffix=" Pkt."/>
                    <ScoreDisplay score={scores.level} previousScore={prevScores.level} label="Level" prefix="Lv. " />
                    <ControlPanel onResetZoom={handleResetZoom} zoomLevel={stageScale} />
                    <InventoryView initialInventoryState={mockData.inventory} />
                </aside>
            </div>
        </div>
    );
};

/**
 * Main Exported Component
 * This acts as a loader, waiting for external libraries before showing the main viewer.
 * This structure prevents errors if scripts haven't loaded yet.
 */
export default function DemoViewerPage() {
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.ReactKonva && window.ReactBeautifulDnd && window.ReactCountUp && window.h337) {
        setLibrariesLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!librariesLoaded) {
    return (
      <div className="bg-gray-800 font-sans text-white h-screen w-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-xl shadow-2xl">
          <h1 className="text-2xl font-bold text-cyan-300">Lade Viewer-Bibliotheken...</h1>
          <p className="text-gray-400 mt-2">Die interaktive Demo wird vorbereitet.</p>
        </div>
      </div>
    );
  }

  return <DemoViewerContent />;
}
