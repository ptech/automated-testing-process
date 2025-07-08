import { BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Type for Cucumber's attach function (simplified interface)
type AttachFunction = {
    ( data: string, mediaType?: string ): void;
    ( data: Buffer, mediaType: string ): void;
};

/**
 * Options for trace recording
 */
export interface TraceOptions
{
    screenshots?: boolean;
    snapshots?: boolean;
    sources?: boolean;
    dir?: string;
}

/**
 * Trace recording state management
 */
export class TraceRecorder
{
    private static recordings = new Map<string, string>();

    /**
     * Starts trace recording for a scenario
     * @param context - Playwright browser context
     * @param scenarioName - Name of the scenario
     * @param options - Trace recording options
     * @returns Promise<string | null> - Trace file path or null if failed
     */
    static async startRecording (
        context: BrowserContext,
        scenarioName: string,
        options: TraceOptions = {}
    ): Promise<string | null>
    {
        try
        {
            // Generate safe filename from scenario name
            const safeScenarioName = scenarioName.replace( /[^a-zA-Z0-9]/g, '_' );
            const timestamp = Date.now();
            const filename = `${ safeScenarioName }_${ timestamp }.zip`;
            const traceDir = options.dir || 'test-results/traces';
            const tracePath = path.join( traceDir, filename );

            // Ensure trace directory exists
            if ( !fs.existsSync( traceDir ) )
            {
                fs.mkdirSync( traceDir, { recursive: true } );
            }

            // Start tracing with comprehensive options
            await context.tracing.start( {
                screenshots: options.screenshots !== false, // Default to true
                snapshots: options.snapshots !== false,     // Default to true
                sources: options.sources !== false,         // Default to true
                title: scenarioName
            } );

            // Store the trace path for this scenario
            TraceRecorder.recordings.set( scenarioName, tracePath );

            return tracePath;
        } catch ( error )
        {
            console.error( 'Failed to start trace recording:', error );
            return null;
        }
    }

    /**
     * Stops trace recording and saves the trace file
     * @param context - Playwright browser context
     * @param scenarioName - Name of the scenario
     * @param attach - Cucumber attach function for adding artifacts to reports
     * @returns Promise<void>
     */
    static async stopRecording (
        context: BrowserContext,
        scenarioName: string,
        attach: AttachFunction
    ): Promise<void>
    {
        try
        {
            const tracePath = TraceRecorder.recordings.get( scenarioName );
            if ( !tracePath )
            {
                console.warn( `No trace recording found for scenario: ${ scenarioName }` );
                return;
            }

            // Stop tracing and save to file
            await context.tracing.stop( { path: tracePath } );

            // Wait a bit for the trace file to be finalized
            await new Promise( resolve => setTimeout( resolve, 500 ) );

            // Attach trace file to the test report if it exists
            if ( fs.existsSync( tracePath ) )
            {
                const traceBuffer = fs.readFileSync( tracePath );
                if ( traceBuffer.length > 0 )
                {
                    // Attach as application/zip since trace files are zip archives
                    attach( traceBuffer, 'application/zip' );
                }
            }

            // Clean up the recording reference
            TraceRecorder.recordings.delete( scenarioName );
        } catch ( error )
        {
            console.error( 'Failed to stop trace recording:', error );
            TraceRecorder.recordings.delete( scenarioName );
        }
    }

    /**
     * Records trace for the entire scenario execution
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
        await TraceRecorder.stopRecording( context, scenarioName, attach );
    }

    /**
     * Cleanup any remaining recordings
     */
    static cleanup (): void
    {
        TraceRecorder.recordings.clear();
    }
}

/**
 * Records trace for all test scenarios
 * @param context - Playwright browser context
 * @param scenarioName - Name of the scenario
 * @param attach - Cucumber attach function for adding artifacts to reports
 */
export async function recordScenarioTrace (
    context: BrowserContext,
    scenarioName: string,
    attach: AttachFunction
): Promise<void>
{
    await TraceRecorder.recordScenario( context, scenarioName, attach );
}

/**
 * Starts trace recording for a scenario
 * @param context - Playwright browser context
 * @param scenarioName - Name of the scenario
 * @param options - Trace recording options
 */
export async function startScenarioTrace (
    context: BrowserContext,
    scenarioName: string,
    options: TraceOptions = {}
): Promise<void>
{
    await TraceRecorder.startRecording( context, scenarioName, options );
}
