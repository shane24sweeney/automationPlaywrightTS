# automationPlaywrightTS

End-to-end tests for the INEIGHT API developer portal using Playwright and TypeScript, with Cucumber scenarios in `tests/features`.

## Setup

```bash
npm install
npx playwright install chromium webkit
```

## Run tests

```bash
npm test                  # desktop Chrome, Pixel 7 and iPhone 14 emulation
npm run test:mobile       # mobile projects only
npm run test:headed
npm run test:ui
npm run report
```

### Cucumber

```bash
npm run test:cucumber                              # desktop Chromium
npm run test:cucumber:mobile                       # Pixel 7 emulation
DEVICE="iPhone 14" npm run test:cucumber:mobile    # any Playwright device name
```

## BrowserStack

Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` (see `.env.example`), then:

```bash
npm run test:browserstack             # Playwright projects on BrowserStack browsers, mobile emulation kept
npm run test:cucumber:browserstack    # Cucumber on a BrowserStack desktop browser

# Cucumber on a real Android device running Chrome
BS_DEVICE="Samsung Galaxy S23" BS_OS_VERSION=13.0 npm run test:cucumber:browserstack
```

Pass/fail status is reported to the BrowserStack dashboard for each test. Real iOS devices are not supported by Playwright; iPhone coverage uses WebKit with iPhone emulation.

Mobile layout note: below desktop widths the portal's HOME / GETTING STARTED / APIs / PRODUCTS / DOCUMENTATION links sit behind a hamburger menu. Tests that navigate by clicking those links need to open the menu first on mobile.

## API tests (JMeter)

JMeter 5.6.3 lives in `tools/` (not committed). To install it:

```bash
mkdir -p tools && curl -sSL https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz | tar xz -C tools
```

```bash
npm run test:api     # headless run; HTML report at api-tests/results/report/index.html
npm run jmeter       # open the plan in the JMeter GUI
```

`api-tests/portal-api.jmx` checks the portal's anonymous endpoints (`/developer/apis`, `/developer/products`, `/developer/tags`, `/config.json`, `/config-apim.json`, `/token` returning 401) plus the home and APIs pages. Every request must respond within `max_ms`.

Override settings with `-J` flags, e.g. `npm run test:api -- -Jthreads=5 -Jloops=10 -Jrampup=10 -Jmax_ms=2000 -Jhost=developer-qa.ineight.com`. The defaults are 1 user, 1 loop, 3000 ms. This is a shared QA environment, so keep load small unless the environment owners agree.
