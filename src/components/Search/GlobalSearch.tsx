import React from 'react';
import styles from './Search.module.css';

interface SearchResult {
  id: string;
  type: 'note' | 'research' | 'work' | 'formula' | 'subject' | 'tag';
  title: string;
  preview?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelect?: (result: SearchResult) => void;
  results: SearchResult[];
  isLoading?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
}

const getSearchIcon = (type: string): string => {
  const icons: Record<string, string> = {
    note: '📝',
    research: '🔍',
    work: '📋',
    formula: '∑',
    subject: '📚',
    tag: '🏷️',
  };
  return icons[type] || '🔍';
};

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    note: 'NOTE',
    research: 'RESEARCH',
    work: 'WORK',
    formula: 'FORMULA',
    subject: 'SUBJECT',
    tag: 'TAG',
  };
  return labels[type] || type.toUpperCase();
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onSelect,
  results,
  isLoading,
  query,
  onQueryChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.searchInput}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search notes, research, work, formulas, subjects..."
            value={query || ''}
            onChange={e => onQueryChange?.(e.target.value)}
            autoFocus
          />
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.searchResults}>
          {isLoading && <div className={styles.loadingState}>Searching...</div>}
          {!isLoading && results.length === 0 && query && (
            <div className={styles.emptyState}>No results found for "{query}"</div>
          )}
          {!isLoading && results.length === 0 && !query && (
            <div className={styles.emptyState}>Start typing to search</div>
          )}
          {!isLoading &&
            results.map(result => (
              <div
                key={result.id}
                className={styles.searchResult}
                onClick={() => onSelect?.(result)}
              >
                <span className={styles.resultIcon}>{getSearchIcon(result.type)}</span>
                <div className={styles.resultContent}>
                  <div className={styles.resultType}>{getTypeLabel(result.type)}</div>
                  <div className={styles.resultTitle}>{result.title}</div>
                  {result.preview && <div className={styles.resultPreview}>{result.preview}</div>}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
