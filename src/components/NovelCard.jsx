import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteNovel } from '../features/novels/novelSlice';
import { formatDate, calculateProgress } from '../utils/formatters';

const NovelCard = ({ novel }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this novel?')) {
      dispatch(deleteNovel(novel._id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 truncate">{novel.title}</h3>
        <div className="text-sm text-gray-500 mb-2">
          Uploaded: {formatDate(novel.createdAt)}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{calculateProgress(novel.lastReadPage, novel.totalPages)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calculateProgress(novel.lastReadPage, novel.totalPages)}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm mb-4">
          <div>
            <span className="font-medium">Pages:</span> {novel.lastReadPage} / {novel.totalPages}
          </div>
          <div>
            <span className="font-medium">Format:</span> {novel.fileType.toUpperCase()}
          </div>
          <div>
            <span className="font-medium">Bookmarks:</span> {novel.bookmarks?.length || 0}
          </div>
          <div>
            <span className="font-medium">Notes:</span> {novel.notes?.length || 0}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/reader/${novel._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition"
          >
            {novel.lastReadPage > 1 ? 'Continue Reading' : 'Start Reading'}
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition"
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
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
