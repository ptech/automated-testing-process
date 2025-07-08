import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { config } from 'dotenv';
import { testConfig } from '../config/testConfig';
import { PageObjectFactory } from './pageObjectFactory';

// Load environment variables from .env.local
config( { path: '.env.local' } );

/**
 * Interface extending Cucumber's IWorldOptions with custom parameters
 * Defines the structure for world configuration options
 */
export interface CustomWorldOptions extends IWorldOptions
{
    parameters: {
        browser: string;
        headless: boolean;
        baseUrl: string;
    };
}

/**
 * Custom World class for Cucumber test scenarios
 *
 * Manages the browser context, page instances, and page object factory
 * for each test scenario. Provides setup and teardown functionality
 * for browser automation with Playwright.
 *
 * Features:
 * - Multi-browser support (Chromium, Firefox, WebKit)
 * - Page object factory integration
 * - Automatic cleanup after scenarios
 * - Video recording and tracing support
 */
export class CustomWorld extends World
{
    public browser!: Browser;
    public context!: BrowserContext;
    public page!: Page;
    public baseUrl: string;
    public pageFactory!: PageObjectFactory;

    /**
     * Creates a new CustomWorld instance for a test scenario
     * @param options - Configuration options including browser settings and base URL
     */
    constructor ( options: CustomWorldOptions )
    {
        super( options );
        // Use testConfig.appUrl which reads from environment variables
        this.baseUrl = testConfig.appUrl || options.parameters.baseUrl;
    }

    /**
     * Initializes the browser, context, and page for the test scenario
     * Sets up video recording if enabled and initializes the page object factory
     *
     * Supports multiple browsers:
     * - Chromium/Chrome (default)
     * - Firefox
     * - WebKit/Safari
     */
    async init (): Promise<void>
    {
        const browserType = this.parameters.browser || testConfig.browser.type;
        const headless = this.parameters.headless ?? testConfig.browser.headless;

        // Launch browser based on parameter
        switch ( browserType.toLowerCase() )
        {
            case 'firefox':
                this.browser = await firefox.launch( { headless } );
                break;
            case 'webkit':
            case 'safari':
                this.browser = await webkit.launch( { headless } );
                break;
            case 'chromium':
            case 'chrome':
            default:
                this.browser = await chromium.launch( { headless } );
                break;
        }

        // Create browser context
        this.context = await this.browser.newContext( {
            viewport: {
                width: testConfig.browser.viewport.width,
                height: testConfig.browser.viewport.height
            },
            recordVideo: testConfig.reporting.videos ? {
                dir: 'test-results/videos',
                size: {
                    width: testConfig.browser.viewport.width,
                    height: testConfig.browser.viewport.height
                }
            } : undefined,
        } );

        // Create page
        this.page = await this.context.newPage();

        // Initialize page object factory
        PageObjectFactory.initialize(this.page, this.baseUrl);
        this.pageFactory = PageObjectFactory;
    }

    /**
     * Cleans up browser resources after a test scenario
     *
     * Performs the following cleanup operations:
     * - Clears page object factory instances
     * - Closes the current page
     * - Closes the browser context
     * - Closes the browser instance
     *
     * This method should be called after each scenario to prevent resource leaks
     */
    async cleanup (): Promise<void>
    {
        // Clean up page object factory
        PageObjectFactory.cleanup();

        if ( this.page )
        {
            await this.page.close();
        }
        if ( this.context )
        {
            await this.context.close();
        }
        if ( this.browser )
        {
            await this.browser.close();
        }
    }
}

setWorldConstructor( CustomWorld );
