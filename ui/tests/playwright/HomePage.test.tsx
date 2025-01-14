import { expect, test } from "@playwright/test";

test("Home page", async ({ page }) => {
  await test.step("Column headings are present", async () => {
    await page.goto("./home");
    const columnHeadings = await page.locator('table[aria-label="Kafka clusters"] thead th').evaluateAll((ths) =>
  ths.map((th) => th.textContent?.trim()));
    expect(columnHeadings).toContain("Name");
    expect(columnHeadings).toContain("Brokers");
    expect(columnHeadings).toContain("Consumer groups");
    expect(columnHeadings).toContain("Kafka version");
    expect(columnHeadings).toContain("Project");
  });

  await test.step("Connection details should show URL", async () => {
    // Click on the kebab toggle button
    await page.click('button[class="pf-v5-c-menu-toggle pf-m-plain"]');
    // Wait for the dropdown menu to appear
    await page.waitForSelector('ul[class="pf-v5-c-menu__list"]');
    // Click on the "Connection details" button within the dropdown menu
    await page.click(
      'button[class="pf-v5-c-menu__item"] span[class="pf-v5-c-menu__item-text"]:has-text("Connection details")',
    );
    await page.waitForSelector('.pf-v5-c-form-control input[type="text"]');
    expect(await page.innerText("body")).toContain(
      "Cluster connection details",
    );
    expect(await page.innerText("body")).toContain(
      "External listeners provide client access to a Kafka cluster from outside the OpenShift cluster.",
    );
    const inputValues = await page.locator('.pf-v5-c-form-control input[type="text"]').evaluateAll((inputs) =>
    inputs.map((input) => (input as HTMLInputElement).value)
  );
    expect(inputValues.every((value) => value.length > 1)).toBe(true); //await page.waitForSelector('span[class="pf-v5-c-form-control pf-m-readonly"] input[id="text-input-13"]');
  });

  await test.step("Data rows are present", async () => {
    const dataRows = await page.locator('table[aria-label="Kafka clusters"] tbody tr').elementHandles();
    expect(dataRows.length).toBeGreaterThan(0);
  });

  await test.step("Data cells in each row are present", async () => {
    const dataCells = await page.locator('table[aria-label="Kafka clusters"] tbody tr td').evaluateAll((tds) =>
    tds.map((td) => td.textContent?.trim() ?? "")
  );
    expect(dataCells.length).toBeGreaterThan(0);
  });

  await test.step("Text on Home Page", async () => {
    // Assertions for the presence of specific strings in the inner text of page elements
    expect(await page.innerText("body")).toContain(
      "Welcome to the streams for Apache Kafka console",
    );
    expect(await page.innerText("body")).toContain(
      "Platform: OpenShift Cluster",
    );
    expect(await page.innerText("body")).toContain("Recently viewed topics");
    expect(await page.innerText("body")).toContain(
      "When you start looking at specific topics through the streams for Apache Kafka console, they'll start showing here.",
    );
    expect(await page.innerText("body")).toContain(
      "streams for Apache Kafka on OpenShift Overview",
    );
    expect(await page.innerText("body")).toContain(
      "Recommended learning resources",
    );
    expect(await page.innerText("body")).toContain(
      "Getting Started with streams for Apache Kafka on Openshift",
    );
    expect(await page.innerText("body")).toContain(
      "Connect to a Kafka cluster from an application",
    );
    expect(await page.innerText("body")).toContain(
      "Using the Topic Operator to manage Kafka topics",
    );
  });
});
