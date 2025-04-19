import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getCurrentUser } from '../features/auth/authSlice';
import UserSharedContent from '../components/UserSharedContent';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Use a ref to track if we've already fetched the profile
  const profileFetched = useRef(false);

  useEffect(() => {
    // Only fetch profile if we haven't already and we're not currently loading
    if (!profileFetched.current && !loading && !user) {
      console.log('🔍 Profile component mounted, dispatching getUserProfile');
      profileFetched.current = true;

      dispatch(getUserProfile())
        .unwrap()
        .then(response => {
          console.log('✅ getUserProfile response:', response);
        })
        .catch(error => {
          console.error('❌ getUserProfile error:', error);
          // Reset the flag if there was an error, so we can try again
          profileFetched.current = false;
        });
    }
  }, [dispatch, loading, user]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      bio,
    };

    dispatch(updateUserProfile(userData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setUpdateSuccess(true);
      });
  };

  // Force getCurrentUser if we have a token but no user data
  useEffect(() => {
    if (localStorage.getItem('token') && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);

  // Add detailed logging to help debug
  console.log('🔍 Profile render state:', {
    loading,
    user,
    userStats: user?.stats,
    readingStats: user?.readingStats
  });

  if (loading || !user) {
    console.log('⏳ Profile is still loading or user data is missing');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading profile...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-gray-600">Manage your account and view your shared content</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Profile updated successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'shared'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shared Content
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              <div>
                {!isEditing ? (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Profile Information</h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Edit Profile
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Name</h3>
                          <p className="mt-1">{user?.name}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1">{user?.email}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                          <p className="mt-1">{user?.bio || 'No bio provided'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                          <p className="mt-1 capitalize">{user?.role || 'user'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                          <p className="mt-1">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-xl font-bold mb-4">Reading Stats</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">Novels</div>
                          <div className="text-2xl font-bold">{user?.stats?.totalNovels || 0}</div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">Reading Time</div>
                          <div className="text-2xl font-bold">
                            {(user?.stats?.totalReadingTime || user?.readingStats?.totalReadingTime)
                              ? `${Math.floor((user?.stats?.totalReadingTime || user?.readingStats?.totalReadingTime) / 60)}h ${(user?.stats?.totalReadingTime || user?.readingStats?.totalReadingTime) % 60}m`
                              : '0h 0m'}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">Images Generated</div>
                          <div className="text-2xl font-bold">{user?.stats?.totalImagesGenerated || user?.readingStats?.imagesGenerated || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                        <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows="4"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                          setBio(user?.bio || '');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <UserSharedContent />
            )}
          </div>
        </div>

        <div className="text-center">
          <Link to="/bookshelf" className="text-blue-600 hover:underline">
            Back to Bookshelf
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
