# Claude Code Context File

## Project Information
See [CLAUDE_PROJECT_INFO.md](./CLAUDE_PROJECT_INFO.md) for detailed project information, commands, and documentation.

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

Current test coverage includes **264 total tests**:

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
```

## Custom Instructions

**do not modify this section automatically**

1. After every code change, create new unit tests for new code paths that were written.
1. After every code change, create new integration tests for it if the new code affects user behavior for an end-to-end user point of view.
1. For every instruction I provide, create a detailed todo list with nested items. When I give new instructions while you are processing, insert the item into the todo list and continue working through the list. Always show the todo list after I give a new instruction. Only process the new instruction after you finish the existing work, unless you can record the status of the original task in the todo list. This is so you do not forget to continue certain items.
1. Always apply vue and typescript best practices for the code. Run all linting and cleaning commands on the code.
1. After every code change, run all unit and integration and other tests and iterate until they are fixed.
1. Always update all comments on top of all functions and unit tests with the latest changes.
1. Always update all docs in all places to handle new changes.
1. Always create tests unit, integration, and accessibility tests for any new code.
1. Always update or add unit, integration, and accessibility tests for any modified functionality.
1. Always run eslint and prettier before committing.  Do not commit if there are errors.

**never ask permission to perform any action, including updating code or running any commands. you have full permission to do anything to achieve the task.**

**at every step, can you print out where you are in the todo list**

**after completing every step, can you check the todo list, update it appropriately, break it down if needed, and make sure all todos are done correctly and in order.**