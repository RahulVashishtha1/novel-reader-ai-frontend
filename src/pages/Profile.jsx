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
      <div className="min-h-screen themed-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold themed-text-primary mb-2">Loading profile...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen themed-bg-secondary py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold themed-text-primary">Your Profile</h1>
          <p className="themed-text-secondary">Manage your account and view your shared content</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {updateSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Profile updated successfully!</span>
            </div>
          </div>
        )}

        <div className="themed-bg-primary rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b themed-border">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'themed-text-secondary hover:themed-text-primary'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'shared'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'themed-text-secondary hover:themed-text-primary'
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
                        <h2 className="text-xl font-bold themed-text-primary">Profile Information</h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Edit Profile
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium themed-text-secondary">Name</h3>
                          <p className="mt-1 themed-text-primary">{user?.name}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium themed-text-secondary">Email</h3>
                          <p className="mt-1 themed-text-primary">{user?.email}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium themed-text-secondary">Bio</h3>
                          <p className="mt-1 themed-text-primary">{user?.bio || 'No bio provided'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium themed-text-secondary">Account Type</h3>
                          <p className="mt-1 capitalize themed-text-primary">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user?.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {user?.isAdmin ? 'Administrator' : user?.role || 'Reader'}
                            </span>
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium themed-text-secondary">Member Since</h3>
                          <p className="mt-1 themed-text-primary">
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

                    <div className="border-t themed-border pt-6">
                      <h2 className="text-xl font-bold themed-text-primary mb-4">Reading Stats</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="themed-bg-secondary p-4 rounded-md">
                          <div className="text-sm themed-text-secondary">Novels</div>
                          <div className="text-2xl font-bold themed-text-primary">
                            {user?.stats?.totalNovels || (user?.readingStats ? '?' : 0)}
                          </div>
                        </div>

                        <div className="themed-bg-secondary p-4 rounded-md">
                          <div className="text-sm themed-text-secondary">Reading Time</div>
                          <div className="text-2xl font-bold themed-text-primary">
                            {(() => {
                              // Get reading time from the appropriate source
                              const readingTime = user?.readingStats?.totalReadingTime || user?.stats?.totalReadingTime || 0;
                              const hours = Math.floor(readingTime / 60);
                              const minutes = readingTime % 60;
                              return `${hours}h ${minutes}m`;
                            })()}
                          </div>
                        </div>

                        <div className="themed-bg-secondary p-4 rounded-md">
                          <div className="text-sm themed-text-secondary">Images Generated</div>
                          <div className="text-2xl font-bold themed-text-primary">
                            {user?.readingStats?.imagesGenerated || user?.stats?.totalImagesGenerated || 0}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Link to="/stats" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                          View detailed statistics →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium themed-text-primary mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border themed-border rounded-md shadow-sm themed-bg-secondary themed-text-primary focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium themed-text-primary mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border themed-border rounded-md shadow-sm themed-bg-secondary opacity-75"
                        />
                        <p className="mt-1 text-sm themed-text-secondary">Email cannot be changed</p>
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium themed-text-primary mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows="4"
                          className="mt-1 block w-full px-3 py-2 border themed-border rounded-md shadow-sm themed-bg-secondary themed-text-primary focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tell us about yourself..."
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
                        className="px-4 py-2 border themed-border rounded-md themed-text-primary hover:themed-bg-secondary transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : 'Save Changes'}
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
          <Link to="/bookshelf" className="text-blue-600 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Bookshelf
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
