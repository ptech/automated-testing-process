import { DataTable, Given, Then, When } from '@cucumber/cucumber';

Given( 'the user is on the 5G control panel page', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.navigateToControlPanel();
} );

Then( 'the title of the page should be {string}', async function ( title: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertTitle( title );
} );

Then( 'the navigation menu should be displayed', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertNavigationBarIsDisplayed();
} );

Then( 'the following sections should be displayed:', async function ( sectionsTable: DataTable )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertSectionsAreDisplayed( sectionsTable );
} );

When( 'the user clicks on the {string} navigation link', async function ( section: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.navigateToSection( section );
} );

Then( 'the page should scroll to the {string} section', async function ( section: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertSectionIsInViewport( section );
} );