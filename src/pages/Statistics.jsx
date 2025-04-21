import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStats, resetReadingStats } from '../features/users/userSlice';
import { Link } from 'react-router-dom';
import { formatReadingTime } from '../utils/formatters';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const { stats, novelsWithProgress, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetStats = () => {
    dispatch(resetReadingStats())
      .unwrap()
      .then(() => {
        setShowResetConfirm(false);
        // Refresh stats
        dispatch(getUserStats());
      })
      .catch((error) => {
        console.error('Failed to reset stats:', error);
      });
  };

  useEffect(() => {
    dispatch(getUserStats());
  }, [dispatch]);

  // Prepare data for progress chart
  const progressChartData = {
    labels: novelsWithProgress.map((novel) => novel.title),
    datasets: [
      {
        label: 'Reading Progress (%)',
        data: novelsWithProgress.map((novel) => novel.progress),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Tailwind blue-500
        borderColor: 'rgba(37, 99, 235, 1)', // Tailwind blue-600
        borderWidth: 1,
      },
    ],
  };

  // Count completed novels from the actual novel data
  const completedNovels = novelsWithProgress.filter(novel => novel.completed).length;
  const inProgressNovels = novelsWithProgress.length - completedNovels;

  // Prepare data for completion pie chart
  const completionData = {
    labels: ['Completed', 'In Progress'],
    datasets: [
      {
        data: [completedNovels, inProgressNovels],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)'], // green-500, blue-500
        borderColor: ['rgba(22, 163, 74, 1)', 'rgba(37, 99, 235, 1)'], // green-600, blue-600
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen themed-bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold themed-text-primary">Reading Statistics</h1>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Reset Statistics
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading statistics...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="themed-bg-primary overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium themed-text-secondary truncate">
                      Total Reading Time
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold themed-text-primary">
                      {formatReadingTime(stats?.totalReadingTime || 0)}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="themed-bg-primary overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium themed-text-secondary truncate">
                      Pages Read
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold themed-text-primary">
                      {stats?.pagesRead || 0}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="themed-bg-primary overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium themed-text-secondary truncate">
                      Novels Completed
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold themed-text-primary">
                      {stats?.novelsCompleted || 0}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="themed-bg-primary overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium themed-text-secondary truncate">
                      Images Generated
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold themed-text-primary">
                      {stats?.imagesGenerated || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="themed-bg-primary p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 themed-text-primary">Reading Progress</h2>
                {novelsWithProgress.length > 0 ? (
                  <Bar
                    data={progressChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `Progress: ${context.raw}%`;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Progress (%)',
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No novels in your library yet
                  </div>
                )}
              </div>

              <div className="themed-bg-primary p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 themed-text-primary">Novel Completion</h2>
                {novelsWithProgress.length > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <Pie
                      data={completionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No novels in your library yet
                  </div>
                )}
              </div>
            </div>

            {/* Novel progress table */}
            <div className="themed-bg-primary shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold themed-text-primary">Your Novels</h2>
              </div>
              <div className="border-t border-gray-200">
                {novelsWithProgress.length > 0 ? (
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
                          Progress
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium themed-text-secondary uppercase tracking-wider"
                        >
                          Pages
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium themed-text-secondary uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="themed-bg-primary divide-y divide-gray-200">
                      {novelsWithProgress.map((novel) => (
                        <tr key={novel.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium themed-text-primary">
                              {novel.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div
                                className="themed-accent-bg h-2.5 rounded-full"
                                style={{ width: `${novel.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs themed-text-secondary mt-1">
                              {novel.progress}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm themed-text-primary">
                              {novel.lastReadPage} / {novel.totalPages}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                novel.completed
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                              }`}
                            >
                              {novel.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/reader/${novel.id}`}
                              className="themed-accent-text hover:opacity-80 transition-opacity"
                            >
                              {novel.lastReadPage > 1 ? 'Continue' : 'Start'}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 themed-text-secondary">
                    <p className="mb-4">You haven't added any novels yet.</p>
                    <Link
                      to="/bookshelf"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white themed-accent-bg hover:opacity-90 transition-opacity"
                    >
                      Go to Bookshelf
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="themed-bg-primary themed-text-primary rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reset Statistics</h2>
            <p className="mb-6">Are you sure you want to reset all your reading statistics? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 themed-bg-secondary themed-text-primary rounded-md hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleResetStats}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
