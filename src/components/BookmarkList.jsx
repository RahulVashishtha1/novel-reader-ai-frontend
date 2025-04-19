import { useDispatch } from 'react-redux';
import { removeBookmark } from '../features/novels/novelSlice';

const BookmarkList = ({ bookmarks, novelId, onNavigate, onClose }) => {
  const dispatch = useDispatch();

  const handleRemoveBookmark = (bookmarkId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      dispatch(removeBookmark({ id: novelId, bookmarkId }));
    }
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bookmarks</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No bookmarks yet</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks
            .sort((a, b) => a.page - b.page)
            .map((bookmark) => (
              <li
                key={bookmark._id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
              >
                <button
                  onClick={() => handleNavigate(bookmark.page)}
                  className="flex-1 text-left"
                >
                  <div className="font-medium">
                    Page {bookmark.page}
                  </div>
                  {bookmark.name && (
                    <div className="text-sm text-gray-600">{bookmark.name}</div>
                  )}
                </button>
                <button
                  onClick={() => handleRemoveBookmark(bookmark._id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
