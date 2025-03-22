// src/services/savedLinksApi.ts

import { LinkCollection } from '../types/savedLinks';

const API_URL = 'http://localhost:8080/api/saved-links';

export const fetchCollections = async (category: string): Promise<LinkCollection[]> => {
    try {
        const response = await fetch(`${API_URL}/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch collections: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
};

export const createCollection = async (category: string, title: string): Promise<LinkCollection | null> => {
    try {
        const response = await fetch(`${API_URL}/${category}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create collection: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating collection:', error);
        return null;
    }
};

export const deleteCollection = async (category: string, collectionId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/${category}/${collectionId}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting collection:', error);
        return false;
    }
};

export const addLink = async (
    category: string,
    collectionId: string,
    title: string,
    url: string
): Promise<LinkCollection | null> => {
    try {
        const response = await fetch(`${API_URL}/${category}/${collectionId}/links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, url }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add link: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding link:', error);
        return null;
    }
};

export const removeLink = async (
    category: string,
    collectionId: string,
    linkId: string
): Promise<LinkCollection | null> => {
    try {
        const response = await fetch(`${API_URL}/${category}/${collectionId}/links/${linkId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to remove link: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing link:', error);
        return null;
    }
};

export const initializeDefaultCollections = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/init`, {
            method: 'POST',
        });

        return response.ok;
    } catch (error) {
        console.error('Error initializing default collections:', error);
        return false;
    }
};