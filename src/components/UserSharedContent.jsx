import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSharedContent, deleteSharedContent } from '../features/sharing/sharingSlice';

const UserSharedContent = () => {
  const dispatch = useDispatch();
  const { userSharedContent, loading, error } = useSelector((state) => state.sharing);
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    dispatch(getUserSharedContent());
  }, [dispatch]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  // Handle copy link
  const handleCopyLink = (shareUrl) => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };
  
  // Handle delete
  const handleDelete = (shareId) => {
    if (confirm('Are you sure you want to delete this shared content? This action cannot be undone.')) {
      dispatch(deleteSharedContent(shareId));
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Filter shared content
  const filteredContent = userSharedContent.filter((content) => {
    if (filter === 'all') return true;
    return content.type === filter;
  });
  
  if (loading && userSharedContent.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading shared content...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  
  if (userSharedContent.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-5xl mb-4">📤</div>
          <h3 className="text-xl font-semibold mb-2">No Shared Content</h3>
          <p className="text-gray-600">
            You haven't shared any content yet. Share passages or your reading progress from the reader.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Your Shared Content</h2>
      
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('passage')}
            className={`px-3 py-1 rounded-md ${
              filter === 'passage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Passages
          </button>
          <button
            onClick={() => setFilter('progress')}
            className={`px-3 py-1 rounded-md ${
              filter === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Progress
          </button>
        </div>
      </div>
      
      {filteredContent.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No shared content matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((content) => (
            <div key={content._id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{content.novel?.title}</div>
                  <div className="text-sm text-gray-600">
                    {content.type === 'passage' ? 'Passage' : 'Reading Progress'} • 
                    Shared on {formatDate(content.createdAt)}
                    {content.expiresAt && ` • Expires on ${formatDate(content.expiresAt)}`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopyLink(content.shareUrl)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy link"
                  >
                    {copied ? '✓' : '🔗'}
                  </button>
                  <button
                    onClick={() => handleDelete(content.shareId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {content.type === 'passage' && (
                <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {content.content}
                </div>
              )}
              
              {content.type === 'progress' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{
                        width: `${content.stats.percentComplete}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {content.stats.currentPage} of {content.stats.totalPages} pages ({content.stats.percentComplete}%)
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <a
                  href={content.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View shared content
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSharedContent;
