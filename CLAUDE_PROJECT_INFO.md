# Project Information

## Development Server

To start the development server:

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:3000/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:run` - Run tests once and exit
- `npm run lint` - Run ESLint and fix issues
- `npm run lint:check` - Run ESLint without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking

## Testing

The project includes comprehensive unit and integration tests using Vitest and Vue Test Utils.

### Test Types

**Unit Tests** (`src/components/**/__tests__/`)

- Component-specific functionality testing
- Isolated component behavior verification
- Props, events, and rendering validation

**Integration Tests** (`src/test/integration/`)

- End-to-end user workflows
- Component interaction testing
- Cross-component functionality validation

### Test Coverage

Current test coverage includes **560+ total tests**:

**Unit Tests (39 tests)**

- `SearchBar.test.ts` - 12 tests covering input handling, events, file upload, styling
- `ResultCard.test.ts` - 13 tests covering data rendering, stats display, layout verification
- `Logo.test.ts` - 14 tests covering SVG rendering, accent bar positioning, component structure

**Integration Tests (46 tests)**

- `SearchWorkflow.test.ts` - 9 tests covering complete search flow from landing to results
- `FileUploadWorkflow.test.ts` - 10 tests covering file upload functionality across pages
- `SearchResultsDisplay.test.ts` - 14 tests covering results layout and data integrity
- `HeaderNavigation.test.ts` - 13 tests covering header and sidebar navigation integration

**Utility/Service Tests (179 tests)**

- `format.test.ts` - 44 tests covering number formatting, text manipulation, file sizes, currency, dates
- `search.test.ts` - 41 tests covering query validation, result filtering, sorting, grouping
- `validation.test.ts` - 56 tests covering email/URL validation, file uploads, user profiles
- `useTheme.test.ts` - 28 tests covering theme initialization, DOM manipulation, reactivity
- `types.test.ts` - 6 tests covering TypeScript interface validation
- `router.test.ts` - 4 tests covering router configuration and navigation

**Store Tests (75+ tests)**

- `search.test.ts` - 25 tests covering search functionality, pagination, history management, and error handling
- `ui.test.ts` - 25 tests covering theme, notifications, sidebar, view modes, and loading states
- `filters.test.ts` - 25 tests covering filter management, validation, application, and state tracking

**CSS/Style Tests (107 tests)**

- `css-utilities.test.ts` - 30 tests covering custom Tailwind class application and validation
- `css-theme-variables.test.ts` - 19 tests covering CSS custom properties and theme configuration
- `css-component-patterns.test.ts` - 27 tests covering component pattern classes and accessibility
- `css-responsive-design.test.ts` - 31 tests covering responsive breakpoints and mobile-first design

**Accessibility Tests (130+ tests)**

_Component-Specific Accessibility Tests:_

- `Button.accessibility.test.ts` - 24 tests covering button keyboard navigation, ARIA attributes, and color contrast
- `SearchBar.accessibility.test.ts` - 28 tests covering form accessibility, keyboard navigation, and screen reader support
- `ResultCard.accessibility.test.ts` - 25 tests covering semantic structure, data presentation, and responsive accessibility

_Global Accessibility Pattern Tests:_

- `theme-contrast-validation.test.ts` - 11 tests covering comprehensive WCAG compliance across entire theme system
- `keyboard-navigation-patterns.test.ts` - 15 tests covering cross-component keyboard navigation and focus management patterns

_Legacy Global Tests (being phased out):_

- `keyboard-navigation.test.ts` - 34 tests (migrating to component-specific + pattern tests)
- `screen-reader-compatibility.test.ts` - 31 tests (migrating to component-specific tests)
- `focus-management.test.ts` - 25 tests (migrating to component-specific + pattern tests)
- `color-contrast-validation.test.ts` - 25 tests (replaced by theme-contrast-validation.test.ts)

### Utility Modules

The project includes comprehensive utility modules located in `src/utils/`:

**Format Utilities** (`format.ts`)

- Number formatting with locale support (formatNumber, formatCurrency)
- Text manipulation (capitalize, toKebabCase, toCamelCase, truncateText)
- File size formatting (formatFileSize)
- Date/time utilities (formatDuration, formatRelativeTime)
- Name and contact formatting (formatName, formatPhoneNumber, formatEmailForDisplay)

**Search Utilities** (`search.ts`)

- Query validation and normalization
- URL encoding/decoding for search queries
- Result filtering, sorting, and grouping
- Filter management and result summarization
- Search result validation and sanitization

**Validation Utilities** (`validation.ts`)

- Input validation (email, URL, phone number)
- File upload validation (type and size checking)
- Form validation with detailed error reporting
- Security utilities (input sanitization)
- Complex validation workflows for user profiles and search filters

### State Management with Pinia

The project uses Pinia for centralized state management with a modular store architecture located in `src/stores/`:

**Search Store** (`search.ts`)

- Query management (current query, search history)
- Search results state (results array, pagination, loading states)
- Search actions (performSearch, loadMoreResults, addToHistory)
- Error handling and result clearing
- History management with 50-item limit and recent searches

**UI Store** (`ui.ts`)

- Theme management (light/dark mode toggle)
- Sidebar state (open/closed)
- Notification system with auto-removal timers
- View mode management (grid/list views)
- Global loading states
- Helper methods for different notification types (success, error, warning, info)

**Filters Store** (`filters.ts`)

- Age range filtering with validation
- Location and company multi-selection
- Minimum rating filtering
- Sorting configuration (field and order)
- Active filter tracking and counting
- Filter application and result filtering
- Filter summary generation and reset functionality

**Store Testing** (`src/stores/__tests__/`)

- `search.test.ts` - 20+ tests covering search functionality, pagination, history management, and error handling
- `ui.test.ts` - 25+ tests covering theme, notifications, sidebar, view modes, and loading states
- `filters.test.ts` - 30+ tests covering filter management, validation, application, and state tracking

**Pinia Configuration**

- Configured in `src/main.ts` with `createPinia()`
- Uses Composition API approach with `defineStore`
- TypeScript integration with proper type definitions
- Reactive state with computed getters and async actions

### CSS Testing Framework

The project includes comprehensive CSS testing located in `src/test/utils/css-*.test.ts`:

**CSS Utility Class Testing** (`css-utilities.test.ts`)

- Validates custom Tailwind class application and CSS class string handling
- Tests brand color classes, background utilities, text color utilities, and border utilities
- Verifies responsive class combinations and complex utility interactions
- Ensures proper class inheritance and composition across Vue components

**CSS Theme Variables Testing** (`css-theme-variables.test.ts`)

- Validates CSS custom properties (CSS variables) configuration and values
- Tests theme variable hierarchy, naming conventions, and color accessibility
- Verifies CSS variable inheritance, fallback behavior, and integration with utilities
- Ensures all brand colors, text colors, background colors, and border colors are properly defined

**CSS Component Patterns Testing** (`css-component-patterns.test.ts`)

- Tests component pattern classes like `.btn-primary`, `.result-card`, `.flex-center`
- Validates button patterns, icon button patterns, layout patterns, and statistics patterns
- Ensures accessibility features are maintained with pattern classes
- Tests dynamic pattern class changes and performance considerations

**CSS Responsive Design Testing** (`css-responsive-design.test.ts`)

- Validates mobile-first responsive design with Tailwind breakpoints
- Tests responsive width, height, text, spacing, layout, and display classes
- Verifies responsive custom utilities (spacing, border radius, shadows, fonts)
- Ensures responsive accessibility and proper class ordering/specificity

### Accessibility Testing Framework

The project includes a comprehensive accessibility testing framework with **component-specific tests** and **shared utilities**:

#### Component-Specific Accessibility Tests

Each critical component has dedicated accessibility tests located in `src/components/*/.__tests__/*.accessibility.test.ts`:

**Button Component Accessibility** (`Button.accessibility.test.ts`)

- ARIA attributes and semantic button behavior validation
- Keyboard navigation (Tab, Enter, Space) and focus management
- Color contrast testing for all button variants (primary, outline, ghost)
- Screen reader compatibility and state announcements
- Integration testing in form contexts and with various props

**SearchBar Component Accessibility** (`SearchBar.accessibility.test.ts`)

- Form accessibility with proper textarea and button labeling
- Complex keyboard navigation through multiple interactive elements
- File upload accessibility with proper input constraints
- Dynamic content accessibility (auto-resizing textarea)
- Screen reader support for multi-functional search interface

**ResultCard Component Accessibility** (`ResultCard.accessibility.test.ts`)

- Semantic HTML structure with proper heading hierarchy
- Data presentation accessibility for statistics and personal information
- Color contrast validation for data visualization elements
- Responsive accessibility across different screen sizes
- Screen reader optimization for complex data layouts

#### Global Accessibility Pattern Tests

Cross-component accessibility patterns in `src/test/accessibility/global/`:

**Theme Color Contrast Validation** (`theme-contrast-validation.test.ts`)

- Comprehensive WCAG AA/AAA compliance testing across entire color system
- Brand color accessibility analysis and limitation documentation
- Text color hierarchy validation and contrast ratios
- Component pattern color validation (buttons, status indicators)
- Border and UI element contrast validation

**Keyboard Navigation Patterns** (`keyboard-navigation-patterns.test.ts`)

- Cross-component Tab navigation and focus order testing
- Arrow key navigation patterns (grids, menus, toolbars)
- Focus trapping patterns for modals and overlays
- Skip navigation and landmark navigation testing
- Roving tabindex and disclosure widget patterns

#### Shared Accessibility Utilities

Reusable testing utilities in `src/test/accessibility/`:

**Utilities** (`utils/`)

- `contrast-calculator.ts` - WCAG color contrast ratio calculations
- `focus-tracker.ts` - Focus change tracking and management
- `keyboard-simulator.ts` - Keyboard event simulation for testing

**Shared Helpers** (`shared/`)

- `accessibility-test-helpers.ts` - Common accessibility testing functions
- `accessibility-matchers.ts` - Custom Vitest matchers for accessibility assertions

### Accessibility Issues and Considerations

**Known Accessibility Limitations:**

- Brand orange (#ff6f16) and brand blue (#4285f4) colors do not meet WCAG AA contrast standards when used as text colors on white backgrounds
- Current contrast ratios: Orange/White = 3.26:1, Blue/White = 3.13:1 (both below the required 4.5:1)
- These colors are documented as acceptable for brand elements but should not be used for body text

**Accessibility Best Practices Implemented:**

- Comprehensive keyboard navigation support across all interactive elements
- Proper ARIA labeling and semantic HTML structure
- Focus management with restoration and trapping patterns
- Skip navigation links for keyboard users
- High contrast mode compatibility testing
- Screen reader compatibility validation

### Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI interface
npm run test:ui

# Run only integration tests
npm run test:run src/test/integration/

# Run only unit tests
npm run test:run src/components/

# Run only utility/service tests
npm run test:run src/test/utils/

# Run only store tests
npm run test:run src/stores/__tests__/

# Run only CSS/style tests
npm run test:run src/test/utils/css-*.test.ts

# Run all accessibility tests (component-specific + global patterns)
npm run test:run src/test/accessibility/ src/components/**/*.accessibility.test.ts

# Run component-specific accessibility tests
npm run test:run src/components/**/*.accessibility.test.ts

# Run global accessibility pattern tests
npm run test:run src/test/accessibility/global/

# Run specific component accessibility tests
npm run test:run src/components/ui/__tests__/Button.accessibility.test.ts
npm run test:run src/components/common/__tests__/SearchBar.accessibility.test.ts
npm run test:run src/components/search/__tests__/ResultCard.accessibility.test.ts

# Run specific global pattern tests
npm run test:run src/test/accessibility/global/theme-contrast-validation.test.ts
npm run test:run src/test/accessibility/global/keyboard-navigation-patterns.test.ts

# Run legacy accessibility tests (being phased out)
npm run test:run src/test/accessibility/keyboard-navigation.test.ts
npm run test:run src/test/accessibility/screen-reader-compatibility.test.ts
npm run test:run src/test/accessibility/focus-management.test.ts
npm run test:run src/test/accessibility/color-contrast-validation.test.ts
```
