import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { captureFailureScreenshot } from './screenshotUtils';
import { VideoRecorder, prepareScenarioVideo, attachScenarioVideo } from './videoUtils';
import { TraceRecorder, startScenarioTrace, recordScenarioTrace } from './traceUtils';
import * as fs from 'fs';

/**
 * Cucumber Hooks for Test Setup and Teardown
 *
 * This file contains all Cucumber hooks that manage the test lifecycle:
 * - Global setup/teardown for the entire test suite
 * - Scenario setup/teardown for individual test scenarios
 * - Failure handling with screenshots, videos, and traces
 * - Directory creation and cleanup
 */

/**
 * Global setup hook - runs once before all scenarios
 *
 * Creates necessary directories for test artifacts:
 * - test-results (main results directory)
 * - screenshots (failure screenshots)
 * - videos (scenario recordings)
 * - traces (Playwright traces)
 * - reports (test reports)
 */
BeforeAll( async function ()
{
    // Create necessary directories
    const dirs = [ 'test-results', 'test-results/screenshots', 'test-results/videos', 'test-results/traces', 'test-results/reports' ];
    dirs.forEach( dir =>
    {
        if ( !fs.existsSync( dir ) )
        {
            fs.mkdirSync( dir, { recursive: true } );
        }
    } );
} );

/**
 * Global teardown hook - runs once after all scenarios
 *
 * Performs cleanup operations for the entire test suite:
 * - Cleans up any remaining video recordings
 * - Cleans up any remaining trace recordings
 * - Ensures no resources are left hanging
 */
AfterAll( async function ()
{
    // Clean up any remaining video recordings
    VideoRecorder.cleanup();

    // Clean up any remaining trace recordings
    TraceRecorder.cleanup();
} );

/**
 * Before each scenario hook - runs before every test scenario
 *
 * Sets up the test environment for each scenario:
 * - Initializes browser, context, and page
 * - Prepares video recording for the scenario
 * - Starts trace recording for debugging
 *
 * @param scenario - Cucumber scenario object containing test information
 */
Before( async function ( this: CustomWorld, scenario )
{
    // Initialize browser for this scenario
    await this.init();

    // Prepare video recording for this scenario
    await prepareScenarioVideo( this.context, scenario.pickle.name );

    // Start trace recording for this scenario
    await startScenarioTrace( this.context, scenario.pickle.name );
} );

/**
 * After each scenario hook - runs after every test scenario
 *
 * Handles test cleanup and artifact collection:
 * - Captures screenshot on test failure for debugging
 * - Records trace for all scenarios for detailed debugging
 * - Cleans up browser resources to prevent memory leaks
 * - Attaches video after context is closed
 *
 * Artifacts are automatically attached to Cucumber reports for easy access.
 *
 * @param scenario - Cucumber scenario object containing test results and information
 */
After( async function ( this: CustomWorld, scenario )
{
    // Take screenshot on failure
    if ( scenario.result?.status === Status.FAILED )
    {
        await captureFailureScreenshot( this.page, scenario.pickle.name, this.attach );
    }

    // Record trace for all scenarios (both passed and failed)
    await recordScenarioTrace( this.context, scenario.pickle.name, this.attach );

    // Clean up browser resources first to finalize video
    await this.cleanup();

    // Attach video after context is closed (this ensures video is finalized)
    await attachScenarioVideo( scenario.pickle.name, this.attach );
} );