import { useContext } from 'react';
import { BackendDataContext } from '@/contexts/BackendDataContextDefinition';

export const useBackendData = () => {
  const context = useContext(BackendDataContext);
  if (context === undefined) {
    throw new Error('useBackendData must be used within a BackendDataProvider');
  }
  return context;
};