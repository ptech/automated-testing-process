# Automated Testing Process

A comprehensive end-to-end test automation framework using **Cucumber**, **Playwright**, and **TypeScript**, developed to demonstrate the testing process at Present Technologies. This repository contains both the **5G Control Panel web application** and the **automated testing framework** that tests it.

## 🎯 Application Under Test

This framework provides automated tests for a **5G Control Panel** sample web application. The 5G Control Panel is a fictional network management interface that simulates real-world 5G network administration capabilities.

### 5G Control Panel Features

The sample application includes the following sections and functionality:

- **📊 Network Overview (Visão Geral da Rede)**: Displays key network metrics including general status, current traffic, average latency, and active devices
- **🔗 Network Slices**: Manages network slice configurations with details like ID, status, allocated bandwidth, and priority latency. Includes functionality to add new slices and configure existing ones
- **📱 Connected Devices (Dispositivos Conectados)**: Shows a table of connected devices with device ID, type, network slice assignment, status, and available actions
- **⚡ QoS & Latency (QoS e Latência)**: Provides latency threshold configuration with numeric input validation and apply functionality
- **🚨 Alerts & Events (Alertas e Eventos)**: Displays system alerts with the ability to clear all alerts

The application features a responsive navigation menu that allows smooth scrolling between sections and provides a realistic testing environment for demonstrating various automation scenarios including form interactions, table validations, modal dialogs, and dynamic content updates.

## 🚀 Features

- **BDD Testing** with Cucumber for readable test scenarios
- **Cross-browser Testing** with Playwright (Chromium, Firefox, WebKit)
- **TypeScript** support for type safety and better IDE experience
- **Page Object Model** for maintainable test code
- **Parallel Execution** for faster test runs
- **Rich Reporting** with HTML and JSON outputs
- **Screenshot & Video** capture on failures
- **Flexible Configuration** via environment variables

## 📁 Project Structure

```
├── 5g-control-panel/        # Source code for the 5G Control Panel web application
│   ├── index.html           # Main HTML file for the web app
│   ├── script.js            # JavaScript functionality
│   └── style.css            # CSS styling
├── e2e-testing/             # End-to-end test automation framework
│   ├── src/                 # Test framework source code
│   │   ├── pages/           # Page Object Model classes
│   │   │   ├── base-page.ts # Base page class
│   │   │   └── example-page.ts # Example page implementation
│   │   ├── support/         # Support files (hooks, world, etc.)
│   │   │   ├── world.ts     # Custom World class
│   │   │   ├── hooks.ts     # Before/After hooks
│   │   │   ├── global-setup.ts # Global setup
│   │   │   └── global-teardown.ts # Global teardown
│   │   ├── utils/           # Utility functions
│   │   │   ├── test-helpers.ts # Test helper functions
│   │   │   └── generate-report.js # Report generation utility
│   │   ├── config/          # Configuration files
│   │   │   └── test-config.ts # Test configuration
│   │   └── constants/       # Test constants and data
│   ├── tests/               # Test files directory
│   │   ├── features/        # Cucumber feature files (.feature)
│   │   └── step-definitions/ # Step definition files (.ts)
│   ├── test-results/        # Test artifacts and reports
│   │   ├── reports/         # Test reports output
│   │   ├── screenshots/     # Test failure screenshots
│   │   ├── traces/          # Playwright trace files
│   │   └── videos/          # Test execution videos
│   ├── cucumber.json        # Cucumber configuration
│   ├── playwright.config.ts # Playwright configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Project dependencies
└── README.md                # Project documentation
```

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the test framework directory:
   ```bash
   cd e2e-testing
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

5. Copy environment configuration (if available):
   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your application URL (or use the local 5G Control Panel app)

## 🎯 Usage

### Running the 5G Control Panel Application

To run the 5G Control Panel web application locally:

1. Navigate to the application directory:
   ```bash
   cd 5g-control-panel
   ```

2. Open `index.html` in your browser or serve it using a local web server:
   ```bash
   # Using Node.js
   npx http-server -p 8080
   ```

3. The application will be available at `http://localhost:8080` (or the port shown by your server)

