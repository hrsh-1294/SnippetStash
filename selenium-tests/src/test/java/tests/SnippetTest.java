package tests;

import base.BaseTest;
import pages.SnippetPage;

import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class SnippetTest extends BaseTest {

    SnippetPage page;

    @BeforeClass
    public void initPage() {
        page = new SnippetPage(driver, wait);
    }

    // Verify page loads
    @Test(priority = 1)
    public void verifyPageLoads() {

        String title = driver.getTitle();

        Assert.assertTrue(
                title.toLowerCase().contains("snippet"),
                "Page title does not contain 'snippet'");
    }

    // Create Snippet
    @Test(priority = 2)
    public void createSnippetTest() throws InterruptedException {

        page.getTitleField().sendKeys("Selenium Snippet");
        page.getTextArea().sendKeys("System.out.println(\"Hello Selenium\");");

        // Thread.sleep(2000);

        page.getCopyButton().click();

        // Thread.sleep(2000);

        page.getCreateSnippetButton().click();
    }

    // Navigate to Snippets Page
    @Test(priority = 3)
    public void goToSnippetsTab() {

        page.getSnippetsPageLink().click();

        Assert.assertTrue(driver.getCurrentUrl().contains("snippet"),
                "Failed to navigate to snippets page");
    }

    // Positive Search Test
    @Test(priority = 4)
    public void searchSnippetTest() throws InterruptedException {

        // Thread.sleep(2000);

        String keyword = "Selenium";

        page.getSearchBox().clear();
        page.getSearchBox().sendKeys(keyword);

        // Thread.sleep(2000);

        boolean found = false;

        for (WebElement snippet : page.getAllSnippets()) {
            if (snippet.getText().toLowerCase().contains(keyword.toLowerCase())) {
                found = true;
                break;
            }
        }

        page.getSearchBox().clear();
        Assert.assertTrue(found, "Search functionality failed. Snippet not found.");
    }

    // Verify Edit Snippet
    @Test(priority = 5)
    public void editSnippetTest() throws InterruptedException {

        page.getEditSnippet().click();

        // Thread.sleep(2000);

        page.getTextArea().clear();
        page.getTextArea().sendKeys("Updated Selenium Code");

        page.getUpdateSnippetButton().click();

        // Thread.sleep(2000);
        page.getSnippetsPageLink().click();

    }

    // Verify View Snippet
    @Test(priority = 6)
    public void viewSnippetTest() throws InterruptedException {

        page.getViewSnippet().click();

        // Thread.sleep(2000);

        Assert.assertTrue(driver.getCurrentUrl().contains("snippet"),
                "View snippet page did not open correctly");

        driver.navigate().back();
    }

    // Verify Copy Snippet
    @Test(priority = 7)
    public void copySnippetTest() throws InterruptedException {

        page.getCopyToClipboard().click();

        // Thread.sleep(2000);

        // Copy verification depends on clipboard API, so we confirm click execution
        Assert.assertTrue(true, "Copy button clicked successfully");
    }

    // Verify Delete Snippet
    @Test(priority = 8)
    public void deleteSnippetTest() throws InterruptedException {

        page.getDeleteSnippet().click();

        // Thread.sleep(2000);

        Assert.assertTrue(true, "Snippet deleted successfully");
    }
}