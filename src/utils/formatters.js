// Format date to readable format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format time in minutes to hours and minutes
export const formatReadingTime = (minutes) => {
  if (!minutes) return '0 min';

  // Handle potentially incorrect large values
  if (minutes > 1000000) {
    return 'Time tracking error';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  // Format with days for very long reading times
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0 && remainingMinutes === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (remainingMinutes === 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hr`;
    } else if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${remainingMinutes} min`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hr ${remainingMinutes} min`;
    }
  }

  // Standard hours and minutes format
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMinutes} min`;
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Calculate reading progress percentage
export const calculateProgress = (currentPage, totalPages) => {
  if (!currentPage || !totalPages) return 0;
  return Math.round((currentPage / totalPages) * 100);
};