### Running Tests

Navigate to the test framework directory and run tests:

```bash
# Navigate to test directory
cd e2e-testing

# Run all tests
npm test
```

### Environment Variables

You can override configuration using environment variables (run from the `e2e-testing` directory):

```bash
# Run tests with different browser
BROWSER=firefox npm test

# Run tests in headed mode
HEADLESS=false npm test

# Run tests against different environment
APP_URL=https://staging.example.com npm test

# Run tests against local 5G Control Panel app
APP_URL=http://localhost:8080 npm test
```

### Tags

Use Cucumber tags to organize and run specific tests:

- `@smoke` - Critical functionality tests
- `@regression` - Full regression suite
- `@debug` - Tests under development
- `@login` - Authentication related tests
- `@search` - Search functionality tests
- `@negative` - Negative test scenarios

## 📝 Writing Tests

### 1. Create Feature Files

Create `.feature` files in the `features/` directory:

```gherkin
@smoke
Feature: User Login
    As a user
    I want to log into the application
    So that I can access my account

    Scenario: Successful login
        Given I am on the login page
        When I enter valid credentials
        And I click the login button
        Then I should be logged in successfully
```

### 2. Implement Step Definitions

Create corresponding step definitions in `e2e-testing/tests/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/support/world';
import { LoginPage } from '../../src/pages/login-page';

Given('I am on the login page', async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page, this.baseUrl);
    await loginPage.navigateTo('/login');
});
```

### 3. Create Page Objects

Extend the `BasePage` class for new pages in `e2e-testing/src/pages/`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    private readonly selectors = {
        usernameInput: '[data-testid="username"]',
        passwordInput: '[data-testid="password"]',
        loginButton: '[data-testid="login-button"]'
    };

    constructor(page: Page, baseUrl: string) {
        super(page, baseUrl);
    }

    async login(username: string, password: string): Promise<void> {
        await this.type(this.selectors.usernameInput, username);
        await this.type(this.selectors.passwordInput, password);
        await this.click(this.selectors.loginButton);
    }
}
```

## 📊 Reporting

The framework generates multiple types of reports in the `e2e-testing` directory:

- **Cucumber HTML Report**: `e2e-testing/test-results/reports/cucumber-report.html`
- **Cucumber JSON Report**: `e2e-testing/test-results/reports/cucumber-report.json`
- **Test Summary**: `e2e-testing/test-results/reports/test-summary.html`
- **Screenshots**: `e2e-testing/test-results/screenshots/`
- **Videos**: `e2e-testing/test-results/videos/` (if enabled)
- **Traces**: `e2e-testing/test-results/traces/` (Playwright traces for debugging)

## 🔧 Configuration

### Browser Configuration

Configure browsers in `e2e-testing/playwright.config.ts`:

```typescript
projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
]
```

### Cucumber Configuration

Configure Cucumber in `e2e-testing/cucumber.json`:

```javascript
{
    features: ['tests/features/**/*.feature'],
    require: ['tests/step-definitions/**/*.ts', 'src/support/**/*.ts'],
    format: ['progress-bar', 'json:test-results/reports/cucumber-report.json'],
    parallel: 2
}
```

## 🐛 Debugging

### Debug Mode

Run tests with debug tag (from the `e2e-testing` directory):
```bash
npm run test:debug
```

### Visual Debugging

Run in headed mode to see browser actions:
```bash
HEADLESS=false npm test
```

### Screenshots and Videos

Screenshots are automatically captured on test failures. Enable videos:
```bash
VIDEOS=true npm test
```

### Playwright Traces

Traces are automatically captured and can be viewed using Playwright's trace viewer:
```bash
npx playwright show-trace test-results/traces/trace.zip
```

## 📚 Resources

- [Cucumber Documentation](https://cucumber.io/docs)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
