/**
 * Screenshot Capture Utilities for Test Automation
 *
 * Provides functionality to capture screenshots during test execution,
 * particularly for failed test scenarios. Screenshots are automatically
 * saved to the filesystem and attached to Cucumber reports for debugging.
 *
 * Features:
 * - Automatic screenshot capture on test failure
 * - Configurable screenshot options (full page, format, quality)
 * - Safe filename generation from scenario names
 * - Integration with Cucumber reporting
 * - Error handling with graceful fallbacks
 */

import { Page } from '@playwright/test';
import * as fs from 'fs';

/**
 * Type definition for Cucumber's attach function
 * Used to attach screenshot files to test reports
 */
type AttachFunction = {
    ( data: string, mediaType?: string ): void;
    ( data: Buffer, mediaType: string ): void;
};

/**
 * Configuration options for screenshot capture
 *
 * Allows customization of screenshot behavior including
 * capture area, file format, and image quality.
 */
export interface ScreenshotOptions
{
    fullPage?: boolean;
    type?: 'png' | 'jpeg';
    quality?: number;
}

/**
 * Captures a screenshot and saves it to the filesystem
 * @param page - Playwright page instance
 * @param filename - Name for the screenshot file (without extension)
 * @param options - Screenshot options
 * @returns Promise<Buffer | null> - Screenshot buffer or null if failed
 */
export async function captureScreenshot (
    page: Page,
    filename: string,
    options: ScreenshotOptions = {}
): Promise<Buffer | null>
{
    try
    {
        const screenshot = await page.screenshot( {
            fullPage: options.fullPage ?? true,
            type: options.type ?? 'png',
            quality: options.quality
        } );

        // Save screenshot to file
        const screenshotPath = `test-results/screenshots/${ filename }.${ options.type ?? 'png' }`;
        fs.writeFileSync( screenshotPath, screenshot );

        return screenshot;
    } catch ( error )
    {
        // Screenshot capture failed - return null
        return null;
    }
}

/**
 * Captures screenshot for failed test scenarios
 *
 * Automatically called when a test scenario fails to provide visual context
 * for debugging. The screenshot is saved to the filesystem and attached to
 * the Cucumber report for easy access.
 *
 * Features:
 * - Generates safe filenames from scenario names
 * - Includes timestamp to avoid filename conflicts
 * - Prefixes with "failed_" for easy identification
 * - Graceful error handling (fails silently if screenshot cannot be captured)
 *
 * @param page - Playwright page instance at the time of failure
 * @param scenarioName - Name of the failed scenario
 * @param attach - Cucumber attach function for adding artifacts to reports
 *
 * @example
 * // Called automatically in After hook for failed scenarios
 * await captureFailureScreenshot(this.page, scenario.pickle.name, this.attach);
 */
export async function captureFailureScreenshot (
    page: Page,
    scenarioName: string,
    attach: AttachFunction
): Promise<void>
{
    try
    {
        // Generate safe filename from scenario name
        const safeScenarioName = scenarioName.replace( /[^a-zA-Z0-9]/g, '_' );
        const timestamp = Date.now();
        const filename = `failed_${ safeScenarioName }_${ timestamp }`;

        // Capture screenshot
        const screenshot = await captureScreenshot( page, filename );
        if ( screenshot )
        {
            // Attach screenshot to Cucumber report
            attach( screenshot, 'image/png' );
        }

    } catch ( error )
    {
        // Screenshot operation failed - continue silently
    }
}
