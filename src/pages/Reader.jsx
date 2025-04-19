import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTools } from '../context/ToolsContext';
import {
  getNovel,
  getNovelPage,
  addBookmark,
  addNote,
  updateReadingProgress,
  clearCurrentNovel,
} from '../features/novels/novelSlice';
import { generateImage, getImagesForPage, clearCurrentImages } from '../features/images/imageSlice';
import BookmarkList from '../components/BookmarkList';
import NotesList from '../components/NotesList';
import ImageGenerator from '../components/ImageGenerator';

const Reader = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { showTools, setShowTools } = useTools();
  const [bookmarkName, setBookmarkName] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [autoPage, setAutoPage] = useState(false);
  const [autoPageInterval, setAutoPageInterval] = useState(10); // seconds
  const [readingMode, setReadingMode] = useState('single'); // 'single' or 'continuous'
  const [continuousContent, setContinuousContent] = useState([]);
  const [autoGenerateImage, setAutoGenerateImage] = useState(false);
  const [scrollToPage, setScrollToPage] = useState(false);

  const readingTimeRef = useRef(null);
  const autoPageRef = useRef(null);

  const { currentNovel, currentPage: pageData, loading, error } = useSelector((state) => state.novels);
  const { currentImages, generatingImage } = useSelector((state) => state.images);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getNovel(id))
        .unwrap()
        .then((data) => {
          const lastPage = data.novel.lastReadPage || 1;
          setCurrentPage(lastPage);

          // Handle different reading modes for initial load
          if (readingMode === 'continuous') {
            loadContinuousContent(lastPage);
          } else {
            dispatch(getNovelPage({ id, page: lastPage }));
          }

          // Load images for the current page
          dispatch(getImagesForPage({ novelId: id, page: lastPage }));
        })
        .catch(() => {
          // Error is handled in the slice
        });
    }

    // Start tracking reading time
    readingTimeRef.current = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 60000); // Increment every minute

    return () => {
      // Clean up
      if (readingTimeRef.current) {
        clearInterval(readingTimeRef.current);
      }
      if (autoPageRef.current) {
        clearInterval(autoPageRef.current);
      }
      dispatch(clearCurrentNovel());
      dispatch(clearCurrentImages());
    };
  }, [dispatch, id]);

  // Update reading progress when navigating away
  useEffect(() => {
    return () => {
      if (currentNovel && readingTime > 0) {
        dispatch(
          updateReadingProgress({
            id: currentNovel._id,
            progressData: {
              readingTime,
            },
          })
        );
      }
    };
  }, [dispatch, currentNovel, readingTime]);

  // Handle auto page turning
  useEffect(() => {
    if (autoPage) {
      autoPageRef.current = setInterval(() => {
        if (currentPage < (currentNovel?.totalPages || 1)) {
          handlePageChange(currentPage + 1);
        } else {
          // Reached the end of the novel, stop auto-paging
          setAutoPage(false);
        }
      }, autoPageInterval * 1000);
    } else if (autoPageRef.current) {
      clearInterval(autoPageRef.current);
      autoPageRef.current = null;
    }

    return () => {
      if (autoPageRef.current) {
        clearInterval(autoPageRef.current);
      }
    };
  }, [autoPage, autoPageInterval, currentPage, currentNovel?.totalPages]);

  // Handle scroll to page functionality
  useEffect(() => {
    if (scrollToPage && !loading) {
      // Scroll to the top of the content area
      const contentElement = document.getElementById('novel-content');
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollToPage, currentPage, loading]);

  // Handle auto image generation
  useEffect(() => {
    if (autoGenerateImage && currentNovel && currentImages.length === 0 && !generatingImage) {
      dispatch(generateImage({ novelId: currentNovel._id, page: currentPage, style: 'default' }));
    }
  }, [autoGenerateImage, currentPage, currentNovel, currentImages.length, generatingImage, dispatch]);

  const handlePageChange = (newPage) => {
    // Ensure newPage is a valid number and within bounds
    const validatedPage = Math.max(1, Math.min(parseInt(newPage) || 1, currentNovel?.totalPages || 1));

    // If we're already on this page, don't do anything
    if (validatedPage === currentPage) {
      return;
    }

    setCurrentPage(validatedPage);

    // Handle different reading modes
    if (readingMode === 'continuous') {
      // In continuous mode, load multiple pages
      loadContinuousContent(validatedPage);
    } else {
      // In single page mode, just load the current page
      dispatch(getNovelPage({ id, page: validatedPage }));
    }

    // Load images for the new page
    dispatch(getImagesForPage({ novelId: id, page: validatedPage }));

    // Generate image if auto-generate is enabled
    if (autoGenerateImage && currentNovel) {
      dispatch(generateImage({ novelId: currentNovel._id, page: validatedPage, style: 'default' }));
    }

    // Update reading progress
    if (currentNovel) {
      dispatch(
        updateReadingProgress({
          id: currentNovel._id,
          progressData: {
            page: validatedPage,
            readingTime,
          },
        })
      );
      setReadingTime(0); // Reset reading time after updating
    }
  };

  const handleAddBookmark = () => {
    if (currentNovel) {
      dispatch(
        addBookmark({
          id: currentNovel._id,
          bookmarkData: {
            page: currentPage,
            name: bookmarkName,
          },
        })
      );
      setBookmarkName('');
      setShowAddBookmark(false);
    }
  };

  const handleAddNote = () => {
    if (currentNovel && noteContent.trim()) {
      dispatch(
        addNote({
          id: currentNovel._id,
          noteData: {
            page: currentPage,
            content: noteContent,
          },
        })
      );
      setNoteContent('');
      setShowAddNote(false);
    }
  };

  const handleGoToBookshelf = () => {
    navigate('/bookshelf');
  };

  const handleGenerateImage = () => {
    if (currentNovel) {
      dispatch(generateImage({ novelId: currentNovel._id, page: currentPage, style: 'default' }));
    }
  };

  const handleAutoPageIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAutoPageInterval(value);
    }
  };

  const toggleAutoPage = () => {
    setAutoPage(!autoPage);
  };

  const toggleAutoGenerateImage = () => {
    setAutoGenerateImage(!autoGenerateImage);
  };

  const toggleReadingMode = () => {
    const newMode = readingMode === 'single' ? 'continuous' : 'single';
    setReadingMode(newMode);

    // If switching to continuous mode, load multiple pages
    if (newMode === 'continuous' && currentNovel) {
      loadContinuousContent(currentPage);
    } else {
      // If switching to single mode, clear continuous content
      setContinuousContent([]);
    }
  };

  // Function to load multiple pages for continuous mode
  const loadContinuousContent = async (startPage) => {
    if (!currentNovel) return;

    // Clear existing continuous content
    setContinuousContent([]);

    // Determine how many pages to load (current page + 2 more)
    const pagesToLoad = 3;
    const endPage = Math.min(startPage + pagesToLoad - 1, currentNovel.totalPages);

    // Load each page and add to continuous content
    const contentArray = [];
    for (let page = startPage; page <= endPage; page++) {
      try {
        const response = await dispatch(getNovelPage({ id, page })).unwrap();
        contentArray.push({
          page,
          content: response.content
        });
      } catch (error) {
        console.error(`Error loading page ${page}:`, error);
      }
    }

    setContinuousContent(contentArray);
  };

  const toggleScrollToPage = () => {
    setScrollToPage(!scrollToPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)]" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Tools panel (conditionally shown) */}
        {showTools && (
          <div className="w-full md:w-64 bg-white shadow-md p-4 absolute right-0 top-16 z-10 md:relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Tools</h3>
              <button
                onClick={() => setShowTools(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Bookmarks</h4>
                <button
                  onClick={() => {
                    setShowBookmarks(!showBookmarks);
                    setShowNotes(false);
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition text-left"
                >
                  View Bookmarks
                </button>
                <button
                  onClick={() => {
                    setShowAddBookmark(!showAddBookmark);
                    setShowAddNote(false);
                  }}
                  className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-left"
                >
                  Add Bookmark
                </button>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <button
                  onClick={() => {
                    setShowNotes(!showNotes);
                    setShowBookmarks(false);
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition text-left"
                >
                  View Notes
                </button>
                <button
                  onClick={() => {
                    setShowAddNote(!showAddNote);
                    setShowAddBookmark(false);
                  }}
                  className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-left"
                >
                  Add Note
                </button>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Reading Mode</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => readingMode !== 'single' && toggleReadingMode()}
                    className={`flex-1 py-2 px-4 rounded-md transition ${readingMode === 'single' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Single Page
                  </button>
                  <button
                    onClick={() => readingMode !== 'continuous' && toggleReadingMode()}
                    className={`flex-1 py-2 px-4 rounded-md transition ${readingMode === 'continuous' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Continuous
                  </button>
                </div>
              </div>
            </div>

            {showAddBookmark && (
              <div className="mt-4 p-3 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">Add Bookmark</h4>
                <input
                  type="text"
                  value={bookmarkName}
                  onChange={(e) => setBookmarkName(e.target.value)}
                  placeholder="Bookmark name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddBookmark(false)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBookmark}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {showAddNote && (
              <div className="mt-4 p-3 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">Add Note</h4>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your note..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  rows="3"
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddNote(false)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two-column layout for reading */}
        <div className="flex-grow flex flex-col md:flex-row p-4 overflow-hidden">
          {/* Left column - Text reader */}
          <div className="flex-1 flex flex-col mr-0 md:mr-4 mb-4 md:mb-0 h-full">
            <div id="novel-content" className="bg-white shadow-md rounded-lg p-6 flex-grow overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-4 truncate">
                {currentNovel?.title || 'Loading...'}
              </h1>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">Loading content...</div>
                </div>
              ) : readingMode === 'continuous' && continuousContent.length > 0 ? (
                <div className="prose max-w-none">
                  {continuousContent.map((item, index) => (
                    <div key={item.page} className="mb-8">
                      <div className="text-sm text-gray-500 mb-2 border-t pt-2">
                        Page {item.page}
                      </div>
                      <pre className="whitespace-pre-wrap text-lg leading-relaxed font-sans">{item.content}</pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-lg leading-relaxed font-sans">{pageData.content}</pre>
                </div>
              )}
            </div>

            {/* Navigation controls at the bottom */}
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <div className="flex flex-col space-y-4">
                {/* Page navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (readingMode === 'continuous' && continuousContent.length > 0) {
                        // In continuous mode, move back by the number of pages displayed
                        const firstPage = continuousContent[0]?.page || currentPage;
                        const pagesToMove = Math.max(3, continuousContent.length);
                        handlePageChange(Math.max(1, firstPage - pagesToMove));
                      } else {
                        // In single mode, just move back one page
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    disabled={currentPage <= 1 || loading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                    Previous
                  </button>

                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(0, (Math.min(currentPage, currentNovel?.totalPages || 1) / (currentNovel?.totalPages || 1)) * 100))}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-center mt-1 text-sm text-gray-600">
                      {readingMode === 'continuous' && continuousContent.length > 0 ? (
                        <span>Pages {continuousContent[0]?.page} - {continuousContent[continuousContent.length-1]?.page} of {currentNovel?.totalPages || '?'}</span>
                      ) : (
                        <span>Page {Math.min(currentPage, currentNovel?.totalPages || 1)} of {currentNovel?.totalPages || '?'}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (readingMode === 'continuous' && continuousContent.length > 0) {
                        // In continuous mode, move forward by the number of pages displayed
                        const lastPage = continuousContent[continuousContent.length - 1]?.page || currentPage;
                        const pagesToMove = Math.max(3, continuousContent.length);
                        handlePageChange(Math.min(currentNovel?.totalPages || 1, lastPage + 1));
                      } else {
                        // In single mode, just move forward one page
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    disabled={currentPage >= (currentNovel?.totalPages || 1) || loading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                    Next
                  </button>
                </div>

                {/* Jump to page and auto-page controls */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center">
                    <span className="mr-2">Jump to:</span>
                    <input
                      type="number"
                      min="1"
                      max={currentNovel?.totalPages || 1}
                      value={currentPage}
                      onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md mr-2"
                    />
                    <button
                      onClick={() => handlePageChange(currentPage)}
                      disabled={loading}
                      className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition"
                    >
                      Go
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center space-x-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={scrollToPage}
                          onChange={toggleScrollToPage}
                          className="mr-2"
                        />
                        Scroll to Page
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={autoPage}
                          onChange={toggleAutoPage}
                          className="mr-2"
                        />
                        Auto Page
                      </label>

                      {autoPage && (
                        <select
                          value={autoPageInterval}
                          onChange={handleAutoPageIntervalChange}
                          className="border border-gray-300 rounded-md px-2 py-1"
                        >
                          <option value="5">5 sec</option>
                          <option value="10">10 sec</option>
                          <option value="15">15 sec</option>
                          <option value="30">30 sec</option>
                          <option value="60">60 sec</option>
                        </select>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className="mr-2">Mode:</span>
                      <button
                        onClick={() => readingMode !== 'single' && toggleReadingMode()}
                        className={`px-3 py-1 text-sm rounded-md transition ${readingMode === 'single' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
                      >
                        Single
                      </button>
                      <button
                        onClick={() => readingMode !== 'continuous' && toggleReadingMode()}
                        className={`px-3 py-1 text-sm rounded-md transition ${readingMode === 'continuous' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
                      >
                        Continuous
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Image display */}
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">AI Generated Image</h3>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={autoGenerateImage}
                  onChange={toggleAutoGenerateImage}
                  className="mr-2"
                />
                Auto Generate
              </label>
            </div>

            {currentImages.length > 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <img
                  src={`http://localhost:5000/${currentImages[0].imageUrl}`}
                  alt={`Generated for page ${currentPage}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center">
                {generatingImage ? (
                  <div className="text-gray-500">Generating image...</div>
                ) : (
                  <>
                    <div className="text-gray-500 mb-4">No image generated for this page</div>
                    <button
                      onClick={handleGenerateImage}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Generate Image
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals for bookmarks and notes */}
        {showBookmarks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <BookmarkList
                bookmarks={currentNovel?.bookmarks || []}
                novelId={currentNovel?._id}
                onNavigate={handlePageChange}
                onClose={() => setShowBookmarks(false)}
              />
            </div>
          </div>
        )}

        {showNotes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <NotesList
                notes={currentNovel?.notes || []}
                novelId={currentNovel?._id}
                onNavigate={handlePageChange}
                onClose={() => setShowNotes(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reader;
