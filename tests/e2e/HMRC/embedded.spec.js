import { test, expect } from '@playwright/test';
import { config } from '../../config';
import login from '../../common';

test.beforeEach(async ({ page }) => {
  await page.goto(config.baseUrl);
});

test.describe('E2E test', () => {
  test('Redirect to login page correctly and login', async ({ page }) => {
    await login(page);
  });

  test('Header, and logo are present', async ({ page }) => {
    await login(page);
    // Assert that the logo is visible
    const logo = await page.$('.govuk-header__logotype');
    expect(logo).not.toBeNull();
    // Assert that the service name is visible
    const serviceName = await page.$('.govuk-header__service-name');
    expect(serviceName).not.toBeNull();
    // Get all navigation links
    const navigationLinks = await page.$$('.govuk-header__navigation__link');
    // Extract text content promises
    const textContentPromises = navigationLinks.map(link => {
      return link.textContent();
    });
    // Gather text content from all links
    const linkTexts = await Promise.all(textContentPromises);
    // Assert that all links have non-empty text content
    expect(linkTexts.every(text => text.trim().length > 0)).toBeTruthy();
  });

  test('Phase banner displays correctly', async ({ page }) => {
    await login(page);
    // Find the phase banner element
    const phaseBanner = await page.$('.govuk-phase-banner');
    // Assert that the phase banner element exists
    expect(phaseBanner).not.toBeNull();
    // Find the text element within the phase banner
    const textElement = await phaseBanner.$('.govuk-phase-banner__text');
    // Assert that the text element exists
    expect(textElement).not.toBeNull();
    // Get the text content of the text element
    const text = await textElement.textContent();
    // Assert that the text content contains the expected text
    expect(text).toContain('This is a new service - your');
    // Find the feedback link within the phase banner
    const feedbackLink = await phaseBanner.$('.govuk-phase-banner__text .govuk-link');
    // Assert that the feedback link exists
    expect(feedbackLink).not.toBeNull();
    // Get the text content of the feedback link
    const linkText = await feedbackLink.textContent();
    // Assert that the link text is as expected
    expect(linkText.trim()).toBe('feedback');
  });

  test('Welsh translation', async ({ page }) => {
    await login(page);
    // Find the language toggle link for Welsh ("Cymraeg")
    const welshLanguageLink = await page.$('a[lang="cy"]');
    // Click on the Welsh language link to change the language
    await welshLanguageLink.click();
    // Wait for the sign-out link to appear after language change
    await page.waitForSelector('#signout-btn');
    // Find the sign-out link
    const signOutLinkCy = await page.$('#signout-btn');
    // Get the text content of the sign-out link
    const linkTextCy = await signOutLinkCy.textContent();
    // Assert that the text content matches the expected text after language change
    expect(linkTextCy.trim()).toBe('Allgofnodi');
  });

  test('English translation', async ({ page }) => {
    await login(page);
    // Find the sign-out link
    const signOutLinkEn = await page.$('#signout-btn');
    // Get the text content of the sign-out link
    const linkTextEn = await signOutLinkEn.textContent();
    // Assert that the text content matches the expected text after language change
    expect(linkTextEn.trim()).toBe('Sign out');
  });

  test.describe('Footer', () => {
    test('Footer links and logos are present', async ({ page }) => {
      await login(page);
      // Find footer element
      const footer = await page.$('footer.govuk-footer');
      // Assert that footer exists
      expect(footer).not.toBeNull();

      // Test footer links
      const footerLinks = await footer.$$('.govuk-footer__link');
      expect(footerLinks.length).toBeGreaterThan(0);

      // Test footer logos
      const footerLogos = await footer.$$('.govuk-footer__licence-logo');
      expect(footerLogos.length).toBeGreaterThan(0);
    });

    test('Footer text content is correct', async ({ page }) => {
      await login(page);
      // Find footer element
      const footer = await page.$('footer.govuk-footer');
      // Assert that footer exists
      expect(footer).not.toBeNull();

      // Test footer text content
      const footerText = await footer.textContent();
      expect(footerText.includes('All content is available under the')).toBeTruthy();
      expect(footerText.includes('© Crown copyright')).toBeTruthy();
    });
  });
});

test.afterEach(async ({ page }) => {
  await page.pause();
});
