import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sharePassage, generateSocialImage, clearSharedContent } from '../features/sharing/sharingSlice';

const SharePassageModal = ({ novelId, page, content, imageId, onClose }) => {
  const dispatch = useDispatch();
  const { sharedContent, socialImage, loading, error } = useSelector((state) => state.sharing);
  
  const [selectedText, setSelectedText] = useState(content || '');
  const [expirationTime, setExpirationTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [shareStep, setShareStep] = useState(1); // 1: Edit, 2: Share options, 3: Result
  const [copied, setCopied] = useState(false);
  
  // Clear shared content when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSharedContent());
    };
  }, [dispatch]);
  
  // Generate social image when shared content is available
  useEffect(() => {
    if (sharedContent && shareStep === 3 && !socialImage) {
      dispatch(generateSocialImage(sharedContent.shareId));
    }
  }, [dispatch, sharedContent, shareStep, socialImage]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  // Handle text change
  const handleTextChange = (e) => {
    setSelectedText(e.target.value);
  };
  
  // Handle share button click
  const handleShare = () => {
    if (shareStep === 1) {
      setShareStep(2);
    } else if (shareStep === 2) {
      const passageData = {
        content: selectedText,
        page,
        imageId,
        expiresIn: expirationTime || null,
        isPublic,
      };
      
      dispatch(sharePassage({ novelId, passageData }))
        .unwrap()
        .then(() => {
          setShareStep(3);
        });
    }
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    if (sharedContent) {
      navigator.clipboard.writeText(sharedContent.shareUrl);
      setCopied(true);
    }
  };
  
  // Handle copy image URL
  const handleCopyImageUrl = () => {
    if (socialImage) {
      navigator.clipboard.writeText(socialImage.fullUrl);
      setCopied(true);
    }
  };
  
  // Handle social media sharing
  const handleShareToSocial = (platform) => {
    if (!sharedContent) return;
    
    let shareUrl;
    const text = encodeURIComponent(`Check out this passage from a novel I'm reading!`);
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
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {shareStep === 1 && 'Share Passage'}
          {shareStep === 2 && 'Share Options'}
          {shareStep === 3 && 'Share Success'}
        </h2>
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
      
      {shareStep === 1 && (
        <div>
          <p className="text-gray-600 mb-4">
            Edit the passage you want to share:
          </p>
          <textarea
            value={selectedText}
            onChange={handleTextChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            rows="6"
          />
          
          {imageId && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mr-2"
                />
                <span>Include the generated image</span>
              </label>
            </div>
          )}
        </div>
      )}
      
      {shareStep === 2 && (
        <div>
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
      )}
      
      {shareStep === 3 && sharedContent && (
        <div>
          <p className="text-green-600 mb-4">
            Your passage has been shared successfully!
          </p>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Share Link</label>
            <div className="flex">
              <input
                type="text"
                value={sharedContent.shareUrl}
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
          
          {socialImage && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Social Image</label>
              <div className="border border-gray-300 rounded-md p-2 mb-2">
                <img
                  src={socialImage.fullUrl}
                  alt="Social share"
                  className="w-full rounded"
                />
              </div>
              <button
                onClick={handleCopyImageUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
              >
                {copied ? 'Copied!' : 'Copy Image URL'}
              </button>
            </div>
          )}
          
          <div className="mt-6">
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
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        {shareStep < 3 ? (
          <>
            <button
              onClick={() => shareStep === 1 ? onClose() : setShareStep(shareStep - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100"
            >
              {shareStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleShare}
              disabled={loading || (shareStep === 1 && !selectedText.trim())}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : shareStep === 1 ? 'Next' : 'Share'}
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default SharePassageModal;
