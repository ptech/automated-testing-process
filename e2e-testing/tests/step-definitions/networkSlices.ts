import { DataTable, Then, When } from '@cucumber/cucumber';

Then( 'the following details should be displayed for each slice:', async function ( detailsTable: DataTable )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertNetworkSliceDetailsAreDisplayed( detailsTable );
} );

Then( 'each slice should have {string} and {string} buttons', async function ( buttonName1: string, buttonName2: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertNetworkSliceButtonIsDisplayed( buttonName1 );
    await fiveGControlPanelPage.assertNetworkSliceButtonIsDisplayed( buttonName2 );
} );

Then( 'the add new slice button should be visible and clickable', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertAddNewSliceButtonIsDisplayed();
    await fiveGControlPanelPage.assertAddNewSliceButtonIsClickable();
} );

When( 'the user clicks on the add new slice button', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.clickAddNewSliceButton();
} );

Then( 'a popup should be displayed', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertAddNewSliceDialogVisible();
} );
