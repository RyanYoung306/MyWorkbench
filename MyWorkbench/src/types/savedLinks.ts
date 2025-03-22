// src/types/savedLinks.ts

export interface Link {
    id: string;
    title: string;
    url: string;
    favicon?: string;
}

export interface LinkCollection {
    id: string;
    title: string;
    links: Link[];
    category: string;
}

export type CategoryName = 'personal' | 'work';

export interface CollectionsState {
    personal: LinkCollection[];
    work: LinkCollection[];
}