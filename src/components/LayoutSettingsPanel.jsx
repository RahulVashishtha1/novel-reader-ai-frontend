import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLayout,
  setImagePosition,
  setImageSize,
  setToolbarPosition,
  setShowPageNumbers,
  setFullWidth,
} from '../features/preferences/preferencesSlice';

const LayoutSettingsPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.preferences);
  
  // Local state to track changes before saving
  const [localPreferences, setLocalPreferences] = useState({
    layout: preferences?.layout || 'standard',
    imagePosition: preferences?.imagePosition || 'right',
    imageSize: preferences?.imageSize || 'medium',
    toolbarPosition: preferences?.toolbarPosition || 'right',
    showPageNumbers: preferences?.showPageNumbers !== undefined ? preferences.showPageNumbers : true,
    fullWidth: preferences?.fullWidth || false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalPreferences({
      ...localPreferences,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Apply changes
  const handleApply = () => {
    // Update all preferences
    dispatch(setLayout(localPreferences.layout));
    dispatch(setImagePosition(localPreferences.imagePosition));
    dispatch(setImageSize(localPreferences.imageSize));
    dispatch(setToolbarPosition(localPreferences.toolbarPosition));
    dispatch(setShowPageNumbers(localPreferences.showPageNumbers));
    dispatch(setFullWidth(localPreferences.fullWidth));
    
    // Close the panel
    onClose();
  };

  // Reset to defaults
  const handleReset = () => {
    setLocalPreferences({
      layout: 'standard',
      imagePosition: 'right',
      imageSize: 'medium',
      toolbarPosition: 'right',
      showPageNumbers: true,
      fullWidth: false,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Layout Settings</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Layout Preset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Layout Preset
          </label>
          <select
            name="layout"
            value={localPreferences.layout}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="standard">Standard</option>
            <option value="compact">Compact</option>
            <option value="expanded">Expanded</option>
          </select>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {localPreferences.layout === 'standard' && 'Balanced spacing and padding'}
            {localPreferences.layout === 'compact' && 'Minimal spacing to maximize content area'}
            {localPreferences.layout === 'expanded' && 'Extra spacing for comfortable reading'}
          </p>
        </div>

        {/* Image Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, imagePosition: 'right' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.imagePosition === 'right'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Right
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, imagePosition: 'left' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.imagePosition === 'left'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, imagePosition: 'bottom' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.imagePosition === 'bottom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Bottom
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, imagePosition: 'hidden' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.imagePosition === 'hidden'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Hidden
            </button>
          </div>
        </div>

        {/* Image Size (only show if image is not hidden) */}
        {localPreferences.imagePosition !== 'hidden' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLocalPreferences({ ...localPreferences, imageSize: 'small' })}
                className={`py-2 px-3 rounded-md transition ${
                  localPreferences.imageSize === 'small'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setLocalPreferences({ ...localPreferences, imageSize: 'medium' })}
                className={`py-2 px-3 rounded-md transition ${
                  localPreferences.imageSize === 'medium'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setLocalPreferences({ ...localPreferences, imageSize: 'large' })}
                className={`py-2 px-3 rounded-md transition ${
                  localPreferences.imageSize === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Large
              </button>
            </div>
          </div>
        )}

        {/* Toolbar Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Toolbar Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, toolbarPosition: 'right' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.toolbarPosition === 'right'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Right
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, toolbarPosition: 'left' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.toolbarPosition === 'left'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, toolbarPosition: 'top' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.toolbarPosition === 'top'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => setLocalPreferences({ ...localPreferences, toolbarPosition: 'hidden' })}
              className={`py-2 px-3 rounded-md transition ${
                localPreferences.toolbarPosition === 'hidden'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Hidden
            </button>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showPageNumbers"
                checked={localPreferences.showPageNumbers}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Show page numbers</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="fullWidth"
                checked={localPreferences.fullWidth}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Full width layout</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
          <div 
            className={`
              bg-gray-100 dark:bg-gray-900 rounded-lg p-2 flex 
              ${localPreferences.imagePosition === 'bottom' ? 'flex-col' : 'flex-row'}
              ${localPreferences.layout === 'compact' ? 'gap-1' : localPreferences.layout === 'expanded' ? 'gap-4 p-4' : 'gap-2'}
            `}
            style={{ height: '120px' }}
          >
            {/* Text area */}
            <div 
              className={`
                bg-white dark:bg-gray-800 rounded 
                ${localPreferences.imagePosition === 'left' ? 'order-last' : ''}
                ${localPreferences.imagePosition === 'hidden' ? 'w-full' : 
                  localPreferences.imagePosition === 'bottom' ? 'h-2/3' : 'flex-1'}
              `}
            ></div>
            
            {/* Image area */}
            {localPreferences.imagePosition !== 'hidden' && (
              <div 
                className={`
                  bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400
                  ${localPreferences.imagePosition === 'bottom' ? 'h-1/3 w-full' : ''}
                  ${localPreferences.imageSize === 'small' ? 'w-1/4' : 
                    localPreferences.imageSize === 'large' ? 'w-1/2' : 'w-1/3'}
                `}
              >
                Image
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          Reset to Defaults
        </button>
        <div className="space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettingsPanel;
