import { DataTable, Then, When } from '@cucumber/cucumber';

Then( 'the existing alerts should be displayed', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertAlertsAreDisplayed();
} );

When( 'the user clicks the clear alerts button', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.clearAllAlerts();
} );

Then( 'the alerts list should be replaced with {string}', async function ( _message: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertAlertsAreNotDisplayed();
    await fiveGControlPanelPage.assertAlertsClearedMessageIsDisplayed();
} );