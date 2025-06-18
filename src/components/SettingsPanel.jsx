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
} from 'lucide-react';

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
    { name: 'System Default', value: 'monospace' },
  ];

  const themes = [
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'Light', value: 'light', icon: Sun },
  ];

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
      aiApiKey: '',
      aiProvider: 'openai',
      autoSave: true,
      wordWrap: true,
      lineNumbers: true,
      minimap: false,
    };
    setLocalSettings(defaultSettings);
    onResetSettings(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-editor-bg border border-gray-600 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
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

        {/* Content */}
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
              <div className="flex gap-3">
                {themes.map((theme) => {
                  const IconComponent = theme.icon;
                  return (
                    <button
                      key={theme.value}
                      onClick={() => handleSettingChange('theme', theme.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                        localSettings.theme === theme.value
                          ? 'border-editor-accent bg-editor-accent bg-opacity-10 text-editor-accent'
                          : 'border-gray-600 text-editor-text hover:border-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent size={16} />
                      {theme.name}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Editor Options */}
            <div className="mt-6 space-y-4">
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

          {/* AI Integration Section */}
          <section>
            <h3 className="text-lg font-medium text-editor-text mb-4 flex items-center gap-2">
              <Zap size={20} />
              AI Integration
            </h3>

            <div className="space-y-4">
              {/* AI Provider */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-editor-text">AI Provider</label>
                <select
                  value={localSettings.aiProvider}
                  onChange={(e) => handleSettingChange('aiProvider', e.target.value)}
                  className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                >
                  <option value="openai">OpenAI (GPT-4)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="google">Google (Gemini)</option>
                  <option value="ollama">Ollama (Local)</option>
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
                    placeholder="Enter your API key..."
                    className="w-full bg-editor-sidebar text-editor-text border border-gray-600 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-editor-accent"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-editor-text"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Your API key is stored locally and never shared. It's used to generate content via AI.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-600 bg-editor-sidebar bg-opacity-50">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-editor-text hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-600 text-editor-text hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-editor-accent text-white hover:bg-blue-600 transition-colors"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;