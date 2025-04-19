import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shareProgress, clearSharedContent } from '../features/sharing/sharingSlice';

const ShareProgressCard = ({ novelId, onClose }) => {
  const dispatch = useDispatch();
  const { sharedContent, loading, error } = useSelector((state) => state.sharing);
  const { currentNovel } = useSelector((state) => state.novels);
  
  const [expirationTime, setExpirationTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  // Clear shared content when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSharedContent());
    };
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
  
  // Handle share button click
  const handleShare = () => {
    const progressData = {
      expiresIn: expirationTime || null,
      isPublic,
    };
    
    dispatch(shareProgress({ novelId, progressData }))
      .unwrap()
      .then(() => {
        setIsShared(true);
      });
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    if (sharedContent) {
      navigator.clipboard.writeText(sharedContent.shareUrl);
      setCopied(true);
    }
  };
  
  // Handle social media sharing
  const handleShareToSocial = (platform) => {
    if (!sharedContent) return;
    
    let shareUrl;
    const text = encodeURIComponent(`Check out my reading progress on ${currentNovel?.title || 'this novel'}!`);
    const url = encodeURIComponent(sharedContent.shareUrl);
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
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
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Share Reading Progress</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isShared ? (
        <>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{currentNovel?.title}</h3>
            
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {currentNovel?.lastReadPage || 1} of {currentNovel?.totalPages} pages
                    ({Math.round(((currentNovel?.lastReadPage || 1) / currentNovel?.totalPages) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((currentNovel?.lastReadPage || 1) / currentNovel?.totalPages) * 100))}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Reading Time</div>
                  <div className="font-medium">{formatReadingTime(currentNovel?.totalReadingTime || 0)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Bookmarks</div>
                  <div className="font-medium">{currentNovel?.bookmarks?.length || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Notes</div>
                  <div className="font-medium">{currentNovel?.notes?.length || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Expiration Time (optional)</label>
              <select
                value={expirationTime}
                onChange={(e) => setExpirationTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Never expires</option>
                <option value="24">24 hours</option>
                <option value="72">3 days</option>
                <option value="168">1 week</option>
                <option value="720">30 days</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="mr-2"
                />
                <span>Make this share public (anyone with the link can view)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Share Progress'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-green-600 mb-4">
            Your reading progress has been shared successfully!
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Share Link</label>
            <div className="flex">
              <input
                type="text"
                value={sharedContent?.shareUrl || ''}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Share to social media:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleShareToSocial('twitter')}
                className="flex-1 bg-[#1DA1F2] text-white py-2 px-4 rounded-md hover:bg-opacity-90"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShareToSocial('facebook')}
                className="flex-1 bg-[#4267B2] text-white py-2 px-4 rounded-md hover:bg-opacity-90"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShareToSocial('linkedin')}
                className="flex-1 bg-[#0077B5] text-white py-2 px-4 rounded-md hover:bg-opacity-90"
              >
                LinkedIn
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareProgressCard;
