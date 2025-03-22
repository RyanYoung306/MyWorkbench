// src/services/savedLinksApi.ts

import {Link, LinkCollection} from '../types/savedLinks';

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

/**
 * Gets the URL for a link's favicon
 * @param category The category of the collection
 * @param collectionId The collection ID
 * @param linkId The link ID
 * @returns The URL to use for the favicon
 */
export const getFaviconUrl = (
    category: string,
    collectionId: string,
    linkId: string,
    link: Link
): string => {
    // If the link already has a favicon URL stored, use it
    if (link.favicon) {
        // If it's already a data URL, return it directly
        if (link.favicon.startsWith('data:')) {
            return link.favicon;
        }

        // If it's an absolute URL, use it
        if (link.favicon.startsWith('http')) {
            return link.favicon;
        }
    }

    // Use the API endpoint to fetch the favicon
    return `${API_URL}/${category}/${collectionId}/links/${linkId}/favicon`;
};

/**
 * Gets a domain name from a URL for display purposes
 * @param url The full URL
 * @returns The domain name
 */
export const getDomainFromUrl = (url: string): string => {
    try {
        // Ensure URL has protocol
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        const domain = new URL(url).hostname;
        // Remove www. prefix if present
        return domain.replace(/^www\./, '');
    } catch (error) {
        // If URL parsing fails, return the original URL
        return url;
    }
};

/**
 * Gets a fallback favicon URL for cases where favicon retrieval fails
 */
export const getFallbackFaviconUrl = (): string => {
    return `${API_URL}/fallback-favicon.ico`;
};