import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@/types/snippet';
import { collectionStorage } from '@/lib/storage';

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = () => {
      try {
        const stored = collectionStorage.getAll();
        setCollections(stored);
      } catch (error) {
        console.error('Failed to load collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  const createCollection = useCallback((
    name: string,
    description?: string,
    color?: string
  ): Collection => {
    const now = new Date();
    const collection: Collection = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim(),
      color,
      snippetIds: [],
      syncEnabled: false,
      createdAt: now,
      updatedAt: now,
    };

    setCollections(prev => {
      const updated = [...prev, collection];
      collectionStorage.bulkSave(updated);
      return updated;
    });

    return collection;
  }, []);

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections(prev => {
      const updated = prev.map(collection =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: new Date() }
          : collection
      );
      collectionStorage.bulkSave(updated);
      return updated;
    });
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => {
      const updated = prev.filter(collection => collection.id !== id);
      collectionStorage.bulkSave(updated);
      return updated;
    });
  }, []);

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
  };
}; 