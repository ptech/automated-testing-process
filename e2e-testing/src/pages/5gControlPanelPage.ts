import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { DataTable } from "@cucumber/cucumber";
import { SECTION_NAMES, BUTTON_NAMES, MESSAGES } from '../constants/5g-control-panel-constants';
import { TestHelpers } from "../utils/testHelpers";

/**
 * Page Object for the 5G Control Panel application
 * Provides methods to interact with and validate the 5G network management interface
 *
 * Sections covered:
 * - Overview (Visão Geral da Rede)
 * - Network Slices
 * - Connected Devices (Dispositivos Conectados)
 * - QoS & Latency (QoS e Latência)
 * - Alerts & Events (Alertas e Eventos)
 */
export class FiveGControlPanelPage extends BasePage
{
    // Page elements (selectors)
    private readonly selectors = {
        // Main sections
        section: "section",

        // Visão Geral section
        metricCard: "div.metric-card",

        // Network Slices section
        networkSliceCard: "div.slice-item",
        networkSliceProperty: "p strong",
        tableHeader: "th",
        addNewSliceDialog: "div[role='dialog']",

        // QoS section
        latencyThresholdInput: "#latency-threshold",

        // Alerts section
        alert: "div.alert-item",
        alertText: "span:first-of-type"
    };

