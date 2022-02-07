/**
 * Accessibility notifications
 * @see packages/search-ui/src/A11yNotifications.js
 */

const defaultMessages = {
  moreFilters: ({ visibleOptionsCount, showingAll }) => {
    let message = showingAll ? "All " : "";
    message += `${visibleOptionsCount} options shown.`;
    return message;
  }
};

export default defaultMessages;
