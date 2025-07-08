import { DataTable, Then } from '@cucumber/cucumber';

Then( 'a table should be displayed with the following headers:', async function ( headersTable: DataTable )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertDevicesTableIsVisible();
    await fiveGControlPanelPage.assertDevicesTableHeadersAreDisplayed( headersTable );
} );