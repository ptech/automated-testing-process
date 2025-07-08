import { Page } from '@playwright/test';
import { FiveGControlPanelPage } from '../pages/5gControlPanelPage';

/**
 * Page Object Factory - Manages page object instances to avoid repeated instantiation
 * Implements singleton pattern for each page type per test scenario
 */
export class PageObjectFactory {
    private static instances: Map<string, any> = new Map();
    private static currentPage: Page | null = null;
    private static currentBaseUrl: string = '';

    /**
     * Initialize the factory with page and baseUrl for the current scenario
     * This should be called once per scenario in the Before hook
     */
    static initialize(page: Page, baseUrl: string): void {
        // Clear previous instances when initializing for a new scenario
        this.instances.clear();
        this.currentPage = page;
        this.currentBaseUrl = baseUrl;
    }

    /**
     * Get or create a FiveGControlPanelPage instance
     * Returns the same instance for the duration of the scenario
     */
    static getFiveGControlPanelPage(): FiveGControlPanelPage {
        const key = 'FiveGControlPanelPage';
        
        if (!this.instances.has(key)) {
            if (!this.currentPage) {
                throw new Error('PageObjectFactory not initialized. Call initialize() first.');
            }
            this.instances.set(key, new FiveGControlPanelPage(this.currentPage, this.currentBaseUrl));
        }
        
        return this.instances.get(key);
    }

    /**
     * Clear all cached instances
     * This should be called after each scenario in the After hook
     */
    static cleanup(): void {
        this.instances.clear();
        this.currentPage = null;
        this.currentBaseUrl = '';
    }

    /**
     * Get the current page instance
     */
    static getCurrentPage(): Page | null {
        return this.currentPage;
    }

    /**
     * Get the current base URL
     */
    static getCurrentBaseUrl(): string {
        return this.currentBaseUrl;
    }
}
