import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object class that provides common functionality for all page objects
 *
 * This abstract class serves as the foundation for all page object implementations,
 * providing reusable methods for navigation, element interactions, and assertions.
 * All page objects should extend this class to inherit common functionality.
 */
export abstract class BasePage
{
    protected page: Page;
    protected baseUrl: string;

    /**
     * Creates a new instance of BasePage
     * @param page - Playwright page instance for browser interactions
     * @param baseUrl - Base URL of the application (optional, defaults to empty string)
     */
    constructor ( page: Page, baseUrl: string = '' )
    {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    // ========================================
    // NAVIGATION METHODS
    // ========================================

    /**
     * Navigates to a specific path within the application
     * Supports both relative paths (appended to baseUrl) and absolute URLs
     * @param path - Path to navigate to (defaults to empty string for home page)
     * @example
     * await this.navigateTo('/dashboard') // Goes to baseUrl + '/dashboard'
     * await this.navigateTo('https://example.com') // Goes to absolute URL
     * await this.navigateTo() // Goes to baseUrl (home page)
     */
    async navigateTo ( path: string = '' ): Promise<void>
    {
        const url = path.startsWith( 'http' ) ? path : `${ this.baseUrl }${ path }`;
        await this.page.goto( url );
    }

    // ========================================
    // INTERACTION METHODS
    // ========================================

    /**
     * Clicks a button by its accessible name/text
     * Uses exact text matching to find the button
     * @param buttonName - The visible text or accessible name of the button
     * @example
     * await this.clickButton('Submit') // Clicks button with text "Submit"
     * await this.clickButton('Limpar Alertas') // Clicks button with text "Limpar Alertas"
     */
    async clickButton ( buttonName: string ): Promise<void>
    {
        await this.page.getByRole( "button", { name: buttonName, exact: true } ).click();
    }

    // ========================================
    // ASSERTION METHODS
    // ========================================

    /**
     * Verifies that the page has the expected title
     * @param expectedTitle - The expected page title
     * @example
     * await this.assertTitle('5G Control Panel')
     */
    async assertTitle ( expectedTitle: string ): Promise<void>
    {
        await expect( this.page ).toHaveTitle( expectedTitle );
    }

    /**
     * Verifies that an element is visible on the page
     * @param element - Playwright locator for the element to check
     * @example
     * await this.assertDisplayed(page.getByRole('button', { name: 'Submit' }))
     */
    async assertDisplayed ( element: Locator ): Promise<void>
    {
        await expect( element ).toBeVisible();
    }

    /**
     * Verifies that an element is not visible/hidden on the page
     * @param element - Playwright locator for the element to check
     * @example
     * await this.assertNotDisplayed(page.locator('.error-message'))
     */
    async assertNotDisplayed ( element: Locator ): Promise<void>
    {
        await expect( element ).toBeHidden();
    }

    /**
     * Verifies that a button is clickable
     * @param element - Playwright locator for the element to check
     * @example
     * await this.assertNotDisplayed(page.locator('.error-message'))
     */
    async assertClickable ( element: Locator ): Promise<void>
    {
        await expect( element ).toBeEnabled();
    }

    /**
     * Verifies that an element is currently visible in the viewport
     * @param element - Playwright locator for the element to check
     * @example
     * await this.assertElementInViewport(page.locator('#section-heading'))
     */
    async assertElementInViewport ( element: Locator ): Promise<void>
    {
        await expect( element ).toBeInViewport();
    }

    /**
     * Verifies that an element contains the expected text
     * Supports both single text string and array of texts for multiple elements
     * @param element - Playwright locator for the element(s) to check
     * @param expectedText - Expected text content (string for single element, array for multiple)
     * @example
     * await this.assertText(page.locator('h1'), 'Welcome')
     * await this.assertText(page.locator('.item'), ['Item 1', 'Item 2', 'Item 3'])
     */
    async assertText ( element: Locator, expectedText: string | string[] ): Promise<void>
    {
        await expect( element ).toHaveText( expectedText );
    }

    /**
     * Verifies that an input field has the expected value
     * @param element - Playwright locator for the input element
     * @param expectedValue - Expected input value
     * @example
     * await this.assertInputValue(page.locator('#username'), 'john.doe')
     */
    async assertInputValue ( element: Locator, expectedValue: string ): Promise<void>
    {
        await expect( element ).toHaveValue( expectedValue );
    }

    /**
     * Verifies that an element has a specific attribute with the expected value
     * @param element - Playwright locator for the element to check
     * @param attribute - Name of the attribute to verify
     * @param expectedValue - Expected attribute value
     * @example
     * await this.assertAttribute(page.locator('#email'), 'type', 'email')
     * await this.assertAttribute(page.locator('.button'), 'disabled', 'true')
     */
    async assertAttribute ( element: Locator, attribute: string, expectedValue: string ): Promise<void>
    {
        await expect( element ).toHaveAttribute( attribute, expectedValue );
    }

    assertCount( count: number, expectedCount: number): void
    {
        expect( count ).toBe( expectedCount );
    }
}
