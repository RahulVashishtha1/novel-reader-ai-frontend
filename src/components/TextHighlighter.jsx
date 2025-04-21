import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  setCurrentAnnotation,
  clearCurrentAnnotation,
} from '../features/annotations/annotationsSlice';

const TextHighlighter = ({ content, novelId, page, isHtml = false }) => {
  const dispatch = useDispatch();
  const { pageAnnotations, currentAnnotation } = useSelector((state) => state.annotations);

  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffff00'); // Default yellow
  const [selectedCategory] = useState('highlight');

  const contentRef = useRef(null);
  const toolbarRef = useRef(null);
  const noteInputRef = useRef(null);

  // Available highlight colors
  const highlightColors = [
    { color: '#ffff00', name: 'Yellow' },
    { color: '#90ee90', name: 'Green' },
    { color: '#add8e6', name: 'Blue' },
    { color: '#ffb6c1', name: 'Pink' },
    { color: '#ffa500', name: 'Orange' },
  ];

  // Available categories - for future implementation
  // const categories = [
  //   { value: 'highlight', label: 'Highlight' },
  //   { value: 'note', label: 'Note' },
  //   { value: 'question', label: 'Question' },
  //   { value: 'important', label: 'Important' },
  //   { value: 'vocabulary', label: 'Vocabulary' },
  // ];

  // Handle text selection
  const handleTextSelection = (event) => {
    // Use a small timeout to allow the selection to complete
    setTimeout(() => {
      const selection = window.getSelection();

      if (selection.toString().trim().length > 0 && contentRef.current) {
        // Get the selected text
        const text = selection.toString();
        setSelectedText(text);

        // Get the range
        const range = selection.getRangeAt(0);

        // Store the range for later use (to preserve selection)
        const selectionRange = range.cloneRange();

        // Calculate offsets relative to the content element
        const contentElement = contentRef.current;

        // Create a range from the start of the content to the start of the selection
        const startRange = document.createRange();
        startRange.setStart(contentElement, 0);
        startRange.setEnd(range.startContainer, range.startOffset);

        // The length of this range's text is the start offset
        const startOffset = startRange.toString().length;

        // The end offset is the start offset plus the length of the selected text
        const endOffset = startOffset + text.length;

        setSelectionRange({ startOffset, endOffset, range: selectionRange });

        // Position the toolbar above the selection
        const rect = range.getBoundingClientRect();
        setToolbarPosition({
          top: rect.top - 50, // Position above the selection
          left: rect.left + (rect.width / 2) - 100, // Center horizontally
        });

        // Add a temporary highlight to the selection
        const tempHighlight = document.createElement('span');
        tempHighlight.className = 'temp-highlight';
        tempHighlight.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        tempHighlight.style.position = 'absolute';
        tempHighlight.style.pointerEvents = 'none';
        tempHighlight.style.top = rect.top + 'px';
        tempHighlight.style.left = rect.left + 'px';
        tempHighlight.style.width = rect.width + 'px';
        tempHighlight.style.height = rect.height + 'px';
        document.body.appendChild(tempHighlight);

        setShowToolbar(true);
      } else {
        // If clicking outside a selection, hide the toolbar
        if (!toolbarRef.current || !toolbarRef.current.contains(event.target)) {
          setShowToolbar(false);
          setShowNoteInput(false);

          // Remove any temporary highlights
          document.querySelectorAll('.temp-highlight').forEach(el => el.remove());
        }
      }
    }, 10); // Small delay to ensure selection is complete
  };

  // Handle highlighting text
  const handleHighlight = () => {
    if (selectionRange && novelId && page) {
      const annotationData = {
        page,
        textSelection: {
          startOffset: selectionRange.startOffset,
          endOffset: selectionRange.endOffset,
          selectedText,
        },
        color: selectedColor,
        category: selectedCategory,
      };

      dispatch(createAnnotation({ novelId, annotationData }));

      // Keep the selection visible for a moment before clearing
      setTimeout(() => {
        // Clear selection and hide toolbar
        window.getSelection().removeAllRanges();
        setShowToolbar(false);
        setSelectedText('');
        setSelectionRange(null);

        // Remove any temporary highlights
        document.querySelectorAll('.temp-highlight').forEach(el => el.remove());
      }, 500); // Delay to keep selection visible
    }
  };

  // Handle adding a note
  const handleAddNote = () => {
    setShowNoteInput(true);
    // Focus the textarea after a short delay to ensure it's rendered
    setTimeout(() => {
      if (noteInputRef.current) {
        const textarea = noteInputRef.current.querySelector('textarea');
        if (textarea) {
          textarea.focus();
        }
      }
    }, 50);
  };

  // Handle saving a note
  const handleSaveNote = () => {
    if (selectionRange && novelId && page && noteText.trim()) {
      const annotationData = {
        page,
        textSelection: {
          startOffset: selectionRange.startOffset,
          endOffset: selectionRange.endOffset,
          selectedText,
        },
        color: selectedColor,
        note: noteText,
        category: 'note',
      };

      dispatch(createAnnotation({ novelId, annotationData }));

      // Keep the selection visible for a moment before clearing
      setTimeout(() => {
        // Clear selection and hide toolbar
        window.getSelection().removeAllRanges();
        setShowToolbar(false);
        setShowNoteInput(false);
        setNoteText('');
        setSelectedText('');
        setSelectionRange(null);

        // Remove any temporary highlights
        document.querySelectorAll('.temp-highlight').forEach(el => el.remove());
      }, 500); // Delay to keep selection visible
    }
  };

  // Handle updating a note
  const handleUpdateNote = () => {
    if (currentAnnotation) {
      const annotationData = {
        note: noteText,
      };

      dispatch(updateAnnotation({
        annotationId: currentAnnotation._id,
        annotationData,
      }));

      setShowNoteInput(false);
      dispatch(clearCurrentAnnotation());
    }
  };

  // Handle deleting an annotation
  const handleDeleteAnnotation = () => {
    if (currentAnnotation) {
      dispatch(deleteAnnotation(currentAnnotation._id));
      setShowToolbar(false);
      setShowNoteInput(false);
      dispatch(clearCurrentAnnotation());
    }
  };

  // Handle clicking on an existing annotation
  const handleAnnotationClick = useCallback((annotation, event) => {
    event.stopPropagation();
    dispatch(setCurrentAnnotation(annotation));

    // Position the toolbar near the annotation
    const rect = event.target.getBoundingClientRect();
    setToolbarPosition({
      top: rect.top - 50,
      left: rect.left + (rect.width / 2) - 100,
    });

    setShowToolbar(true);

    if (annotation.note) {
      setNoteText(annotation.note);
      setShowNoteInput(true);
    }
  }, [dispatch]);

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target) &&
        (!noteInputRef.current || !noteInputRef.current.contains(event.target))
      ) {
        setShowToolbar(false);
        setShowNoteInput(false);
        dispatch(clearCurrentAnnotation());

        // Remove any temporary highlights
        document.querySelectorAll('.temp-highlight').forEach(el => el.remove());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // Render the content with annotations
  const renderContentWithAnnotations = () => {
    if (!content) {
      return '';
    }

    // If there are no annotations or if it's HTML content, just return the content
    if (!pageAnnotations || pageAnnotations.length === 0) {
      return content;
    }

    // For HTML content, we need a different approach to annotations
    if (isHtml) {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // If there are no annotations, just return the content
      if (!pageAnnotations || pageAnnotations.length === 0) {
        return content;
      }

      // Get all text nodes in the HTML content
      const textNodes = [];
      const getTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(getTextNodes);
        }
      };

      getTextNodes(tempDiv);

      // Calculate the total text content
      let fullText = '';
      const nodePositions = [];

      textNodes.forEach(node => {
        nodePositions.push({
          node,
          start: fullText.length,
          end: fullText.length + node.textContent.length
        });
        fullText += node.textContent;
      });

      // Sort annotations by start offset (in reverse order to process from end to start)
      const sortedAnnotations = [...pageAnnotations].sort((a, b) =>
        b.textSelection.startOffset - a.textSelection.startOffset
      );

      // Apply annotations to the text nodes
      sortedAnnotations.forEach(annotation => {
        const { startOffset, endOffset } = annotation.textSelection;

        // Find nodes that contain the annotation
        const affectedNodes = nodePositions.filter(pos =>
          (startOffset < pos.end && endOffset > pos.start)
        );

        if (affectedNodes.length === 0) return;

        // Process each affected node
        affectedNodes.forEach(nodePos => {
          const node = nodePos.node;
          const parent = node.parentNode;

          // Calculate the relative positions within this text node
          const relativeStart = Math.max(0, startOffset - nodePos.start);
          const relativeEnd = Math.min(node.textContent.length, endOffset - nodePos.start);

          if (relativeStart >= node.textContent.length || relativeEnd <= 0) return;

          // Split the text node into parts
          const beforeText = node.textContent.substring(0, relativeStart);
          const highlightedText = node.textContent.substring(relativeStart, relativeEnd);
          const afterText = node.textContent.substring(relativeEnd);

          // Create new nodes
          const hasNote = annotation.note && annotation.note.trim().length > 0;
          const noteIndicator = hasNote ? ' 📝' : '';

          // Replace the text node with the new nodes
          if (beforeText) {
            parent.insertBefore(document.createTextNode(beforeText), node);
          }

          // Create the highlighted span
          const span = document.createElement('span');
          span.className = 'annotation';
          span.setAttribute('data-annotation-id', annotation._id);
          span.style.backgroundColor = annotation.color;
          span.style.cursor = 'pointer';
          span.textContent = highlightedText + noteIndicator;
          parent.insertBefore(span, node);

          if (afterText) {
            parent.insertBefore(document.createTextNode(afterText), node);
          }

          // Remove the original node
          parent.removeChild(node);
        });
      });

      return tempDiv.innerHTML;
    }

    // Sort annotations by start offset (in reverse order to process from end to start)
    const sortedAnnotations = [...pageAnnotations].sort((a, b) =>
      b.textSelection.startOffset - a.textSelection.startOffset
    );

    let contentWithAnnotations = content;

    // Insert annotation markers
    sortedAnnotations.forEach((annotation) => {
      const { startOffset, endOffset } = annotation.textSelection;
      const beforeText = contentWithAnnotations.substring(0, startOffset);
      const highlightedText = contentWithAnnotations.substring(startOffset, endOffset);
      const afterText = contentWithAnnotations.substring(endOffset);

      const hasNote = annotation.note && annotation.note.trim().length > 0;
      const noteIndicator = hasNote ? ' 📝' : '';

      contentWithAnnotations =
        beforeText +
        `<span
          class="annotation"
          data-annotation-id="${annotation._id}"
          style="background-color: ${annotation.color}; cursor: pointer;"
        >` +
        highlightedText +
        noteIndicator +
        '</span>' +
        afterText;
    });

    return contentWithAnnotations;
  };

  // Add event listeners to annotation spans after rendering
  useEffect(() => {
    const addAnnotationEventListeners = () => {
      if (contentRef.current) {
        const annotationSpans = contentRef.current.querySelectorAll('.annotation');

        annotationSpans.forEach((span) => {
          const annotationId = span.getAttribute('data-annotation-id');
          const annotation = pageAnnotations.find(a => a._id === annotationId);

          if (annotation) {
            span.addEventListener('click', (event) =>
              handleAnnotationClick(annotation, event)
            );
          }
        });
      }
    };

    // Add a small delay to ensure the DOM has been updated
    const timeoutId = setTimeout(addAnnotationEventListeners, 100);

    return () => clearTimeout(timeoutId);
  }, [pageAnnotations, content, handleAnnotationClick]);

  return (
    <div className="relative">
      {/* Content with annotations */}
      <div
        ref={contentRef}
        className="prose max-w-none whitespace-pre-wrap"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: renderContentWithAnnotations() }}
      />

      {/* Annotation toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="fixed z-50 themed-bg-primary shadow-lg rounded-md p-2 flex flex-col items-center"
          style={{
            top: Math.max(10, toolbarPosition.top) + 'px',
            left: Math.max(10, Math.min(window.innerWidth - 220, toolbarPosition.left)) + 'px',
          }}
        >
          {/* Color picker */}
          <div className="flex space-x-1 mb-2">
            {highlightColors.map((hc) => (
              <button
                key={hc.color}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: hc.color }}
                title={hc.name}
                onClick={() => setSelectedColor(hc.color)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {!currentAnnotation ? (
              <>
                <button
                  onClick={handleHighlight}
                  className="px-2 py-1 themed-accent-bg text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Highlight
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Add Note
                </button>
              </>
            ) : (
              <>
                {currentAnnotation.note ? (
                  <button
                    onClick={handleAddNote}
                    className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Edit Note
                  </button>
                ) : (
                  <button
                    onClick={handleAddNote}
                    className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Add Note
                  </button>
                )}
                <button
                  onClick={handleDeleteAnnotation}
                  className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Note input */}
      {showNoteInput && (
        <div
          ref={noteInputRef}
          className="fixed z-50 themed-bg-primary shadow-lg rounded-md p-3"
          style={{
            top: Math.max(80, toolbarPosition.top + 70) + 'px',
            left: Math.max(10, Math.min(window.innerWidth - 310, toolbarPosition.left - 50)) + 'px',
            width: '300px',
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-2 border themed-border rounded mb-2 themed-bg-primary themed-text-primary"
            rows="3"
            placeholder="Enter your note..."
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowNoteInput(false)}
              className="px-2 py-1 themed-bg-secondary themed-text-primary text-sm rounded hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
            <button
              onClick={currentAnnotation ? handleUpdateNote : handleSaveNote}
              className="px-2 py-1 themed-accent-bg text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;
