/**
 * Test Configuration Interface
 *
 * Defines the structure for all test configuration settings including
 * browser options, timeouts, application URL, and reporting preferences.
 *
 * Configuration values are read from environment variables with sensible defaults.
 */
export interface TestConfig
{
    browser: {
        type: 'chromium' | 'firefox' | 'webkit';
        headless: boolean;
        viewport: {
            width: number;
            height: number;
        };
        slowMo: number;
    };
    timeouts: {
        default: number;
        navigation: number;
        element: number;
    };
    appUrl: string;
    reporting: {
        screenshots: boolean;
        videos: boolean;
        trace: boolean;
    };
}

/**
 * Test Configuration Object
 *
 * Central configuration for the test framework that reads from environment variables
 * and provides sensible defaults for all settings.
 *
 * Environment Variables:
 * - BROWSER: Browser type (chromium, firefox, webkit) - defaults to 'chromium'
 * - HEADLESS: Run in headless mode (true/false) - defaults to true
 * - VIEWPORT_WIDTH: Browser width in pixels - defaults to 1280
 * - VIEWPORT_HEIGHT: Browser height in pixels - defaults to 720
 * - SLOW_MO: Slow motion delay in ms - defaults to 0
 * - DEFAULT_TIMEOUT: General timeout in ms - defaults to 30000
 * - NAVIGATION_TIMEOUT: Page navigation timeout in ms - defaults to 30000
 * - ELEMENT_TIMEOUT: Element interaction timeout in ms - defaults to 10000
 * - APP_URL: Application URL to test - required
 * - SCREENSHOTS: Enable failure screenshots (true/false) - defaults to true
 * - VIDEOS: Enable video recording (true/false) - defaults to true
 * - TRACE: Enable Playwright traces (true/false) - defaults to true
 *
 * @example
 * // Override browser type
 * process.env.BROWSER = 'firefox';
 *
 * // Run in headed mode for debugging
 * process.env.HEADLESS = 'false';
 *
 * // Set application URL
 * process.env.APP_URL = 'https://example.com';
 */
export const testConfig: TestConfig = {
    browser: {
        type: ( process.env.BROWSER as 'chromium' | 'firefox' | 'webkit' ) || 'chromium',
        headless: process.env.HEADLESS !== 'false',
        viewport: {
            width: parseInt( process.env.VIEWPORT_WIDTH || '1280' ),
            height: parseInt( process.env.VIEWPORT_HEIGHT || '720' )
        },
        slowMo: parseInt( process.env.SLOW_MO || '0' )
    },
    timeouts: {
        default: parseInt( process.env.DEFAULT_TIMEOUT || '30000' ),
        navigation: parseInt( process.env.NAVIGATION_TIMEOUT || '30000' ),
        element: parseInt( process.env.ELEMENT_TIMEOUT || '10000' )
    },
    appUrl: process.env.APP_URL || '',
    reporting: {
        screenshots: process.env.SCREENSHOTS !== 'false',
        videos: process.env.VIDEOS !== 'false',
        trace: process.env.TRACE !== 'false'
    }
};

export default testConfig;
