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

  useEffect(() => {
    if (activeTab === 'users') {
      dispatch(getAllUsers());
    } else if (activeTab === 'novels') {
      dispatch(getAllNovels());
    } else if (activeTab === 'images') {
      dispatch(getAllImageLogs());
    }
  }, [dispatch, activeTab]);

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

  return (
    <div className="min-h-screen themed-bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold themed-text-primary mb-8">Admin Dashboard</h1>

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
                    {allLogs.map((log) => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={`http://localhost:5000/${log.imageUrl}`}
                            alt={`Generated for ${log.novel?.title} page ${log.page}`}
                            className="h-16 w-16 object-cover rounded"
                          />
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
