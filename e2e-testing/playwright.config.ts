import { defineConfig, devices } from '@playwright/test';

export default defineConfig( {
    // Test directory
    testDir: './tests/features',

    // Timeout settings
    timeout: 30000,
    expect: {
        timeout: 5000
    },

    // Retry settings
    retries: process.env.CI ? 2 : 0,

    // Parallel workers
    workers: process.env.CI ? 1 : undefined,

    // Reporter configuration
    reporter: [
        [ 'html', { outputFolder: 'test-results/reports/playwright-report' } ],
        [ 'json', { outputFile: 'test-results/reports/playwright-results.json' } ],
    ],

    // Global test settings
    use: {
        // Base URL
        baseURL: process.env.APP_URL || 'https://example.com',

        // Browser settings
        headless: process.env.HEADLESS !== 'false',
        viewport: { width: 1280, height: 720 },

        // Screenshots and videos
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        // Tracing
        trace: 'retain-on-failure',

        // Other settings
        actionTimeout: 10000,
        navigationTimeout: 30000
    },

    // Browser projects
    projects: [
        {
            name: 'chromium',
            use: { ...devices[ 'Desktop Chrome' ] }
        },
        {
            name: 'firefox',
            use: { ...devices[ 'Desktop Firefox' ] }
        },
        {
            name: 'webkit',
            use: { ...devices[ 'Desktop Safari' ] }
        },
        // Mobile browsers
        {
            name: 'Mobile Chrome',
            use: { ...devices[ 'Pixel 5' ] }
        },
        {
            name: 'Mobile Safari',
            use: { ...devices[ 'iPhone 12' ] }
        }
    ],

    // Output directory
    outputDir: 'test-results/'
} );
