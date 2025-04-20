import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadNovel } from '../features/novels/novelSlice';

const NovelUploadForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [useFilenameAsTitle, setUseFilenameAsTitle] = useState(true);
  const { loading, error } = useSelector((state) => state.novels);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();

      if (fileType !== 'txt' && fileType !== 'epub') {
        setFileError('Only .txt and .epub files are allowed');
        setFile(null);
      } else {
        setFileError('');
        setFile(selectedFile);

        // Extract filename without extension as default title
        if (useFilenameAsTitle) {
          const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
          setTitle(fileName);
        }
      }
    }
  };

  // Toggle for using filename as title
  const handleToggleUseFilename = () => {
    setUseFilenameAsTitle(!useFilenameAsTitle);

    // If toggling on and we have a file, set the title
    if (!useFilenameAsTitle && file) {
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!file) {
      setFileError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('novel', file);

    dispatch(uploadNovel(formData))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch(() => {
        // Error is handled in the slice
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Novel</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* File upload first so filename can be used for title */}
        <div className="mb-4">
          <label htmlFor="novel" className="block text-gray-700 font-medium mb-2">
            Novel File (.txt or .epub)
          </label>
          <input
            type="file"
            id="novel"
            accept=".txt,.epub"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Max file size: 10MB
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Title
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useFilename"
                checked={useFilenameAsTitle}
                onChange={handleToggleUseFilename}
                className="mr-2"
              />
              <label htmlFor="useFilename" className="text-sm text-gray-600">
                Use filename as title
              </label>
            </div>
          </div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovelUploadForm;
