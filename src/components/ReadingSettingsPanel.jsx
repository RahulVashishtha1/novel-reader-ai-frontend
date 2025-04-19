import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateReadingPreferences,
  setTheme,
  setFontSize,
  setFontFamily,
  setLineSpacing,
  setLetterSpacing,
  setDyslexiaFriendly,
} from '../features/preferences/preferencesSlice';

const ReadingSettingsPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const { preferences, loading } = useSelector((state) => state.preferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const panelRef = useRef(null);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleThemeChange = (theme) => {
    setLocalPreferences({ ...localPreferences, theme });
    dispatch(setTheme(theme));
  };

  const handleFontSizeChange = (e) => {
    const fontSize = parseInt(e.target.value);
    setLocalPreferences({ ...localPreferences, fontSize });
    dispatch(setFontSize(fontSize));
  };

  const handleFontFamilyChange = (fontFamily) => {
    setLocalPreferences({ ...localPreferences, fontFamily });
    dispatch(setFontFamily(fontFamily));
  };

  const handleLineSpacingChange = (e) => {
    const lineSpacing = parseFloat(e.target.value);
    setLocalPreferences({ ...localPreferences, lineSpacing });
    dispatch(setLineSpacing(lineSpacing));
  };

  const handleLetterSpacingChange = (e) => {
    const letterSpacing = parseFloat(e.target.value);
    setLocalPreferences({ ...localPreferences, letterSpacing });
    dispatch(setLetterSpacing(letterSpacing));
  };

  const handleDyslexiaFriendlyChange = (e) => {
    const dyslexiaFriendly = e.target.checked;
    setLocalPreferences({ ...localPreferences, dyslexiaFriendly });
    dispatch(setDyslexiaFriendly(dyslexiaFriendly));
  };

  const handleSave = () => {
    dispatch(updateReadingPreferences(localPreferences));
    onClose();
  };

  const handleReset = () => {
    const defaultPreferences = {
      theme: 'light',
      fontSize: 16,
      fontFamily: 'system-ui',
      lineSpacing: 1.5,
      letterSpacing: 0,
      dyslexiaFriendly: false,
    };

    setLocalPreferences(defaultPreferences);

    // Apply default preferences immediately
    dispatch(setTheme(defaultPreferences.theme));
    dispatch(setFontSize(defaultPreferences.fontSize));
    dispatch(setFontFamily(defaultPreferences.fontFamily));
    dispatch(setLineSpacing(defaultPreferences.lineSpacing));
    dispatch(setLetterSpacing(defaultPreferences.letterSpacing));
    dispatch(setDyslexiaFriendly(defaultPreferences.dyslexiaFriendly));
  };

  return (
    <div ref={panelRef} className="themed-bg-primary rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold themed-text-primary">Reading Settings</h2>
          <p className="text-sm themed-text-secondary">These settings only apply to the book content</p>
        </div>
        <button
          onClick={onClose}
          className="themed-text-secondary hover:themed-text-primary"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="font-medium themed-text-primary mb-2">Theme</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                localPreferences.theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                localPreferences.theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange('sepia')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                localPreferences.theme === 'sepia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Sepia
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium themed-text-primary">Font Size</h3>
            <span className="themed-text-secondary">{localPreferences.fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={localPreferences.fontSize}
            onChange={handleFontSizeChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs themed-text-secondary mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <h3 className="font-medium themed-text-primary mb-2">Font Family</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFontFamilyChange('system-ui')}
              className={`py-2 px-4 rounded-md transition ${
                localPreferences.fontFamily === 'system-ui'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              style={{ fontFamily: 'system-ui' }}
            >
              System
            </button>
            <button
              onClick={() => handleFontFamilyChange('serif')}
              className={`py-2 px-4 rounded-md transition ${
                localPreferences.fontFamily === 'serif'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              style={{ fontFamily: 'serif' }}
            >
              Serif
            </button>
            <button
              onClick={() => handleFontFamilyChange('sans-serif')}
              className={`py-2 px-4 rounded-md transition ${
                localPreferences.fontFamily === 'sans-serif'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              style={{ fontFamily: 'sans-serif' }}
            >
              Sans-serif
            </button>
            <button
              onClick={() => handleFontFamilyChange('monospace')}
              className={`py-2 px-4 rounded-md transition ${
                localPreferences.fontFamily === 'monospace'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              Monospace
            </button>
          </div>
        </div>

        {/* Line Spacing */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium themed-text-primary">Line Spacing</h3>
            <span className="themed-text-secondary">{localPreferences.lineSpacing}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={localPreferences.lineSpacing}
            onChange={handleLineSpacingChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs themed-text-secondary mt-1">
            <span>Tight</span>
            <span>Spacious</span>
          </div>
        </div>

        {/* Letter Spacing */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium themed-text-primary">Letter Spacing</h3>
            <span className="themed-text-secondary">{localPreferences.letterSpacing}em</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={localPreferences.letterSpacing}
            onChange={handleLetterSpacingChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs themed-text-secondary mt-1">
            <span>Normal</span>
            <span>Wide</span>
          </div>
        </div>

        {/* Dyslexia Friendly */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="dyslexiaFriendly"
            checked={localPreferences.dyslexiaFriendly}
            onChange={handleDyslexiaFriendlyChange}
            className="mr-2"
          />
          <label htmlFor="dyslexiaFriendly" className="themed-text-primary">
            Dyslexia Friendly Mode
          </label>
        </div>

        {/* Preview */}
        <div className="mt-6">
          <h3 className="font-medium themed-text-primary mb-2">Preview</h3>
          <div
            className={`p-4 rounded-md border ${
              localPreferences.theme === 'dark'
                ? 'bg-gray-900 text-gray-100 border-gray-700'
                : localPreferences.theme === 'sepia'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            style={{
              fontFamily: localPreferences.fontFamily === 'dyslexic'
                ? 'OpenDyslexic, sans-serif'
                : localPreferences.fontFamily,
              fontSize: `${localPreferences.fontSize}px`,
              lineHeight: localPreferences.lineSpacing,
              letterSpacing: `${localPreferences.letterSpacing}em`,
            }}
          >
            <p>
              This is a preview of how your text will appear with the current settings.
              Adjust the options above to customize your reading experience.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 border themed-border rounded-md shadow-sm text-sm font-medium themed-text-primary themed-bg-secondary hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingSettingsPanel;
