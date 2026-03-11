package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class SnippetPage {

    WebDriver driver;
    WebDriverWait wait;

    public SnippetPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    By titleField = By.id("title");
    By textArea = By.id("content");
    By createSnippet = By.xpath("//button[contains(text(),'Create Snippet')]");
    By updateSnippet = By.xpath("//button[contains(text(),'Update Snippet')]");



    By searchBox = By.xpath("//input[@type='search']");
    By copyButton = By.xpath("//button[@title='Copy to clipboard']");

    By deleteButton = By.xpath("//button[contains(text(),'Delete')]");
    By snippetsPage = By.xpath("//div/a[contains(text(),'Snippets')]");

    By allSnippets = By.cssSelector("div.grid");

    By editSnippet = By.xpath("//a[@title='Edit']");
    By viewSnippet = By.xpath("//a[@title='View']");
    By copyToClipboard = By.xpath("//button[@title='Copy to clipboard']");
    By deleteSnippet = By.xpath("//button[@title='Delete']");

    //home page elements
    public WebElement getTitleField() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(titleField));
    }

    public WebElement getTextArea() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(textArea));
    }

    public WebElement getCreateSnippetButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(createSnippet));
    }

    public WebElement getSearchBox() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(searchBox));
    }

    public WebElement getCopyButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(copyButton));
    }

    public WebElement getDeleteButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(deleteButton));
    }

    public WebElement getSnippetsPageLink() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(snippetsPage));
    }

    //snippet page elements
    public List<WebElement> getAllSnippets() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(allSnippets));
        return driver.findElements(allSnippets);
    }

    public WebElement getEditSnippet() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(editSnippet));
    }

    public WebElement getUpdateSnippetButton() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(updateSnippet));
    }

    public WebElement getViewSnippet() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(viewSnippet));
    }

    public WebElement getCopyToClipboard() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(copyToClipboard));
    }

    public WebElement getDeleteSnippet() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(deleteSnippet));
    }
}