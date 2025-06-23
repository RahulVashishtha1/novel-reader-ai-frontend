import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImage, getImagesForPage } from '../features/images/imageSlice';

const ImageGenerator = ({ novelId, page }) => {
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const { currentImages, generatingImage, error } = useSelector((state) => state.images);
  const dispatch = useDispatch();

  const styles = [
    { id: 'default', name: 'Default' },
    { id: 'anime', name: 'Anime' },
    { id: 'realistic', name: 'Realistic' },
    { id: 'watercolor', name: 'Watercolor' },
    { id: 'sketch', name: 'Sketch' },
  ];

  const apiBase = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

  useEffect(() => {
    if (novelId && page) {
      dispatch(getImagesForPage({ novelId, page }));
    }
  }, [dispatch, novelId, page]);

  useEffect(() => {
    if (autoGenerate && novelId && page && currentImages.length === 0 && !generatingImage) {
      handleGenerateImage();
    }
  }, [autoGenerate, novelId, page, currentImages.length, generatingImage]);

  const handleGenerateImage = () => {
    dispatch(generateImage({ novelId, page, style: selectedStyle }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">AI Image Generation</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Image Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {styles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoGenerate"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoGenerate" className="ml-2 block text-gray-700">
            Auto Generate Image
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="continuousMode"
            checked={continuousMode}
            onChange={(e) => setContinuousMode(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="continuousMode" className="ml-2 block text-gray-700">
            Continuous Mode
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerateImage}
        disabled={generatingImage}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
      >
        {generatingImage ? 'Generating...' : 'Generate Image'}
      </button>

      <div className="mt-4">
        {currentImages.length > 0 ? (
          <div className="space-y-4">
            {currentImages.map((image) => (
              <div key={image._id} className="border border-gray-200 rounded-md p-2">
                <img
                  src={image.imageUrl}
                  alt={`Generated for page ${image.page}`}
                  className="w-full h-auto rounded-md"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Style: {image.style}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No images generated yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
