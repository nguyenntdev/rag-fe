import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Storage key for localStorage
const STORAGE_KEY = 'heritage-contributions';

// Contribution types
export const CONTRIBUTION_TYPES = {
  NEW_HERITAGE: 'new_heritage',
  CORRECTION: 'correction',
  ADDITIONAL_INFO: 'additional_info',
  PHOTO: 'photo',
};

// Contribution status
export const CONTRIBUTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Create context
const ContributionContext = createContext(null);

/**
 * Generate unique ID for contributions
 */
function generateId() {
  return `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ContributionProvider component
 */
export function ContributionProvider({ children }) {
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contributions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContributions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load contributions:', error);
    }
    setIsLoading(false);
  }, []);

  // Save contributions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contributions));
      } catch (error) {
        console.error('Failed to save contributions:', error);
      }
    }
  }, [contributions, isLoading]);

  /**
   * Submit a new contribution
   */
  const submitContribution = useCallback((type, data, contributor = {}) => {
    const newContribution = {
      id: generateId(),
      type,
      status: CONTRIBUTION_STATUS.PENDING,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      contributor: {
        name: contributor.name || null,
        email: contributor.email || null,
        phone: contributor.phone || null,
      },
      data,
      adminNotes: null,
    };

    setContributions((prev) => [newContribution, ...prev]);
    return newContribution;
  }, []);

  /**
   * Update contribution status (admin action)
   */
  const updateContributionStatus = useCallback((id, status, adminNotes = null) => {
    setContributions((prev) =>
      prev.map((contrib) =>
        contrib.id === id
          ? {
              ...contrib,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
              adminNotes: adminNotes || contrib.adminNotes,
            }
          : contrib
      )
    );
  }, []);

  /**
   * Approve a contribution
   */
  const approveContribution = useCallback(
    (id, notes = null) => {
      updateContributionStatus(id, CONTRIBUTION_STATUS.APPROVED, notes);
    },
    [updateContributionStatus]
  );

  /**
   * Reject a contribution
   */
  const rejectContribution = useCallback(
    (id, notes = null) => {
      updateContributionStatus(id, CONTRIBUTION_STATUS.REJECTED, notes);
    },
    [updateContributionStatus]
  );

  /**
   * Delete a contribution
   */
  const deleteContribution = useCallback((id) => {
    setContributions((prev) => prev.filter((contrib) => contrib.id !== id));
  }, []);

  /**
   * Get contribution by ID
   */
  const getContribution = useCallback(
    (id) => {
      return contributions.find((contrib) => contrib.id === id) || null;
    },
    [contributions]
  );

  /**
   * Get contributions by status
   */
  const getContributionsByStatus = useCallback(
    (status) => {
      return contributions.filter((contrib) => contrib.status === status);
    },
    [contributions]
  );

  /**
   * Get contributions by type
   */
  const getContributionsByType = useCallback(
    (type) => {
      return contributions.filter((contrib) => contrib.type === type);
    },
    [contributions]
  );

  /**
   * Get pending contributions count
   */
  const pendingCount = contributions.filter(
    (c) => c.status === CONTRIBUTION_STATUS.PENDING
  ).length;

  /**
   * Get statistics
   */
  const getStats = useCallback(() => {
    return {
      total: contributions.length,
      pending: contributions.filter((c) => c.status === CONTRIBUTION_STATUS.PENDING).length,
      approved: contributions.filter((c) => c.status === CONTRIBUTION_STATUS.APPROVED).length,
      rejected: contributions.filter((c) => c.status === CONTRIBUTION_STATUS.REJECTED).length,
      byType: {
        new_heritage: contributions.filter((c) => c.type === CONTRIBUTION_TYPES.NEW_HERITAGE).length,
        correction: contributions.filter((c) => c.type === CONTRIBUTION_TYPES.CORRECTION).length,
        additional_info: contributions.filter((c) => c.type === CONTRIBUTION_TYPES.ADDITIONAL_INFO).length,
        photo: contributions.filter((c) => c.type === CONTRIBUTION_TYPES.PHOTO).length,
      },
    };
  }, [contributions]);

  /**
   * Clear all contributions (admin action)
   */
  const clearAllContributions = useCallback(() => {
    setContributions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    // State
    contributions,
    isLoading,
    pendingCount,

    // Actions
    submitContribution,
    updateContributionStatus,
    approveContribution,
    rejectContribution,
    deleteContribution,
    clearAllContributions,

    // Getters
    getContribution,
    getContributionsByStatus,
    getContributionsByType,
    getStats,

    // Constants
    CONTRIBUTION_TYPES,
    CONTRIBUTION_STATUS,
  };

  return (
    <ContributionContext.Provider value={value}>
      {children}
    </ContributionContext.Provider>
  );
}

/**
 * Hook to use contribution context
 */
export function useContribution() {
  const context = useContext(ContributionContext);
  if (!context) {
    throw new Error('useContribution must be used within a ContributionProvider');
  }
  return context;
}

export default ContributionContext;
