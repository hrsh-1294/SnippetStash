package base;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.*;
import java.net.URL;


import java.time.Duration;

public class BaseTest {

    protected WebDriver driver;
    protected WebDriverWait wait;

    @BeforeClass
    public void setup() throws Exception {

        ChromeOptions options = new ChromeOptions();

        // Required for Docker / CI
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new RemoteWebDriver(
        new URL("http://selenium-hub:4444/wd/hub"),  // ← Selenium Hub
        options
    );


        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("http://web");
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}