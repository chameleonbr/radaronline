
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react';

// MinasMicroMap - Final Optimized Version
// 100% Local, No Static Data Imports, No Runtime Merge, Dynamic Metadata

const MinasMicroMap = () => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const macroLayerRef = useRef(null);

    // Navigation State
    const [viewLevel, setViewLevel] = useState('MACRO');
    const [selectedMacro, setSelectedMacro] = useState(null);
    const [selectedMicro, setSelectedMicro] = useState(null);
    const [hoveredInfo, setHoveredInfo] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [loading, setLoading] = useState(true);

    // Refs for Callbacks
    const viewLevelRef = useRef('MACRO');
    const selectedMacroRef = useRef(null);
    const selectedMicroRef = useRef(null);

    // Data Engine (Replaces static imports)
    const dataRef = useRef({
        microFeatures: [],
        macroFeatures: [],
        macroColorMap: {},
        microColorMap: {}
    });

    const getMacroColor = (macro) => dataRef.current.macroColorMap[macro] || '#cbd5e1';
    const getMicroColor = (micro) => dataRef.current.microColorMap[micro] || '#cbd5e1';

    // Layer Refs
    const labelsLayerRef = useRef(null);
    const hoveredMacroRef = useRef(null);
    const hoverLabelRef = useRef(null);

    // Sync Refs
    useEffect(() => {
        viewLevelRef.current = viewLevel;
        selectedMacroRef.current = selectedMacro;
        selectedMicroRef.current = selectedMicro;
    }, [viewLevel, selectedMacro, selectedMicro]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (e.shiftKey) {
                    setViewLevel('MACRO');
                    setSelectedMacro(null);
                    setSelectedMicro(null);
                } else {
                    if (viewLevelRef.current === 'MICRO') {
                        setViewLevel('MACRO');
                        setSelectedMacro(null);
                        setSelectedMicro(null);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ========== LABEL ENGINE ==========
    const updateLabels = () => {
        if (!mapInstanceRef.current || !labelsLayerRef.current) return;

        labelsLayerRef.current.clearLayers();
        const currentLevel = viewLevelRef.current;
        const currentMacro = selectedMacroRef.current;

        const macroLabelAdjustments = {
            "SUL": [-0.35, 0.4], "SUDESTE": [-0.1, 0.2], "OESTE": [0, 0.35],
            "TRIÂNGULO DO SUL": [-0.2, 0.2], "NOROESTE": [-0.1, 0], "JEQUITINHONHA": [0, -0.2]
        };

        const createLabel = (feature, name, fontSize = '11px', isMacro = false) => {
            try {
                if (!feature.properties.center) return null;
                let [lng, lat] = feature.properties.center;

                if (isMacro && currentLevel === 'MACRO' && macroLabelAdjustments[name]) {
                    const [adjLat, adjLng] = macroLabelAdjustments[name];
                    lat += adjLat;
                    lng += adjLng;
                }

                const marker = window.L.marker([lat, lng], {
                    icon: window.L.divIcon({
                        className: 'map-label',
                        html: `<div style="
                            display: flex; justify-content: center; align-items: center; text-align: center;
                            transform: translate(-50%, -50%); font-size: ${fontSize}; font-weight: bold;
                            color: #1e293b; text-shadow: 1px 1px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(255,255,255,0.8), 1px -1px 0 rgba(255,255,255,0.8), -1px 1px 0 rgba(255,255,255,0.8);
                            pointer-events: none; width: 150px; line-height: 1.1;
                        ">${name}</div>`,
                        iconSize: [0, 0], iconAnchor: [0, 0]
                    }),
                    interactive: false
                });
                marker.regionName = name; // Tag for identification
                return marker;
            } catch (e) { return null; }
        };

        if (currentLevel === 'MACRO') {
            dataRef.current.macroFeatures.forEach(feature => {
                const label = createLabel(feature, feature.properties.macroName, '11px', true);
                if (label) labelsLayerRef.current.addLayer(label);
            });
        } else if (currentLevel === 'MICRO' && currentMacro) {
            const relevantMicros = dataRef.current.microFeatures.filter(
                f => f.properties.macroName === currentMacro
            );

            const MIN_DISTANCE = 0.15;
            const labelsPool = [];

            relevantMicros.forEach(feature => {
                const item = {
                    name: feature.properties.microName,
                    lat: feature.properties.center[1],
                    lng: feature.properties.center[0]
                };

                let adjLat = item.lat;
                let adjLng = item.lng;

                for (let j = 0; j < labelsPool.length; j++) {
                    const other = labelsPool[j];
                    const dist = Math.sqrt(Math.pow(adjLat - other.lat, 2) + Math.pow(adjLng - other.lng, 2));

                    if (dist < MIN_DISTANCE) {
                        const angle = Math.atan2(adjLat - other.lat, adjLng - other.lng);
                        const offset = MIN_DISTANCE - dist + 0.05;
                        adjLat += Math.sin(angle) * offset;
                        adjLng += Math.cos(angle) * offset;
                    }
                }

                const tempFeature = { ...feature, properties: { ...feature.properties, center: [adjLng, adjLat] } };
                labelsPool.push({ ...item, lat: adjLat, lng: adjLng });

                const label = createLabel(tempFeature, item.name, '9px');
                if (label) labelsLayerRef.current.addLayer(label);
            });
        }
    };

    // ========== STYLE ENGINE ==========
    const applyStyles = () => {
        if (!geoJsonLayerRef.current) return;

        const currentLevel = viewLevelRef.current;
        const currentMacro = selectedMacroRef.current;
        const currentMicro = selectedMicroRef.current;

        geoJsonLayerRef.current.eachLayer(layer => {
            const props = layer.feature.properties;
            const macro = props.macroName;
            const microName = props.microName;

            let fillColor = '#cbd5e1';
            let color = '#cbd5e1';
            let weight = 0.5;
            let fillOpacity = 1;
            let dashArray = null;

            if (currentLevel === 'MACRO') {
                if (macro && macro !== "Desconhecida") {
                    fillColor = '#f8fafc';
                    color = '#94a3b8';
                    weight = 0.5;
                    fillOpacity = 0.3;
                }
            } else if (currentLevel === 'MICRO') {
                if (macro === currentMacro) {
                    const micColor = getMicroColor(microName);
                    if (microName && micColor) {
                        if (currentMicro === microName) {
                            fillColor = micColor;
                            color = '#ffffff';
                            weight = 2;
                            fillOpacity = 1;
                            dashArray = null;
                        } else {
                            fillColor = micColor;
                            color = '#f8fafc';
                            weight = 1.5;
                            fillOpacity = 0.8;
                            dashArray = '4 5';
                        }
                    } else {
                        fillColor = '#cbd5e1';
                        color = '#94a3b8';
                        weight = 1;
                        fillOpacity = 0.5;
                    }
                } else {
                    fillColor = '#e2e8f0';
                    color = '#cbd5e1';
                    weight = 0.5;
                    fillOpacity = 0.3;
                }
            }
            layer.setStyle({ fillColor, color, weight, fillOpacity, dashArray });
        });

        if (macroLayerRef.current) {
            macroLayerRef.current.setStyle({
                opacity: currentLevel === 'MACRO' ? 1 : 0.6,
                weight: currentLevel === 'MACRO' ? 3 : 2
            });
        }
    };

    useEffect(() => {
        applyStyles();
        updateLabels();
    }, [viewLevel, selectedMacro, selectedMicro]);

    const handleClick = (props) => {
        const { macroName, microName } = props;
        const currentLevel = viewLevelRef.current;
        const currentMicro = selectedMicroRef.current;

        if (!macroName || macroName === "Desconhecida") return;

        if (currentLevel === 'MACRO') {
            setSelectedMacro(macroName);
            setSelectedMicro(null);
            setViewLevel('MICRO');
        } else if (currentLevel === 'MICRO') {
            if (macroName !== selectedMacroRef.current) {
                setSelectedMacro(macroName);
                setSelectedMicro(null);
            } else {
                if (microName && microName !== "Desconhecida") {
                    setSelectedMicro(microName === currentMicro ? null : microName);
                }
            }
        }
    };

    // ========== HIGHLIGHT ==========
    const highlightMacro = (macroName) => {
        if (!geoJsonLayerRef.current || !mapInstanceRef.current) return;
        if (hoveredMacroRef.current === macroName) return;

        if (hoverLabelRef.current) {
            mapInstanceRef.current.removeLayer(hoverLabelRef.current);
            hoverLabelRef.current = null;
        }

        if (hoveredMacroRef.current && hoveredMacroRef.current !== selectedMacroRef.current) {
            clearMacroHighlight();
        }

        hoveredMacroRef.current = macroName;

        // Hide static label for this macro to avoid overlap
        if (labelsLayerRef.current && macroName) {
            labelsLayerRef.current.eachLayer(l => {
                if (l.regionName === macroName && l.getElement()) {
                    l.getElement().style.opacity = '0';
                }
            });
        }

        if (!macroName) return;

        // Highlight
        geoJsonLayerRef.current.eachLayer(layer => {
            if (layer.feature.properties.macroName === macroName) {
                layer.setStyle({
                    fillOpacity: 0.8,
                    fillColor: '#2563eb', // More vibrant blue
                    weight: 2,
                    color: '#ffffff'
                });
                layer.bringToFront();
            }
        });

        if (macroLayerRef.current) macroLayerRef.current.bringToFront();

        // Label - Always show on hover
        const macroFeature = dataRef.current.macroFeatures.find(f => f.properties.macroName === macroName);
        if (macroFeature) {
            let [lng, lat] = macroFeature.properties.center;
            const macroLabelAdjustments = {
                "SUL": [-0.35, 0.4], "SUDESTE": [-0.1, 0.2], "OESTE": [0, 0.35],
                "TRIÂNGULO DO SUL": [-0.2, 0.2], "NOROESTE": [-0.1, 0], "JEQUITINHONHA": [0, -0.2]
            };
            if (macroLabelAdjustments[macroName]) {
                const [adjLat, adjLng] = macroLabelAdjustments[macroName];
                lat += adjLat;
                lng += adjLng;
            }

            const label = window.L.marker([lat, lng], {
                icon: window.L.divIcon({
                    className: 'hover-macro-label',
                    html: `<div style="
                        display: flex; justify-content: center; align-items: center; text-align: center;
                        transform: translate(-50%, -50%); font-size: 18px; font-weight: bold; color: #ffffff;
                        text-shadow: 0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6);
                        white-space: nowrap; pointer-events: none;
                    ">${macroName}</div>`
                }),
                interactive: false, zIndexOffset: 1000
            });
            label.addTo(mapInstanceRef.current);
            hoverLabelRef.current = label;
        }
    };

    const clearMacroHighlight = () => {
        const prevMacro = hoveredMacroRef.current;

        if (hoverLabelRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(hoverLabelRef.current);
            hoverLabelRef.current = null;
        }

        // Restore static label visibility
        if (labelsLayerRef.current && prevMacro) {
            labelsLayerRef.current.eachLayer(l => {
                if (l.regionName === prevMacro && l.getElement()) {
                    l.getElement().style.opacity = '1';
                }
            });
        }

        hoveredMacroRef.current = null;
        applyStyles();
    };

    // ========== INIT ==========
    useEffect(() => {
        const loadLeaflet = () => {
            if (!window.L) {
                const script = document.createElement('script');
                script.src = '/lib/leaflet.js';
                script.async = true;
                script.onload = () => setTimeout(initMap, 100);
                document.head.appendChild(script);

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/lib/leaflet.css';
                document.head.appendChild(link);
            } else {
                initMap();
            }
        };

        const initMap = async () => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            try {
                const map = window.L.map(mapContainerRef.current, {
                    center: [-18.5, -44.5],
                    zoom: 6.5,
                    minZoom: 5,
                    maxZoom: 12,
                    zoomControl: false,
                    attributionControl: false,
                    // Smooth Zoom Config
                    scrollWheelZoom: true,
                    wheelDebounceTime: 40,
                    wheelPxPerZoomLevel: 60,
                    zoomDelta: 0.5,
                    zoomSnap: 0.25,
                    // Pan/Drag
                    dragging: true,
                    inertia: true,
                    inertiaDeceleration: 3000,
                    // Other Zoom Methods
                    doubleClickZoom: 'center', // Double-click resets to center
                    boxZoom: true,
                    keyboard: true,
                    touchZoom: true
                });
                mapInstanceRef.current = map;

                // Load Optimized Data
                const [microRes, macroRes] = await Promise.all([
                    fetch('/data/minas-microregions-optimized.json'),
                    fetch('/data/minas-macroregions-optimized.json')
                ]);
                const microData = await microRes.json();
                const macroData = await macroRes.json();

                // DATA ENGINE: Process Metadata Dynamicallly
                const uniqueMacros = new Set();
                const uniqueMicros = new Set();
                macroData.features.forEach(f => uniqueMacros.add(f.properties.macroName));
                microData.features.forEach(f => uniqueMicros.add(f.properties.microName));

                const sortedMacros = Array.from(uniqueMacros).sort();
                const sortedMicros = Array.from(uniqueMicros).sort();

                const mColorMap = {};
                sortedMacros.forEach((macro, index) => {
                    const hue = (index * 137.508) % 360;
                    mColorMap[macro] = `hsl(${hue}, 60%, 50%)`;
                });

                const micColorMap = {};
                sortedMicros.forEach((micro, index) => {
                    const hue = (index * 45) % 360;
                    micColorMap[micro] = `hsl(${hue}, 70%, 60%)`;
                });

                dataRef.current = {
                    microFeatures: microData.features,
                    macroFeatures: macroData.features,
                    macroColorMap: mColorMap,
                    microColorMap: micColorMap
                };

                // Layers
                const layer = window.L.geoJSON(microData, {
                    style: () => ({ fillColor: '#f8fafc', color: '#94a3b8', weight: 0.5, fillOpacity: 0.3 }),
                    onEachFeature: (feature, layer) => {
                        layer.on({
                            mouseover: () => {
                                const props = feature.properties;
                                const isCurrentMacro = props.macroName === selectedMacroRef.current;

                                if (viewLevelRef.current === 'MACRO') {
                                    setHoveredInfo({ macro: props.macroName });
                                    highlightMacro(props.macroName);
                                } else {
                                    // In MICRO view
                                    if (isCurrentMacro) {
                                        // Selected macro: show micro info + magnetic tooltip
                                        setHoveredInfo({ micro: props.microName, macro: props.macroName });
                                        layer.setStyle({ fillOpacity: 0.9, weight: 2 });
                                    } else {
                                        // Neighbor macro: show ONLY macro info (no magnetic tooltip details)
                                        setHoveredInfo({ macro: props.macroName });
                                        highlightMacro(props.macroName);
                                    }
                                }
                            },
                            mouseout: (e) => {
                                setHoveredInfo(null);
                                clearMacroHighlight();
                                layer.setStyle({
                                    weight: (viewLevelRef.current === 'MICRO' && selectedMicroRef.current === feature.properties.microName) ? 2 : 1.5
                                });
                                applyStyles();
                            },
                            click: (e) => {
                                if (window.L && window.L.DomEvent) {
                                    window.L.DomEvent.stopPropagation(e);
                                }
                                handleClick(feature.properties);
                            }
                        });
                    }
                });
                geoJsonLayerRef.current = layer;
                layer.addTo(map);

                const macroLayer = window.L.geoJSON(macroData, {
                    style: { color: '#334155', weight: 2.5, fillOpacity: 0, interactive: false }
                });
                macroLayerRef.current = macroLayer;
                macroLayer.addTo(map);

                // Map Click -> Deselect Everything
                map.on('click', (e) => {
                    // This ensures clicks on empty space deselect
                    setSelectedMacro(null);
                    setSelectedMicro(null);
                    setViewLevel('MACRO');
                });

                const labelsLayer = window.L.layerGroup().addTo(map);
                labelsLayerRef.current = labelsLayer;
                updateLabels();
                setLoading(false);

            } catch (err) {
                console.error("Erro mapa:", err);
                setLoading(false);
            }
        };

        loadLeaflet();
    }, []);

    // Global Mouse Tracker for Magnetic Tooltip
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-50 relative overflow-hidden font-sans text-slate-800 select-none">
            <style>{` 
                .leaflet-interactive { 
                    cursor: pointer !important; 
                    transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                                fill-opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                                stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .map-glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); }
                .nav-step:hover { color: #2563eb; background: rgba(37, 99, 235, 0.05); }
                .animate-ui { animation: ui-slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes ui-slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                
                .magnetic-tooltip {
                    position: fixed;
                    pointer-events: none;
                    z-index: 9999;
                    padding: 8px 14px;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(4px);
                    color: white;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    border-radius: 10px;
                    transform: translate(-50%, -150%);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                }
            `}</style>

            {/* Magnetic Tooltip */}
            {/* Magnetic Tooltip - Only for deep detail in MICRO view when hovering the active macro */}
            {hoveredInfo && viewLevel === 'MICRO' && hoveredInfo.micro && (
                <div
                    className="magnetic-tooltip flex flex-col items-center gap-0.5 animate-in fade-in zoom-in-95 duration-200"
                    style={{ left: mousePos.x, top: mousePos.y }}
                >
                    <span className="text-[8px] opacity-50 font-black leading-none mb-0.5">{hoveredInfo.macro}</span>
                    <span className="whitespace-nowrap leading-none">
                        {hoveredInfo.micro}
                    </span>
                </div>
            )}

            {/* Background Map Container */}
            <div className="absolute inset-0" ref={mapContainerRef}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-[1000]">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Sincronizando Dados Localmente...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Navigation Bar */}
            <div className="absolute top-8 left-8 right-8 flex items-start justify-between pointer-events-none z-[500] animate-ui">
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <nav className="map-glass rounded-2xl overflow-hidden flex items-center transition-all duration-300">
                        <button
                            onClick={() => { setViewLevel('MACRO'); setSelectedMacro(null); setSelectedMicro(null); }}
                            className={`px-5 py-3.5 flex items-center gap-2.5 transition nav-step ${!selectedMacro ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-500'}`}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full ${!selectedMacro ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className="text-sm font-semibold tracking-tight">Minas Gerais</span>
                        </button>

                        {selectedMacro && (
                            <>
                                <div className="text-slate-300 pointer-events-none translate-y-[0px]">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <button
                                    onClick={() => { setViewLevel('MICRO'); setSelectedMicro(null); }}
                                    className={`px-5 py-3.5 flex items-center gap-2.5 transition nav-step ${selectedMacro && !selectedMicro ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-500'}`}
                                >
                                    <span className="text-sm font-semibold tracking-tight">{selectedMacro}</span>
                                </button>
                            </>
                        )}

                        {selectedMicro && (
                            <>
                                <div className="text-slate-300 pointer-events-none">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <div className="px-5 py-3.5 font-bold text-blue-700 bg-blue-50/50 flex items-center gap-2.5">
                                    <span className="text-sm tracking-tight">{selectedMicro}</span>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* Compact Hover Context */}
                    {hoveredInfo && (
                        <div className="map-glass rounded-xl px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-300 self-start border-l-4 border-l-blue-500/50">
                            <p className="text-sm font-semibold text-slate-700">
                                <span className="opacity-50">{hoveredInfo.macro}</span>
                                {viewLevel === 'MICRO' && hoveredInfo.micro && (
                                    <> <span className="text-blue-300 mx-1.5">/</span> {hoveredInfo.micro} </>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Actions Cluster */}
                <div className="flex flex-col gap-3 items-end pointer-events-auto">
                    <button
                        onClick={() => {
                            if (mapInstanceRef.current) {
                                mapInstanceRef.current.setView([-18.5, -44.5], 6.5, { animate: true });
                            }
                        }}
                        className="map-glass px-5 py-3 rounded-2xl group flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                    >
                        <RefreshCcw className="w-4 h-4 text-blue-600 transition-transform group-hover:rotate-180 duration-500" />
                        <span className="text-sm font-bold text-slate-700 tracking-tight">Redefinir Vista</span>
                    </button>


                </div>
            </div>

            {/* Version Badge */}
            <div className="absolute bottom-8 right-8 pointer-events-none z-[500] opacity-30 select-none">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">
                    MG MAP CORE 2.0
                </p>
            </div>
        </div>
    );
};

export default MinasMicroMap;
