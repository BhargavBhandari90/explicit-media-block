const { test, expect } = require( '@playwright/test' );
const { execSync } = require('child_process');
const path = require('path');

test.use( { storageState: process.env.ADMINSTATE } );

test( 'Add Block to Editor', async ( { page } ) => {
    await page.goto('/wp-admin/post-new.php?post_type=post');

    await page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('textbox', { name: 'Add title' }).click();
    await page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('textbox', { name: 'Add title' }).fill('Explicit Media Test');
    await page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('button', { name: 'Add block' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('exp');
    await page.getByRole('option', { name: ' Explicit Media' }).click();

    await page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('button', { name: 'Upload Image or Video' }).click();
    await expect(page.locator('.media-modal-content')).toBeVisible();

    const filePath = path.resolve(__dirname, '../assets/sample.png');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('.upload-ui .browser.button').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await expect(page.locator('.attachment.details.selected.save-ready')).toBeVisible();

    await page.getByRole('button', { name: 'Select', exact: true }).click();
    await page.getByRole('button', { name: 'Publish', exact: true }).click();
    await page.getByLabel('Editor publish').getByRole('button', { name: 'Publish', exact: true }).click();
});

test( 'Like/unlike Media Block from the Front', async ( { page } ) => {
    await page.goto('/explicit-media-test/');
    await page.locator('#wp--skip-link--target button').nth(1).click();
});
