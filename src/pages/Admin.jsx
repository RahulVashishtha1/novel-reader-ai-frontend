import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../features/users/userSlice';
import { getAllNovels, deleteNovel } from '../features/novels/novelSlice';
import { getAllImageLogs } from '../features/images/imageSlice';
import { formatDate, formatReadingTime } from '../utils/formatters';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { allUsers, loading: usersLoading, error: usersError } = useSelector((state) => state.users);
  const { novels, loading: novelsLoading, error: novelsError } = useSelector((state) => state.novels);
  const { allLogs, loading: logsLoading, error: logsError } = useSelector((state) => state.images);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedImage, setExpandedImage] = useState(null);

  // Track if data has been loaded for each tab
  const [dataLoaded, setDataLoaded] = useState({
    users: false,
    novels: false,
    images: false
  });

  const apiBase = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

  useEffect(() => {
    // Only load data if it hasn't been loaded yet
    if (activeTab === 'users' && !dataLoaded.users) {
      dispatch(getAllUsers())
        .then(() => setDataLoaded(prev => ({ ...prev, users: true })));
    } else if (activeTab === 'novels' && !dataLoaded.novels) {
      dispatch(getAllNovels())
        .then(() => setDataLoaded(prev => ({ ...prev, novels: true })));
    } else if (activeTab === 'images' && !dataLoaded.images) {
      dispatch(getAllImageLogs())
        .then(() => setDataLoaded(prev => ({ ...prev, images: true })));
    }
  }, [dispatch, activeTab, dataLoaded]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their novels and data.')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleDeleteNovel = (novelId) => {
    if (window.confirm('Are you sure you want to delete this novel?')) {
      dispatch(deleteNovel(novelId));
    }
  };

  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    if (activeTab === 'users') {
      return allUsers.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === 'novels') {
      return novels.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === 'images') {
      return allLogs.slice(indexOfFirstItem, indexOfLastItem);
    }

    return [];
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle image click to expand
  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  // Close expanded image
  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <div className="min-h-screen themed-bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold themed-text-primary">Admin Dashboard</h1>
          <button
            onClick={() => {
              if (activeTab === 'users') {
                dispatch(getAllUsers())
                  .then(() => setDataLoaded(prev => ({ ...prev, users: true })));
              } else if (activeTab === 'novels') {
                dispatch(getAllNovels())
                  .then(() => setDataLoaded(prev => ({ ...prev, novels: true })));
              } else if (activeTab === 'images') {
                dispatch(getAllImageLogs())
                  .then(() => setDataLoaded(prev => ({ ...prev, images: true })));
              }
            }}
            className="px-4 py-2 themed-accent-bg text-white rounded-md hover:opacity-90 transition-opacity flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b themed-border mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 themed-accent-text'
                  : 'border-transparent themed-text-secondary hover:themed-text-primary hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('novels')}
              className={`${
                activeTab === 'novels'
                  ? 'border-blue-500 themed-accent-text'
                  : 'border-transparent themed-text-secondary hover:themed-text-primary hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Novels
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-blue-500 themed-accent-text'
                  : 'border-transparent themed-text-secondary hover:themed-text-primary hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Image Logs
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {usersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {usersError}
              </div>
            )}

            {usersLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="themed-text-secondary">Loading users...</div>
              </div>
            ) : (
              <div className="themed-bg-primary shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <li key={user.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-sm font-medium themed-text-primary">{user.name}</p>
                              <p className="text-sm themed-text-secondary">{user.email}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm themed-text-secondary">
                              <span className="mr-1">Novels:</span>
                              <span className="font-medium themed-text-primary">{user.novelCount}</span>
                            </p>
                            <p className="mt-2 flex items-center text-sm themed-text-secondary sm:mt-0 sm:ml-6">
                              <span className="mr-1">Images:</span>
                              <span className="font-medium themed-text-primary">{user.imageCount}</span>
                            </p>
                            <p className="mt-2 flex items-center text-sm themed-text-secondary sm:mt-0 sm:ml-6">
                              <span className="mr-1">Reading Time:</span>
                              <span className="font-medium themed-text-primary">
                                {formatReadingTime(user.readingStats?.totalReadingTime || 0)}
                              </span>
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm themed-text-secondary sm:mt-0">
                            <p>Joined: {formatDate(user.createdAt)}</p>
                            {currentUser && user.id !== currentUser._id ? (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="ml-4 text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="ml-4 text-gray-400 cursor-not-allowed" title="You cannot delete your own account while logged in">
                                Delete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Novels Tab */}
        {activeTab === 'novels' && (
          <div>
            {novelsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {novelsError}
              </div>
            )}

            {novelsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="themed-text-secondary">Loading novels...</div>
              </div>
            ) : (
              <div className="themed-bg-primary shadow overflow-hidden border-b themed-border sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="themed-bg-secondary">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium themed-text-secondary uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium themed-text-secondary uppercase tracking-wider"
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pages
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Uploaded
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="themed-bg-primary divide-y themed-border">
                    {novels.map((novel) => (
                      <tr key={novel._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium themed-text-primary">{novel.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm themed-text-primary">{novel.owner?.name}</div>
                          <div className="text-sm themed-text-secondary">{novel.owner?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {novel.fileType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm themed-text-secondary">
                          {novel.totalPages}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm themed-text-secondary">
                          {formatDate(novel.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteNovel(novel._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Image Logs Tab */}
        {activeTab === 'images' && (
          <div>
            {logsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {logsError}
              </div>
            )}

            {logsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="themed-text-secondary">Loading image logs...</div>
              </div>
            ) : (
              <div className="themed-bg-primary shadow overflow-hidden border-b themed-border sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="themed-bg-secondary">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium themed-text-secondary uppercase tracking-wider"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Novel
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Page
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Style
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Generated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="themed-bg-primary divide-y themed-border">
                    {getCurrentItems().map((log) => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.imageUrl ? (
                            <div
                              className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden"
                              onClick={() => handleImageClick(log.imageUrl.startsWith('http') ? log.imageUrl : `${apiBase}/${log.imageUrl}`)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-xs font-medium">
                                View
                              </div>
                              <img
                                src={log.imageUrl.startsWith('http') ? log.imageUrl : `${apiBase}/${log.imageUrl}`}
                                alt={`Generated for ${log.novel?.title} page ${log.page}`}
                                className="h-16 w-16 object-cover absolute inset-0"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium themed-text-primary">{log.novel?.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm themed-text-primary">{log.user?.name}</div>
                          <div className="text-sm themed-text-secondary">{log.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm themed-text-secondary">
                          {log.page}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {log.style}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm themed-text-secondary">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t themed-border">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border themed-border text-sm font-medium rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'themed-text-primary hover:bg-gray-50'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage * itemsPerPage >= allLogs.length}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border themed-border text-sm font-medium rounded-md ${currentPage * itemsPerPage >= allLogs.length ? 'opacity-50 cursor-not-allowed' : 'themed-text-primary hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm themed-text-secondary">
                        Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * itemsPerPage, allLogs.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, allLogs.length)}</span> of{' '}
                        <span className="font-medium">{allLogs.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border themed-border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'themed-text-primary hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.ceil(allLogs.length / itemsPerPage) }).map((_, index) => {
                          const pageNumber = index + 1;
                          // Only show a few page numbers around the current page
                          if (
                            pageNumber === 1 ||
                            pageNumber === Math.ceil(allLogs.length / itemsPerPage) ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border themed-border text-sm font-medium ${pageNumber === currentPage ? 'themed-accent-bg text-white' : 'themed-text-primary hover:bg-gray-50'}`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            // Show ellipsis
                            return (
                              <span
                                key={pageNumber}
                                className="relative inline-flex items-center px-4 py-2 border themed-border text-sm font-medium themed-text-secondary"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage * itemsPerPage >= allLogs.length}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border themed-border ${currentPage * itemsPerPage >= allLogs.length ? 'opacity-50 cursor-not-allowed' : 'themed-text-primary hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Modal */}
        {expandedImage && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={closeExpandedImage}>
            <div className="relative max-w-4xl max-h-full">
              <button
                className="absolute top-0 right-0 -mt-12 -mr-12 bg-white rounded-full p-2 text-gray-800 hover:text-gray-600 focus:outline-none"
                onClick={closeExpandedImage}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={expandedImage}
                alt="Expanded view"
                className="max-w-full max-h-[80vh] object-contain rounded shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
