/**
 * Video Recording Utilities for Test Automation
 *
 * Provides functionality to record videos of test scenario execution using Playwright.
 * Videos are automatically captured for all scenarios (both passed and failed) and
 * attached to Cucumber reports for debugging and documentation purposes.
 *
 * Features:
 * - Automatic video recording for all test scenarios
 * - Safe filename generation from scenario names
 * - Integration with Cucumber reporting
 * - Cleanup and resource management
 * - Error handling with graceful fallbacks
 */

import { BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definition for Cucumber's attach function
 * Used to attach video files to test reports
 */
type AttachFunction = {
    ( data: string, mediaType?: string ): void;
    ( data: Buffer, mediaType: string ): void;
};

/**
 * Configuration options for video recording
 *
 * Allows customization of video recording parameters including
 * dimensions and output directory.
 */
export interface VideoOptions
{
    width?: number;
    height?: number;
    dir?: string;
}

/**
 * Video Recording Manager
 *
 * Manages video recording state and operations for test scenarios.
 * Handles the lifecycle of video recordings from start to cleanup,
 * including file management and integration with Cucumber reports.
 *
 * Features:
 * - Scenario-based video recording tracking
 * - Safe filename generation
 * - Automatic directory creation
 * - Error handling and cleanup
 * - Cucumber report integration
 */
export class VideoRecorder
{
    private static recordings = new Map<string, string>();

    /**
     * Starts video recording for a scenario
     * @param scenarioName - Name of the scenario
     * @param options - Video recording options
     * @returns Promise<string | null> - Video file path or null if failed
     */
    static async startRecording (
        scenarioName: string,
        options: VideoOptions = {}
    ): Promise<string | null>
    {
        try
        {
            // Generate safe filename from scenario name
            const safeScenarioName = scenarioName.replace( /[^a-zA-Z0-9]/g, '_' );
            const timestamp = Date.now();
            const filename = `${ safeScenarioName }_${ timestamp }.webm`;
            const videoDir = options.dir || 'test-results/videos';
            const videoPath = path.join( videoDir, filename );

            // Ensure video directory exists
            if ( !fs.existsSync( videoDir ) )
            {
                fs.mkdirSync( videoDir, { recursive: true } );
            }

            // Store the video path for this scenario
            VideoRecorder.recordings.set( scenarioName, videoPath );

            return videoPath;
        } catch ( error )
        {
            console.error( 'Failed to start video recording:', error );
            return null;
        }
    }

    /**
     * Records video for the entire scenario execution
     * @param context - Playwright browser context
     * @param scenarioName - Name of the scenario
     * @param attach - Cucumber attach function for adding artifacts to reports
     * @returns Promise<void>
     */
    static async recordScenario (
        context: BrowserContext,
        scenarioName: string,
        attach: AttachFunction
    ): Promise<void>
    {
        try
        {
            // Get the video path from the context
            const page = context.pages()[ 0 ];
            if ( page && page.video )
            {
                const video = page.video();
                if ( video )
                {
                    // Get the video path but don't try to read it yet
                    const videoPath = await video.path();

                    // Store the video path for later processing
                    VideoRecorder.recordings.set( scenarioName, videoPath );
                }
            }
        } catch ( error )
        {
            // Silently handle video preparation errors
        }
    }

    /**
     * Attaches the video file to the Cucumber report after context is closed
     * @param scenarioName - Name of the scenario
     * @param attach - Cucumber attach function for adding artifacts to reports
     * @returns Promise<void>
     */
    static async attachVideo (
        scenarioName: string,
        attach: AttachFunction
    ): Promise<void>
    {
        try
        {
            const videoPath = VideoRecorder.recordings.get( scenarioName );
            if ( !videoPath )
            {
                return;
            }

            // Wait for the video file to be finalized after context closure
            let attempts = 0;
            const maxAttempts = 10;
            const waitTime = 500;

            while ( attempts < maxAttempts )
            {
                if ( fs.existsSync( videoPath ) )
                {
                    try
                    {
                        const videoBuffer = fs.readFileSync( videoPath );
                        if ( videoBuffer.length > 0 )
                        {
                            attach( videoBuffer, 'video/webm' );
                            break;
                        }
                    } catch ( readError )
                    {
                        // Continue trying on read errors
                    }
                }

                attempts++;
                if ( attempts < maxAttempts )
                {
                    await new Promise( resolve => setTimeout( resolve, waitTime ) );
                }
            }

            // Clean up the recording reference
            VideoRecorder.recordings.delete( scenarioName );
        } catch ( error )
        {
            VideoRecorder.recordings.delete( scenarioName );
        }
    }

    /**
     * Cleanup any remaining recordings
     */
    static cleanup (): void
    {
        VideoRecorder.recordings.clear();
    }
}

/**
 * Prepares video recording for a test scenario
 * @param context - Playwright browser context
 * @param scenarioName - Name of the scenario
 */
export async function prepareScenarioVideo (
    context: BrowserContext,
    scenarioName: string
): Promise<void>
{
    await VideoRecorder.recordScenario( context, scenarioName, () => {} );
}

/**
 * Attaches video to Cucumber report after context is closed
 * @param scenarioName - Name of the scenario
 * @param attach - Cucumber attach function for adding artifacts to reports
 */
export async function attachScenarioVideo (
    scenarioName: string,
    attach: AttachFunction
): Promise<void>
{
    await VideoRecorder.attachVideo( scenarioName, attach );
}
