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