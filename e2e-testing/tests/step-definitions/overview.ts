import { DataTable, Then } from '@cucumber/cucumber';

Then( 'the following metrics should be displayed in the Network Overview section:', async function ( cards: DataTable )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertOverviewMetricCardsAreDisplayed( cards );
} );