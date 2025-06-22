import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getSharedContent, clearSharedContent } from '../features/sharing/sharingSlice';

const SharedContentViewer = () => {
  const { shareId } = useParams();
  const dispatch = useDispatch();
  const { sharedContent, loading, error } = useSelector((state) => state.sharing);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const apiBase = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  
  useEffect(() => {
    if (shareId) {
      dispatch(getSharedContent(shareId));
    }
    
    return () => {
      dispatch(clearSharedContent());
    };
  }, [dispatch, shareId]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format reading time
  const formatReadingTime = (minutes) => {
    if (!minutes) return '0 minutes';
    
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    
    return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading shared content...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  if (!sharedContent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-yellow-600 text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-gray-700 mb-6">The shared content you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">VisNovel</h1>
              {isAuthenticated ? (
                <Link to="/bookshelf" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                  Go to Bookshelf
                </Link>
              ) : (
                <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">
                {sharedContent.novel?.title || 'Novel'}
              </h2>
              <div className="text-gray-600 text-sm">
                Shared by {sharedContent.user?.name} on {formatDate(sharedContent.createdAt)}
              </div>
            </div>
            
            {sharedContent.type === 'passage' ? (
              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Page {sharedContent.page}</div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed">{sharedContent.content}</p>
                  </div>
                </div>
                
                {sharedContent.imageUrl && (
                  <div className="mt-6">
                    <div className="text-sm text-gray-600 mb-1">AI Generated Image</div>
                    <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                      <img
                        src={`${apiBase}/${sharedContent.imageUrl}`}
                        alt="AI generated scene"
                        className="max-w-full rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-600 mb-1">Reading Progress</div>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {sharedContent.stats.currentPage} of {sharedContent.stats.totalPages} pages
                        ({sharedContent.stats.percentComplete}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${sharedContent.stats.percentComplete}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Reading Time</div>
                      <div className="font-medium">{formatReadingTime(sharedContent.stats.totalReadingTime)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Bookmarks</div>
                      <div className="font-medium">{sharedContent.stats.bookmarksCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Notes</div>
                      <div className="font-medium">{sharedContent.stats.notesCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Want to read novels with AI-generated images?
              </p>
              {isAuthenticated ? (
                <Link to="/bookshelf" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Go to Your Bookshelf
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Sign In
                  </Link>
                  <Link to="/register" className="inline-block bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedContentViewer;
