import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  Type,
  Plus,
  Minus,
  Key,
  Palette,
  Settings,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Zap,
  Layout,
  Image,
  Sliders,
  Monitor,
  Contrast,
  Circle
} from 'lucide-react';
import { AVAILABLE_THEMES } from '../hooks/useTheme';

const SettingsPanel = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  const fontFamilies = [
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
    { name: 'Monaco', value: 'Monaco' },
    { name: 'Fira Code', value: 'Fira Code' },
    { name: 'Cascadia Code', value: 'Cascadia Code' },
    { name: 'Source Code Pro', value: 'Source Code Pro' },
    { name: 'Consolas', value: 'Consolas' },
    { name: 'Courier New', value: 'Courier New' },
    { name: 'Roboto Mono', value: 'Roboto Mono' },
    { name: 'Ubuntu Mono', value: 'Ubuntu Mono' },
    { name: 'SF Mono', value: 'SF Mono' },
    { name: 'System Default', value: 'monospace' },
  ];

  // Map theme types to icons
  const getThemeIcon = (theme) => {
    if (theme.name.includes('High Contrast')) return Contrast;
    if (theme.name.includes('Solarized')) return Sun;
    if (theme.name.includes('Monokai')) return Circle;
    if (theme.name.includes('Blue')) return Monitor;
    return theme.type === 'dark' ? Moon : Sun;
  };

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      fontWeight: 400,
      lineHeight: 1.6,
      splitRatio: 50,
      imageMaxWidth: 800,
      imageQuality: 90,
      aiApiKey: '',
      aiProvider: 'openai',
      autoSave: true,
      wordWrap: true,
      lineNumbers: true,
      minimap: false,
      bracketPairs: true,
      autoIndent: true,
      folding: true,
    };
    setLocalSettings(defaultSettings);
    onResetSettings(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-editor-bg border border-gray-600 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-editor-accent" />
            <h2 className="text-xl font-semibold text-editor-text">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 text-editor-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
          {/* Appearance Section */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Palette size={20} />
              Appearance
            </h3>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-editor-text">Theme</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(AVAILABLE_THEMES).map(([key, theme]) => {
                  const IconComponent = getThemeIcon(theme);
                  return (
                    <button
                      key={key}
                      onClick={() => handleSettingChange('theme', key)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-left ${
                        localSettings.theme === key
                          ? 'border-editor-accent bg-editor-accent bg-opacity-10 text-editor-accent'
                          : 'border-gray-600 text-editor-text hover:border-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="text-sm">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Editor Section */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Type size={20} />
              Editor
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Font Family */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">Font Family</label>
                <select
                  value={localSettings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">Font Size</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingChange('fontSize', Math.max(localSettings.fontSize - 1, 10))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 bg-editor-sidebar border border-gray-600 rounded-lg min-w-[4rem] justify-center">
                    <span className="text-editor-text font-medium">{localSettings.fontSize}px</span>
                  </div>
                  <button
                    onClick={() => handleSettingChange('fontSize', Math.min(localSettings.fontSize + 1, 32))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">Font Weight</label>
                <select
                  value={localSettings.fontWeight || 400}
                  onChange={(e) => handleSettingChange('fontWeight', parseInt(e.target.value))}
                  className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                >
                  <option value={300}>Light (300)</option>
                  <option value={400}>Normal (400)</option>
                  <option value={500}>Medium (500)</option>
                  <option value={600}>Semi Bold (600)</option>
                  <option value={700}>Bold (700)</option>
                </select>
              </div>

              {/* Line Height */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">Line Height</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingChange('lineHeight', Math.max((localSettings.lineHeight || 1.6) - 0.1, 1.0))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 bg-editor-sidebar border border-gray-600 rounded-lg min-w-[4rem] justify-center">
                    <span className="text-editor-text font-medium">{(localSettings.lineHeight || 1.6).toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => handleSettingChange('lineHeight', Math.min((localSettings.lineHeight || 1.6) + 0.1, 3.0))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Options */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Line Numbers</label>
                <button
                  onClick={() => handleSettingChange('lineNumbers', !localSettings.lineNumbers)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.lineNumbers ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.lineNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Word Wrap</label>
                <button
                  onClick={() => handleSettingChange('wordWrap', !localSettings.wordWrap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.wordWrap ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.wordWrap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Bracket Pairs</label>
                <button
                  onClick={() => handleSettingChange('bracketPairs', !localSettings.bracketPairs)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.bracketPairs ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.bracketPairs ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Code Folding</label>
                <button
                  onClick={() => handleSettingChange('folding', !localSettings.folding)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.folding ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.folding ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Minimap</label>
                <button
                  onClick={() => handleSettingChange('minimap', !localSettings.minimap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.minimap ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.minimap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-editor-text">Auto Save</label>
                <button
                  onClick={() => handleSettingChange('autoSave', !localSettings.autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.autoSave ? 'bg-editor-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Layout size={20} />
              Layout
            </h3>

            {/* Split View Ratio */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-editor-text">
                Default Editor/Preview Split Ratio: {localSettings.splitRatio || 50}% / {100 - (localSettings.splitRatio || 50)}%
              </label>
              <input
                type="range"
                min="20"
                max="80"
                value={localSettings.splitRatio || 50}
                onChange={(e) => handleSettingChange('splitRatio', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-editor-text opacity-60">
                <span>20% Editor</span>
                <span>50/50</span>
                <span>80% Editor</span>
              </div>
            </div>
          </section>

          {/* Image Management Section */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Image size={20} />
              Image Management
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Max Image Width */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">Max Image Width (px)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingChange('imageMaxWidth', Math.max((localSettings.imageMaxWidth || 800) - 50, 200))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 bg-editor-sidebar border border-gray-600 rounded-lg min-w-[5rem] justify-center">
                    <span className="text-editor-text font-medium">{localSettings.imageMaxWidth || 800}px</span>
                  </div>
                  <button
                    onClick={() => handleSettingChange('imageMaxWidth', Math.min((localSettings.imageMaxWidth || 800) + 50, 2000))}
                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-editor-text transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Image Quality */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">
                  Image Quality: {localSettings.imageQuality || 90}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={localSettings.imageQuality || 90}
                  onChange={(e) => handleSettingChange('imageQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-editor-text opacity-60">
                  <span>Low</span>
                  <span>High</span>
                  <span>Maximum</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Integration Section (if needed) */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Zap size={20} />
              AI Integration
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Provider */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">AI Provider</label>
                <select
                  value={localSettings.aiProvider}
                  onChange={(e) => handleSettingChange('aiProvider', e.target.value)}
                  className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="local">Local Model</option>
                </select>
              </div>

              {/* API Key */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={localSettings.aiApiKey}
                    onChange={(e) => handleSettingChange('aiApiKey', e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-2 p-1 text-editor-text hover:text-editor-accent"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-6 border-t border-gray-600 bg-editor-sidebar flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-editor-text transition-colors"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-editor-text rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-editor-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Custom slider styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--color-bg-accent);
            cursor: pointer;
            box-shadow: 0 0 2px 0 #555;
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--color-bg-accent);
            cursor: pointer;
            border: none;
            box-shadow: 0 0 2px 0 #555;
          }
        `
      }} />
    </div>
  );
};

export default SettingsPanel;