    /**
     * Creates a new instance of FiveGControlPanelPage
     * @param page - Playwright page instance
     * @param baseUrl - Base URL of the application
     */
    constructor ( page: Page, baseUrl: string )
    {
        super( page, baseUrl );
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Get a section locator by its heading name
     * @param sectionName - The name of the section heading
     * @returns Locator for the section
     */
    private getSectionByHeading ( sectionName: string ): Locator
    {
        return this.page.locator( this.selectors.section )
            .filter( {
                has: this.page.getByRole( "heading", { name: sectionName, exact: true } )
            } );
    }

    /**
     * Assert elements in section have expected text
     * @param sectionName - The name of the section heading
     * @param elementSelector - The selector for elements within the section
     * @param expectedTexts - Array of expected text values
     */
    private async assertSectionElementsHaveText ( sectionName: string, elementSelector: string, expectedTexts: string[] ): Promise<void>
    {
        const elementsLocator = this.getSectionByHeading( sectionName ).locator( elementSelector );
        await this.assertText( elementsLocator, expectedTexts );
    }

    /**
     * Assert button is visible in a specific section
     * @param sectionName - The name of the section heading
     * @param buttonName - The name of the button
     */
    private async assertButtonInSectionIsVisible ( sectionName: string, buttonName: string ): Promise<void>
    {
        const buttonLocator = this.getSectionByHeading( sectionName )
            .getByRole( "button", { name: buttonName, exact: true } );
        await this.assertDisplayed( buttonLocator );
    }

    /**
 * Assert button is clickable in a specific section
 * @param sectionName - The name of the section heading
 * @param buttonName - The name of the button
 */
    private async assertButtonInSectionIsClickable ( sectionName: string, buttonName: string ): Promise<void>
    {
        const buttonLocator = this.getSectionByHeading( sectionName )
            .getByRole( "button", { name: buttonName, exact: true } );
        await this.assertClickable( buttonLocator );
    }

    /**
     * Iterate over all cards and assert each has expected elements
     * @param cardSelector - The selector for card elements
     * @param elementSelector - The selector for elements within each card
     * @param expectedTexts - Array of expected text values
     */
    private async assertAllCardsHaveElements ( cardSelector: string, elementSelector: string, expectedTexts: string[] ): Promise<void>
    {
        const cardsLocator: Locator[] = await this.page.locator( cardSelector ).all();

        for ( const card of cardsLocator )
        {
            const elementsLocator: Locator = card.locator( elementSelector );
            await this.assertText( elementsLocator, expectedTexts );
        }
    }

    /**
     * Assert all cards have a specific button
     * @param cardSelector - The selector for card elements
     * @param buttonName - The name of the button
     */
    private async assertAllCardsHaveButton ( cardSelector: string, buttonName: string ): Promise<void>
    {
        const cardsLocator: Locator[] = await this.page.locator( cardSelector ).all();

        for ( const card of cardsLocator )
        {
            const buttonLocator: Locator = card.getByRole( "button", { name: buttonName, exact: true } );
            await this.assertDisplayed( buttonLocator );
        }
    }

    // ========================================
    // NAVIGATION METHODS
    // ========================================

    /**
     * Navigates to the 5G Control Panel main page
     */
    async navigateToControlPanel (): Promise<void>
    {
        await this.navigateTo();
    }

    /**
     * Clicks on a navigation link to scroll to a specific section
     * @param sectionName - Name of the section to navigate to (e.g., "Visão Geral", "Network Slices")
     */
    async navigateToSection ( sectionName: string ): Promise<void>
    {
        await this.page.getByRole( "navigation" ).getByText( sectionName, { exact: true } ).click();
    }

    // ========================================
    // GENERAL PAGE ASSERTIONS
    // ========================================

    /**
     * Verifies that the main navigation bar is visible on the page
     */
    async assertNavigationBarIsDisplayed (): Promise<void>
    {
        await this.assertDisplayed( this.page.getByRole( "navigation" ) );
    }

    /**
     * Verifies that all specified sections are displayed on the page
     * @param sectionsTable - DataTable containing section names to verify
     */
    async assertSectionsAreDisplayed ( sectionsTable: DataTable ): Promise<void>
    {
        const sections = sectionsTable.rows().flat();
        for ( const section of sections )
        {
            const sectionTitleLocator: Locator = this.page.locator( this.selectors.section ).getByRole( "heading", { name: section, exact: true } );
            await this.assertDisplayed( sectionTitleLocator );
        }
    }

    /**
     * Verifies that a specific section is currently visible in the viewport
     * @param section - Name of the section to check (e.g., "Visão Geral da Rede")
     */
    async assertSectionIsInViewport ( section: string ): Promise<void>
    {
        const sectionTitleLocator: Locator = this.page.locator( this.selectors.section ).getByRole( "heading", { name: section, exact: true } );
        await this.assertElementInViewport( sectionTitleLocator );
    }

    // ========================================
    // OVERVIEW SECTION METHODS
    // ========================================

    /**
     * Verifies that metric cards are displayed in the overview section
     * @param section - Name of the section (e.g., "Visão Geral da Rede")
     * @param cardsTable - DataTable containing expected metric card names
     */
    async assertOverviewMetricCardsAreDisplayed ( cardsTable: DataTable ): Promise<void>
    {
        const expectedCardHeadings = TestHelpers.extractDataTableValues( cardsTable );
        const cardHeadings = this.getSectionByHeading( SECTION_NAMES.OVERVIEW ).locator( this.selectors.metricCard ).getByRole( "heading" );
        await this.assertText( cardHeadings, expectedCardHeadings );
    }

    // ========================================
    // NETWORK SLICES SECTION METHODS
    // ========================================

    /**
     * Verifies that each network slice displays the expected detail properties
     * @param detailsTable - DataTable containing expected detail labels (e.g., "ID:", "Status:")
     */
    async assertNetworkSliceDetailsAreDisplayed ( detailsTable: DataTable ): Promise<void>
    {
        const expectedDetails = TestHelpers.extractDataTableValues( detailsTable );
        await this.assertAllCardsHaveElements( this.selectors.networkSliceCard, this.selectors.networkSliceProperty, expectedDetails );
    }

    /**
     * Verifies that a specific button is displayed on all network slice cards
     * @param buttonName - Name of the button to verify (e.g., "Configurar", "Desativar")
     */
    async assertNetworkSliceButtonIsDisplayed ( buttonName: string ): Promise<void>
    {
        await this.assertAllCardsHaveButton( this.selectors.networkSliceCard, buttonName );
    }

    /**
     * Verifies that the Add New Slice button is displayed on the Network Slices section
     */
    async assertAddNewSliceButtonIsDisplayed (): Promise<void>
    {
        await this.assertButtonInSectionIsVisible( SECTION_NAMES.NETWORK_SLICES, BUTTON_NAMES.ADD_NEW_SLICE );
    }

    /**
     * Verifies that the Add New Slice button is displayed on the Network Slices section
     */
    async assertAddNewSliceButtonIsClickable (): Promise<void>
    {
        await this.assertButtonInSectionIsClickable( SECTION_NAMES.NETWORK_SLICES, BUTTON_NAMES.ADD_NEW_SLICE );
    }

    /**
     * Clicks the Add New Slice button 
     */
    async clickAddNewSliceButton (): Promise<void>
    {
        await this.clickButton( BUTTON_NAMES.ADD_NEW_SLICE );
    }

    /**
     * Verifies that the Add New Slice popup is displayed
     */
    async assertAddNewSliceDialogVisible (): Promise<void>
    {
        await this.assertDisplayed( this.page.locator( this.selectors.addNewSliceDialog ) );
    }

    // ========================================
    // DEVICES SECTION METHODS
    // ========================================

    /**
     * Verifies that the devices table is visible in the connected devices section
     */
    async assertDevicesTableIsVisible (): Promise<void>
    {
        const sectionLocator: Locator = this.getSectionByHeading( SECTION_NAMES.CONNECTED_DEVICES );
        await this.assertDisplayed( sectionLocator.getByRole( "table" ) );
    }

    /**
     * Verifies that the devices table displays the expected column headers
     * @param headersTable - DataTable containing expected table headers
     */
    async assertDevicesTableHeadersAreDisplayed ( headersTable: DataTable ): Promise<void>
    {
        const expectedHeaders = TestHelpers.extractDataTableValues( headersTable );
        await this.assertSectionElementsHaveText( SECTION_NAMES.CONNECTED_DEVICES, this.selectors.tableHeader, expectedHeaders );
    }

    // ========================================
    // QOS LATENCY SECTION METHODS
    // ========================================

    /**
     * Verifies that the latency threshold input field has the expected default value
     * @param expectedValue - Expected default value (e.g., "5")
     */
    async assertLatencyInputHasValue ( expectedValue: string ): Promise<void>
    {
        const latencyInputLocator: Locator = this.page.locator( this.selectors.latencyThresholdInput );
        await this.assertInputValue( latencyInputLocator, expectedValue );
    }

    /**
     * Verifies that the latency input field is configured to accept only numeric values
     */
    async assertLatencyInputIsNumeric (): Promise<void>
    {
        const latencyInputLocator: Locator = this.page.locator( this.selectors.latencyThresholdInput );
        await this.assertAttribute( latencyInputLocator, "type", "number" );
    }

    /**
     * Verifies that the apply latency button is visible in the QoS latency section
     */
    async assertApplyLatencyButtonIsVisible (): Promise<void>
    {
        await this.assertButtonInSectionIsVisible( SECTION_NAMES.QOS_LATENCY, BUTTON_NAMES.APPLY );
    }

    /**
     * Verifies that the apply latency button is displayed on the QoS latency section
     */
    async assertApplyLatencyButtonIsClickable (): Promise<void>
    {
        await this.assertButtonInSectionIsClickable( SECTION_NAMES.QOS_LATENCY, BUTTON_NAMES.APPLY );
    }

    // ========================================
    // ALERTS SECTION METHODS
    // ========================================

    /**
     * Verifies that the expected alerts are displayed in the alerts section
     */
    async assertAlertsAreDisplayed (): Promise<void>
    {
        const alertCount = await this.page.locator(this.selectors.alert).count();
        this.assertCount( alertCount, 3 );
    }

    /**
     * Clicks the "Clear Alerts" button to remove all alerts
     */
    async clearAllAlerts (): Promise<void>
    {
        await this.clickButton( BUTTON_NAMES.CLEAR_ALERTS );
    }

    /**
     * Verifies that no alert items are displayed (alerts have been cleared)
     */
    async assertAlertsAreNotDisplayed (): Promise<void>
    {
        const sectionLocator: Locator = this.getSectionByHeading( SECTION_NAMES.ALERTS_EVENTS );
        const alertsLocator: Locator = sectionLocator.locator( this.selectors.alert );
        await this.assertNotDisplayed( alertsLocator );
    }

    /**
     * Verifies that the "no alerts" message is displayed after clearing alerts
     */
    async assertAlertsClearedMessageIsDisplayed (): Promise<void>
    {
        const sectionLocator: Locator = this.getSectionByHeading( SECTION_NAMES.ALERTS_EVENTS );
        const alertsClearedLocator: Locator = sectionLocator.getByText( MESSAGES.NO_RECENT_ALERTS );
        await this.assertDisplayed( alertsClearedLocator );
    }
}
