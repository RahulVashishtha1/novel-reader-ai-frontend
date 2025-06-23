import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sharePassage, generateSocialImage, clearSharedContent } from '../features/sharing/sharingSlice';
import DOMPurify from 'dompurify';

const SharePassageModal = ({ novelId, page, content, imageId, onClose }) => {
  const dispatch = useDispatch();
  const { sharedContent, socialImage, loading, error } = useSelector((state) => state.sharing);
  const { currentImages } = useSelector((state) => state.images);
  const { preferences } = useSelector((state) => state.preferences);

  // Get the current theme from preferences
  const isLightTheme = preferences?.globalTheme === 'light';

  // Get the current image from Redux state
  const currentImage = currentImages && currentImages.length > 0 ? currentImages[0] : null;

  // Construct the image URL correctly - the imageUrl in Redux might already have the full path
  let currentImageUrl = currentImage?.imageUrl || null;

  // For debugging
  console.log('Current image from Redux:', currentImage);
  console.log('Constructed image URL:', currentImageUrl);

  // Clean HTML content if present
  const cleanContent = content && typeof content === 'string' && content.includes('<')
    ? DOMPurify.sanitize(content, { ALLOWED_TAGS: [] }) // Strip all HTML tags
    : content || '';

  const [selectedText, setSelectedText] = useState(cleanContent);
  const [expirationTime, setExpirationTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [shareStep, setShareStep] = useState(1); // 1: Edit, 2: Share options, 3: Result
  const [copied, setCopied] = useState(false);
  const [socialImagePreview, setSocialImagePreview] = useState(null);

  // Clear shared content when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSharedContent());
    };
  }, [dispatch]);

  // Track preview generation state
  const [previewGenerating, setPreviewGenerating] = useState(false);

  // Generate the social image in the preview step
  useEffect(() => {
    if (shareStep === 2 && selectedText) {
      setPreviewGenerating(true);

      // Create a temporary shared content object for preview
      const previewData = {
        content: selectedText,
        novelId,
        page,
        imageId,
        previewMode: true // Flag to indicate this is just a preview
      };

      // Make a direct API call to generate the social image
      const generatePreview = async () => {
        try {
          // Get the image URL from the DOM
          let imageUrl = null;
          const domImage = document.querySelector('.image-container img');

          if (domImage && domImage.src) {
            imageUrl = domImage.src;
            console.log('Using image from DOM for preview:', imageUrl);
            // Add the image URL to the preview data
            previewData.imageUrl = imageUrl;
          } else if (currentImage && currentImageUrl) {
            // Fallback to Redux state
            imageUrl = currentImageUrl;
            console.log('Using image from Redux for preview:', imageUrl);
            previewData.imageUrl = imageUrl;
          } else {
            console.log('No image found for preview');
          }

          // Make a direct API call to the backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sharing/preview`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(previewData)
          });

          if (!response.ok) {
            throw new Error(`Failed to generate preview: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Preview generation response:', data);

          // Set the preview image URL
          if (data.previewUrl) {
            setSocialImagePreview(`${import.meta.env.VITE_API_URL}/${data.previewUrl}`);
          } else if (data.fullUrl) {
            setSocialImagePreview(data.fullUrl);
          } else {
            throw new Error('No preview URL returned');
          }
        } catch (err) {
          console.error('Error generating preview:', err);
        } finally {
          setPreviewGenerating(false);
        }
      };

      generatePreview();
    }
  }, [shareStep, selectedText, imageId, novelId, page, currentImage, currentImageUrl]);

  // Set the social image when shared content is available
  useEffect(() => {
    if (sharedContent && shareStep === 3) {
      if (socialImagePreview && !socialImage) {
        // If we have a preview image, use it instead of generating a new one
        console.log('Using preview image for social image');
        // Create a social image object that matches the expected format
        const previewSocialImage = {
          fullUrl: socialImagePreview,
          socialImageUrl: socialImagePreview
        };
        // Update the Redux state
        dispatch({
          type: 'sharing/generateSocialImage/fulfilled',
          payload: previewSocialImage
        });
      } else if (!socialImage) {
        // If no preview image, generate a new one
        console.log('No preview image available, generating new social image');
        dispatch(generateSocialImage(sharedContent.shareId));
      }
    }
  }, [dispatch, sharedContent, shareStep, socialImage, socialImagePreview]);

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
        previewImageUrl: socialImagePreview // Pass the preview image URL to the backend
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
    <div className="themed-bg-primary themed-text-primary rounded-lg shadow-lg p-4 md:p-6 w-full max-w-4xl mx-auto max-h-[85vh] overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-3 border-b themed-border">
        <div>
          <h2 className="text-xl font-bold themed-text-primary">
            {shareStep === 1 && 'Share Passage'}
            {shareStep === 2 && 'Share Options'}
            {shareStep === 3 && 'Share Success'}
          </h2>
          <p className="text-sm themed-text-secondary mt-1">
            {shareStep === 1 && 'Step 1: Edit your passage'}
            {shareStep === 2 && 'Step 2: Preview and configure sharing options'}
            {shareStep === 3 && 'Your passage has been shared successfully'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {shareStep === 1 && (
        <div className="pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Edit passage */}
            <div>
              <label className="block mb-2 text-lg font-medium themed-text-primary">Edit Passage</label>
              <p className="mb-3 themed-text-secondary">
                Edit the text you want to share:
              </p>
              <textarea
                value={selectedText}
                onChange={handleTextChange}
                className="w-full px-3 py-2 border themed-border rounded-md mb-3 themed-bg-primary themed-text-primary"
                rows="10"
                placeholder="Enter the passage text here..."
              />
            </div>

            {/* Right column - Image and options */}
            <div>
              <label className="block mb-2 text-lg font-medium themed-text-primary">Share Options</label>

              {imageId && (
                <div className="mb-6 p-4 border themed-border rounded-md themed-bg-secondary">
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2 cursor-pointer"
                      readOnly
                    />
                    <span className="themed-text-primary font-medium">Include AI Generated Image</span>
                  </label>

                  <div className="flex items-start mt-3">
                    <div className="flex-shrink-0 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm themed-text-secondary">
                      The AI-generated image will be included in your social share card, making it more engaging when shared on social media platforms.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 border themed-border rounded-md themed-bg-secondary">
                <h3 className="font-medium themed-text-primary mb-2">Sharing Tips</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm themed-text-secondary">
                  <li>Keep your passage concise for better social media engagement</li>
                  <li>Include interesting quotes or highlights from the text</li>
                  <li>The AI image will be generated based on your text content</li>
                  <li>You'll be able to set expiration and privacy options in the next step</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {shareStep === 2 && (
        <div className="pb-20">
          {/* Two-column layout for preview and options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left column - Social Image Preview */}
            <div>
              <label className="block themed-text-primary mb-2 text-lg font-medium">Social Image Preview</label>
              {socialImagePreview ? (
                <div className="border themed-border rounded-md p-3 mb-3 shadow-md">
                  <img
                    src={socialImagePreview}
                    alt="Social share preview"
                    className="w-full rounded"
                  />
                </div>
              ) : (
                <div className="themed-border themed-bg-secondary border rounded-md p-4 flex items-center justify-center h-32">
                  <div className="text-center">
                    {previewGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="themed-text-secondary">
                          {currentImage ? 'Creating preview with your image...' : 'Generating preview...'}
                        </p>
                      </>
                    ) : socialImagePreview ? (
                      <>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="themed-text-secondary">Preview should appear above</p>
                        <p className="text-sm themed-text-secondary mt-1">
                          If you don't see it, please try again
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="themed-text-secondary">Failed to generate preview</p>
                        <p className="text-sm themed-text-secondary mt-1">
                          {currentImage ? 'Could not load the image' : 'No image available'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
              <p className="text-sm mt-2 themed-text-secondary">
                This is how your social share will appear when shared on social media platforms.
              </p>
            </div>

            {/* Right column - Share Options */}
            <div className="flex flex-col">
              <label className="block mb-2 text-lg font-medium themed-text-primary">Share Options</label>

              <div className="mb-4">
                <label className="block mb-2 font-medium themed-text-secondary">Expiration Time</label>
                <select
                  value={expirationTime}
                  onChange={(e) => setExpirationTime(e.target.value)}
                  className="w-full px-3 py-2 border themed-border rounded-md themed-bg-primary themed-text-primary"
                >
                  <option value="">Never expires</option>
                  <option value="24">24 hours</option>
                  <option value="72">3 days</option>
                  <option value="168">1 week</option>
                  <option value="720">30 days</option>
                </select>
                <p className="text-sm mt-1 themed-text-secondary">
                  Set how long this shared content will be available.
                </p>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    className="mr-2"
                  />
                  <span className="themed-text-primary">Make this share public</span>
                </label>
                <p className="text-sm mt-1 themed-text-secondary ml-6">
                  Anyone with the link can view this shared content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shareStep === 3 && sharedContent && (
        <div className="pb-20">
          <p className="text-green-600 mb-4 text-lg font-medium">
            Your passage has been shared successfully!
          </p>

          {/* Two-column layout for social image and options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left column - Social Image */}
            <div>
              <label className="block mb-2 text-lg font-medium themed-text-primary">Social Image</label>
              {socialImage ? (
                <div className="border themed-border rounded-md p-3 mb-3 shadow-md">
                  <img
                    src={socialImage.fullUrl}
                    alt="Social share"
                    className="w-full rounded"
                  />
                </div>
              ) : (
                <div className="themed-border themed-bg-secondary border rounded-md p-4 flex items-center justify-center h-32">
                  <div className="text-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
                        <p className="text-lg themed-text-secondary">Generating social image...</p>
                      </>
                    ) : error ? (
                      <>
                        <div className="flex justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-lg themed-text-secondary">Unable to generate social image</p>
                        <p className="themed-text-secondary text-sm mt-1">Please try again later</p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <p className="text-lg themed-text-secondary">Social image should appear above</p>
                        <p className="themed-text-secondary text-sm mt-1">If you don't see it, please try again</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm themed-text-secondary mt-2">
                This social image will be displayed when your link is shared on social media platforms,
                making your shared passage more engaging and visually appealing.
              </p>
            </div>

            {/* Right column - Image actions and share link */}
            <div className="flex flex-col">
              <label className="block mb-2 text-lg font-medium themed-text-primary">Share Options</label>

              {socialImage && (
                <div className="flex flex-col space-y-3 mb-4">
                  <button
                    onClick={handleCopyImageUrl}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <span className="mr-2">📎</span> {copied ? 'Copied!' : 'Copy Image URL'}
                  </button>
                  <a
                    href={socialImage.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-center flex items-center justify-center"
                  >
                    <span className="mr-2">🔍</span> View Full Size
                  </a>
                </div>
              )}

              {/* Share Link */}
              <div className="mb-4">
                <label className="block mb-2 font-medium themed-text-primary">Share Link</label>
                <div className="flex">
                  <input
                    type="text"
                    value={sharedContent.shareUrl}
                    readOnly
                    className="flex-grow px-3 py-2 border themed-border rounded-l-md themed-bg-primary themed-text-primary"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <a
                  href={sharedContent.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <span className="mr-1">🔍</span> View your shared passage
                </a>
                <p className="text-sm themed-text-secondary mt-1">
                  Opens in a new tab so you can see how it looks to others.
                </p>
                {/* Social Media Sharing */}
                <div className="mt-6 pt-4 border-t themed-border">
                  <label className="block mb-2 font-medium themed-text-primary">Share to social media:</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleShareToSocial('twitter')}
                      className="bg-[#1DA1F2] text-white py-2 px-4 rounded-md hover:bg-opacity-90 flex items-center justify-center"
                    >
                      <span className="mr-2">🐦</span> Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShareToSocial('facebook')}
                      className="bg-[#4267B2] text-white py-2 px-4 rounded-md hover:bg-opacity-90 flex items-center justify-center"
                    >
                      <span className="mr-2">👤</span> Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShareToSocial('linkedin')}
                      className="bg-[#0077B5] text-white py-2 px-4 rounded-md hover:bg-opacity-90 flex items-center justify-center"
                    >
                      <span className="mr-2">💼</span> Share on LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 pt-4 border-t themed-border sticky bottom-0 z-10 themed-bg-primary">
        {shareStep < 3 ? (
          <>
            <button
              onClick={() => shareStep === 1 ? onClose() : setShareStep(shareStep - 1)}
              className="px-5 py-2 border themed-border rounded-md mr-3 themed-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              {shareStep === 1 ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              disabled={loading || (shareStep === 1 && !selectedText.trim())}
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : shareStep === 1 ? (
                <>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  Share
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default SharePassageModal;
