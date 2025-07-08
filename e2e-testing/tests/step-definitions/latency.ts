import { Then } from '@cucumber/cucumber';

Then( 'the latency threshold input field should have a default value of {string}', async function ( latencyValue: string )
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertLatencyInputHasValue( latencyValue );
} );

Then( 'the input field should accept only numeric values', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertLatencyInputIsNumeric();
} );

Then( 'the apply latency button should be visible and clickable', async function ()
{
    const fiveGControlPanelPage = this.pageFactory.getFiveGControlPanelPage();
    await fiveGControlPanelPage.assertApplyLatencyButtonIsVisible();
    await fiveGControlPanelPage.assertApplyLatencyButtonIsClickable();
} );