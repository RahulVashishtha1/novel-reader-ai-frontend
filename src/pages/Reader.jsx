import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTools } from "../context/ToolsContext";
import ReadingSettingsPanel from "../components/ReadingSettingsPanel";
import LayoutSettingsPanel from "../components/LayoutSettingsPanel";
import BookThemeProvider from "../components/BookThemeProvider";
import TextHighlighter from "../components/TextHighlighter";
import AnnotationsList from "../components/AnnotationsList";
import SharePassageModal from "../components/SharePassageModal";
import ShareProgressCard from "../components/ShareProgressCard";
import {
  getNovel,
  getNovelPage,
  addBookmark,
  addNote,
  updateReadingProgress,
  clearCurrentNovel,
} from "../features/novels/novelSlice";
import {
  generateImage,
  getImagesForPage,
  clearCurrentImages,
} from "../features/images/imageSlice";
import {
  getPageAnnotations,
  clearAnnotations,
} from "../features/annotations/annotationsSlice";
import BookmarkList from "../components/BookmarkList";
import NotesList from "../components/NotesList";
import ImageGenerator from "../components/ImageGenerator";

const Reader = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { showTools, setShowTools } = useTools();
  const [bookmarkName, setBookmarkName] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [autoPage, setAutoPage] = useState(false);
  const [autoPageInterval, setAutoPageInterval] = useState(10); // seconds
  const [readingMode, setReadingMode] = useState("single"); // 'single', 'continuous', 'scroll', or 'paginated'
  const [continuousContent, setContinuousContent] = useState([]);
  const [autoGenerateImage, setAutoGenerateImage] = useState(false);
  const [imageStyle, setImageStyle] = useState('default');
  const [scrollToPage, setScrollToPage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showSharePassage, setShowSharePassage] = useState(false);
  const [showShareProgress, setShowShareProgress] = useState(false);
  const [selectedPassage, setSelectedPassage] = useState("");
  const [jumpToPage, setJumpToPage] = useState("");

  const readingTimeRef = useRef(null);
  const autoPageRef = useRef(null);

  const {
    currentNovel,
    currentPage: pageData,
    loading,
    error,
  } = useSelector((state) => state.novels);
  const { currentImages, generatingImage } = useSelector(
    (state) => state.images
  );
  const { preferences } = useSelector((state) => state.preferences);
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
          if (readingMode === "continuous") {
            loadContinuousContent(lastPage);
          } else {
            dispatch(getNovelPage({ id, page: lastPage }));
          }

          // Load images for the current page
          dispatch(getImagesForPage({ novelId: id, page: lastPage }));

          // Load annotations for the current page
          dispatch(getPageAnnotations({ novelId: id, page: lastPage }));
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
      dispatch(clearAnnotations());
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
      const contentElement = document.getElementById("novel-content");
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [scrollToPage, currentPage, loading]);

  // Handle auto image generation
  useEffect(() => {
    if (
      autoGenerateImage &&
      currentNovel &&
      currentImages.length === 0 &&
      !generatingImage
    ) {
      dispatch(
        generateImage({
          novelId: currentNovel._id,
          page: currentPage,
          style: "default",
        })
      );
    }
  }, [
    autoGenerateImage,
    currentPage,
    currentNovel,
    currentImages.length,
    generatingImage,
    dispatch,
  ]);

  const handlePageChange = (newPage) => {
    // Ensure newPage is a valid number and within bounds
    const validatedPage = Math.max(
      1,
      Math.min(parseInt(newPage) || 1, currentNovel?.totalPages || 1)
    );

    // If we're already on this page, don't do anything
    if (validatedPage === currentPage) {
      return;
    }

    setCurrentPage(validatedPage);

    // Handle different reading modes
    if (readingMode === "continuous") {
      // In continuous mode, load multiple pages
      loadContinuousContent(validatedPage);
    } else {
      // In single page mode, just load the current page
      dispatch(getNovelPage({ id, page: validatedPage }));
    }

    // Load images for the new page
    dispatch(getImagesForPage({ novelId: id, page: validatedPage }));

    // Load annotations for the new page
    dispatch(getPageAnnotations({ novelId: id, page: validatedPage }));

    // Generate image if auto-generate is enabled
    if (autoGenerateImage && currentNovel) {
      dispatch(
        generateImage({
          novelId: currentNovel._id,
          page: validatedPage,
          style: imageStyle,
        })
      );
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
      setBookmarkName("");
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
      setNoteContent("");
      setShowAddNote(false);
    }
  };

  const handleGoToBookshelf = () => {
    navigate("/bookshelf");
  };

  const handleGenerateImage = () => {
    if (currentNovel) {
      dispatch(
        generateImage({
          novelId: currentNovel._id,
          page: currentPage,
          style: imageStyle,
        })
      );
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

  // Set reading mode
  const setReaderMode = (mode) => {
    if (mode === readingMode) return;

    setReadingMode(mode);

    // If switching to continuous or scroll mode, load multiple pages
    if ((mode === "continuous" || mode === "scroll") && currentNovel) {
      loadContinuousContent(currentPage);
    } else {
      // If switching to single or paginated mode, clear continuous content
      setContinuousContent([]);
    }
  };

  // Legacy toggle function for backward compatibility
  const toggleReadingMode = () => {
    const newMode = readingMode === "single" ? "continuous" : "single";
    setReaderMode(newMode);
  };

  // Function to load multiple pages for continuous mode
  const loadContinuousContent = async (startPage) => {
    if (!currentNovel) return;

    // Clear existing continuous content
    setContinuousContent([]);

    // Determine how many pages to load (current page + 2 more)
    const pagesToLoad = 3;
    const endPage = Math.min(
      startPage + pagesToLoad - 1,
      currentNovel.totalPages
    );

    // Load each page and add to continuous content
    const contentArray = [];
    for (let page = startPage; page <= endPage; page++) {
      try {
        const response = await dispatch(getNovelPage({ id, page })).unwrap();
        contentArray.push({
          page,
          content: response.content,
          metadata: response.metadata || null,
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

  // Handle sharing a passage
  const handleSharePassage = () => {
    // Get the current page content
    const content =
      readingMode === "continuous" && continuousContent.length > 0
        ? continuousContent.find((item) => item.page === currentPage)
            ?.content || pageData.content
        : pageData.content;

    // Get the current image ID if available
    const currentImage = currentImages.length > 0 ? currentImages[0] : null;

    setSelectedPassage(content);
    setShowSharePassage(true);
  };

  // Handle sharing reading progress
  const handleShareProgress = () => {
    setShowShareProgress(true);
  };

  return (
    <div className=" themed-bg-secondary flex flex-col w-full max-w-none items-center">
      {/* Main content */}
      <div
        className="flex-grow flex flex-col md:flex-row overflow-hidden"
        // style={{ height: "calc(100vh - 120px)" }}
      >
        {/* Customizable layout for reading */}
        <div
          className={`
          flex-grow flex flex-col ${
            preferences?.layout !== "compact" ? "px-3 py-4" : "p-2"
          } overflow-hidden min-h-0 min-w-0  mx-auto w-full
          ${
            preferences?.imagePosition === "bottom"
              ? "md:flex-col"
              : "md:flex-row"
          }
          ${preferences?.layout === "expanded" ? "space-x-3 space-y-3" : ""}
        `}
        >
          {/* Tools panel (conditionally shown) */}
          {showTools && (
            <div
              className={`
             min-w-fit flex-shrink-0 themed-bg-primary shadow-md p-4 z-10 themed-text-primary overflow-y-auto mr-2 rounded-lg
            ${preferences?.toolbarPosition === "hidden" ? "hidden" : ""}
            ${
              preferences?.toolbarPosition === "top"
                ? "w-full h-auto mb-4"
                : "absolute md:relative"
            }
            ${
              preferences?.toolbarPosition === "left"
                ? "order-first left-0 md:mr-2"
                : "right-0"
            }
            ${preferences?.toolbarPosition !== "top" ? "" : "top-0"}
            ${
              preferences?.toolbarPosition !== "top"
                ? "max-h-[calc(100vh-64px)]"
                : ""
            }
            ${
              preferences?.layout === "compact"
                ? "md:p-2"
                : preferences?.layout === "expanded"
                ? "md:p-6"
                : "md:p-4"
            }
          `}
          style={{
                  height: "calc(100vh - 180px)",
                  maxHeight: "calc(100vh - 180px)",
                }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Tools</h3>
                <button
                  onClick={() => setShowTools(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Bookmarks</h4>
                  <button
                    onClick={() => {
                      setShowBookmarks(!showBookmarks);
                      setShowNotes(false);
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <span className="mr-2">🔖</span> View Bookmarks
                  </button>
                  <button
                    onClick={() => {
                      setShowAddBookmark(!showAddBookmark);
                      setShowAddNote(false);
                    }}
                    className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <span className="mr-2">+</span> Add Bookmark
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                  <button
                    onClick={() => {
                      setShowNotes(!showNotes);
                      setShowBookmarks(false);
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <span className="mr-2">📝</span> View Notes
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNote(!showAddNote);
                      setShowAddBookmark(false);
                    }}
                    className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <span className="mr-2">+</span> Add Note
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Reading Mode
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => setReaderMode("single")}
                      className={`py-2 px-3 rounded-md transition ${
                        readingMode === "single"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Single Page
                    </button>
                    <button
                      onClick={() => setReaderMode("continuous")}
                      className={`py-2 px-3 rounded-md transition ${
                        readingMode === "continuous"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Continuous
                    </button>
                    <button
                      onClick={() => setReaderMode("scroll")}
                      className={`py-2 px-3 rounded-md transition ${
                        readingMode === "scroll"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Scrollable
                    </button>
                    <button
                      onClick={() => setReaderMode("paginated")}
                      className={`py-2 px-3 rounded-md transition ${
                        readingMode === "paginated"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Paginated
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Annotations
                  </h4>
                  <button
                    onClick={() => {
                      setShowAnnotations(!showAnnotations);
                      setShowBookmarks(false);
                      setShowNotes(false);
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <span className="mr-2">🔍</span> View Annotations
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Share</h4>
                  <button
                    onClick={handleSharePassage}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center mb-2"
                  >
                    <span className="mr-2">🔗</span> Share Passage
                  </button>
                  <button
                    onClick={handleShareProgress}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <span className="mr-2">📈</span> Share Progress
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Display Settings
                  </h4>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center mb-2"
                  >
                    <span className="mr-2">⚙️</span> Customize Appearance
                  </button>
                  <button
                    onClick={() => setShowLayoutSettings(true)}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <span className="mr-2">🖰</span> Customize Layout
                  </button>
                </div>
              </div>

              {showAddBookmark && (
                <div className="mt-4 p-3 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Add Bookmark
                  </h4>
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

          {/* Text reader column - position based on preferences */}
          <div
            className={`
            flex-1 flex flex-col h-full min-h-0 w-full
            ${
              preferences?.imagePosition === "left"
                ? "md:order-last md:ml-2"
                : "md:mr-2"
            }
            ${preferences?.imagePosition === "bottom" ? "mb-4" : "md:mb-0"}
            ${preferences?.layout === "compact" ? "mr-0 mb-2" : "mb-4"}
          `}
          >
            <BookThemeProvider>
              <div
                id="novel-content"
                className={`
                shadow-md rounded-lg flex-grow overflow-auto w-full
                ${
                  preferences?.layout === "compact"
                    ? "p-3"
                    : preferences?.layout === "expanded"
                    ? "p-6"
                    : "p-5"
                }
              `}
                style={{
                  height: "calc(100vh - 180px)",
                  maxHeight: "calc(100vh - 180px)",
                }}
              >
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-gray-500">Loading content...</div>
                  </div>
                ) : readingMode === "continuous" &&
                  continuousContent.length > 0 ? (
                  <div className="prose max-w-none">
                    {continuousContent.map((item) => (
                      <div key={item.page} className="mb-8">
                        <div className="text-sm text-gray-500 mb-2 border-t pt-2">
                          Page {item.page}
                        </div>
                        <TextHighlighter
                          content={item.content}
                          novelId={id}
                          page={item.page}
                          isHtml={item.metadata?.isHtml}
                        />
                      </div>
                    ))}
                  </div>
                ) : readingMode === "scroll" && continuousContent.length > 0 ? (
                  <div
                    className="prose max-w-none overflow-y-auto"
                    style={{ maxHeight: "calc(100vh - 250px)" }}
                  >
                    {continuousContent.map((item) => (
                      <div key={item.page} className="mb-8">
                        <div className="text-sm text-gray-500 mb-2 border-t pt-2 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
                          Page {item.page}
                        </div>
                        <TextHighlighter
                          content={item.content}
                          novelId={id}
                          page={item.page}
                          isHtml={item.metadata?.isHtml}
                        />
                      </div>
                    ))}
                  </div>
                ) : readingMode === "paginated" ? (
                  <div className="prose max-w-none h-full flex flex-col justify-between">
                    <div className="flex-grow overflow-hidden">
                      <TextHighlighter
                        content={pageData.content}
                        novelId={id}
                        page={currentPage}
                        isHtml={pageData.metadata?.isHtml}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="text-blue-600 disabled:text-gray-400"
                      >
                        ← Previous Page
                      </button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {currentNovel?.totalPages || "?"}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage >= (currentNovel?.totalPages || 1)
                        }
                        className="text-blue-600 disabled:text-gray-400"
                      >
                        Next Page →
                      </button>
                    </div>
                  </div>
                ) : (
                  <TextHighlighter
                    content={pageData.content}
                    novelId={id}
                    page={currentPage}
                    isHtml={pageData.metadata?.isHtml}
                  />
                )}
              </div>
            </BookThemeProvider>
          </div>

          {/* Image display column - position and size based on preferences */}
          {preferences?.imagePosition !== "hidden" && (
            <div
              className={`
              themed-bg-primary shadow-md rounded-lg p-4 flex flex-col themed-text-primary
              ${preferences?.imagePosition === "bottom" ? "w-full" : "w-full"}
              ${
                preferences?.imageSize === "small"
                  ? "md:w-1/5"
                  : preferences?.imageSize === "large"
                  ? "md:w-1/3"
                  : "md:w-1/4"
              }
              ${
                preferences?.layout === "compact"
                  ? "p-2"
                  : preferences?.layout === "expanded"
                  ? "p-4"
                  : "p-3"
              }
            `}
              style={{
                maxHeight:
                  preferences?.imagePosition === "bottom"
                    ? "300px"
                    : "calc(100vh - 180px)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">
                  AI Generated Image
                </h3>
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

              {/* Style selection */}
              <div className="mb-4">
                <label className="text-sm text-gray-700 block mb-1">Image Style:</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={imageStyle || 'default'}
                  onChange={(e) => setImageStyle(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="anime">Anime</option>
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="fantasy">Fantasy</option>
                </select>
              </div>

              {currentImages.length > 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="relative w-full">
                    <img
                      src={`http://localhost:5000/uploads/${currentImages[0].imageUrl}`}
                      alt={`Generated for page ${currentPage}`}
                      className="max-w-full max-h-[60vh] object-contain rounded-md mx-auto"
                      onError={(e) => {
                        console.error('Image failed to load:', currentImages[0]);
                        e.target.onerror = null; // Prevent infinite loop
                        // Use a data URI for the fallback image instead of an external URL
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%233498db%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20fill%3D%22white%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {currentImages[0].style || 'default'} style
                      {currentImages[0].generationMethod && (
                        <span className="ml-1 text-xs opacity-75"> • {currentImages[0].generationMethod}</span>
                      )}
                    </div>
                    {currentImages[0].error && (
                      <div className="absolute top-2 left-2 bg-red-500 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Error: {currentImages[0].error}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={handleGenerateImage}
                      disabled={generatingImage}
                      className={`text-white py-1 px-3 text-sm rounded-md transition flex items-center ${generatingImage ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {generatingImage ? (
                        <>
                          <span className="mr-1 animate-spin">⏳</span> Regenerating...
                        </>
                      ) : (
                        <>
                          <span className="mr-1">🔄</span> Regenerate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center">
                  {generatingImage ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <div className="text-gray-500">Generating image...</div>
                      <div className="text-xs text-gray-400 mt-1">This may take a few moments</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-500 mb-4 text-center">
                        <div className="text-5xl mb-2">🖼️</div>
                        <div>No image generated for this page</div>
                      </div>
                      <button
                        onClick={handleGenerateImage}
                        disabled={generatingImage}
                        className={`text-white py-2 px-4 rounded-md transition ${generatingImage ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        Generate Image
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals for bookmarks and notes */}
        {showBookmarks && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowBookmarks(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowNotes(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <NotesList
                notes={currentNovel?.notes || []}
                novelId={currentNovel?._id}
                onNavigate={handlePageChange}
                onClose={() => setShowNotes(false)}
              />
            </div>
          </div>
        )}

        {/* Reading Settings Modal */}
        {showSettings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ReadingSettingsPanel onClose={() => setShowSettings(false)} />
            </div>
          </div>
        )}

        {/* Layout Settings Modal */}
        {showLayoutSettings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLayoutSettings(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <LayoutSettingsPanel
                onClose={() => setShowLayoutSettings(false)}
              />
            </div>
          </div>
        )}

        {/* Annotations Modal */}
        {showAnnotations && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAnnotations(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AnnotationsList
                novelId={currentNovel?._id}
                onNavigate={handlePageChange}
                onClose={() => setShowAnnotations(false)}
              />
            </div>
          </div>
        )}

        {/* Share Passage Modal */}
        {showSharePassage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSharePassage(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <SharePassageModal
                novelId={currentNovel?._id}
                page={currentPage}
                content={selectedPassage}
                imageId={currentImages.length > 0 ? currentImages[0]._id : null}
                onClose={() => setShowSharePassage(false)}
              />
            </div>
          </div>
        )}

        {/* Share Progress Modal */}
        {showShareProgress && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowShareProgress(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ShareProgressCard
                novelId={currentNovel?._id}
                onClose={() => setShowShareProgress(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation controls at the bottom (hidden in paginated mode) */}
      {readingMode !== "paginated" && (
        <div className="themed-bg-primary shadow-md p-4 themed-text-primary sticky bottom-2 z-10 rounded-full flex  items-center w-4/5 justify-evenly">
          <div className=" flex space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between justify-around min-w-fit items-center  ">
            <div className="text-md font-bold text-gray-900 truncate themed-text-primary min-w-min">
              {currentNovel?.title || "Loading..."}
            </div>

            {/* Progress bar */}
            <div className="md:w-1/3 px-4 w-4/5">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        (Math.min(currentPage, currentNovel?.totalPages || 1) /
                          (currentNovel?.totalPages || 1)) *
                          100
                      )
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-center mt-1 text-sm text-gray-600">
                {readingMode === "continuous" &&
                continuousContent.length > 0 ? (
                  <span>
                    Pages {continuousContent[0]?.page} -{" "}
                    {continuousContent[continuousContent.length - 1]?.page} of{" "}
                    {currentNovel?.totalPages || "?"}
                  </span>
                ) : (
                  <span>
                    Page {Math.min(currentPage, currentNovel?.totalPages || 1)}{" "}
                    of {currentNovel?.totalPages || "?"}
                  </span>
                )}
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-evenly md:w-1/3">
              <button
                onClick={() => {
                  if (
                    readingMode === "continuous" &&
                    continuousContent.length > 0
                  ) {
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

              <button
                onClick={() => {
                  if (
                    readingMode === "continuous" &&
                    continuousContent.length > 0
                  ) {
                    // In continuous mode, move forward by the number of pages displayed
                    const lastPage =
                      continuousContent[continuousContent.length - 1]?.page ||
                      currentPage;
                    handlePageChange(
                      Math.min(currentNovel?.totalPages || 1, lastPage + 1)
                    );
                  } else {
                    // In single mode, just move forward one page
                    handlePageChange(currentPage + 1);
                  }
                }}
                disabled={
                  currentPage >= (currentNovel?.totalPages || 1) || loading
                }
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
              >
                Next
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between md:w-1/3 space-x-2">
              <div className="flex items-center">
                <span className="mr-2 whitespace-nowrap">Jump:</span>
                <input
                  type="number"
                  min="1"
                  max={currentNovel?.totalPages || 1}
                  value={jumpToPage || currentPage}
                  onChange={(e) =>
                    setJumpToPage(parseInt(e.target.value) || "")
                  }
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md mr-2"
                />
                <button
                  onClick={() => {
                    if (jumpToPage) {
                      handlePageChange(jumpToPage);
                      setJumpToPage("");
                    }
                  }}
                  disabled={loading || !jumpToPage}
                  className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition"
                >
                  Go
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setReaderMode("single")}
                    className={`px-2 py-1 text-xs rounded-md transition whitespace-nowrap ${
                      readingMode === "single"
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setReaderMode("continuous")}
                    className={`px-2 py-1 text-xs rounded-md transition whitespace-nowrap ${
                      readingMode === "continuous"
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Continuous
                  </button>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  <span role="img" aria-label="Settings">
                    ⚙️
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reader;
