import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNovels } from '../features/novels/novelSlice';
import NovelCard from '../components/NovelCard';
import NovelUploadForm from '../components/NovelUploadForm';

const Bookshelf = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { novels, loading, error } = useSelector((state) => state.novels);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserNovels());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookshelf</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Upload Novel
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading novels...</div>
          </div>
        ) : novels.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your bookshelf is empty</h2>
            <p className="text-gray-500 mb-6">
              Upload your first novel to get started with VisNovel.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Upload Novel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {novels.map((novel) => (
              <NovelCard key={novel._id} novel={novel} />
            ))}
          </div>
        )}

        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <NovelUploadForm onClose={() => setShowUploadForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookshelf;
