# Bug Report: Cannot Create Multi-line Prompts in CLI

## Description

The Claude Code CLI does not support creating multi-line prompts interactively. Users cannot press Enter/Return to create a new line within their prompt, which significantly limits the ability to provide complex, formatted instructions.

## Environment

- **Platform**: macOS (Darwin 24.6.0)
- **Claude Code Version**: [Please add version - run `claude --version`]

## Current Behavior

When typing a prompt in the Claude Code CLI, pressing Enter/Return immediately submits the prompt instead of creating a new line. This makes it impossible to:

- Format complex instructions across multiple lines
- Paste multi-line code or text
- Create structured prompts with proper formatting
- Provide context that requires paragraph breaks

## Expected Behavior

Users should be able to:

1. Press Enter/Return to create new lines within a prompt
2. Use a specific key combination (e.g., Shift+Enter or Ctrl+Enter) to submit the prompt
3. Or have a clear delimiter/command to indicate prompt completion

## Workarounds Currently Required

Users must resort to less intuitive methods:

- Using `\n` escape sequences in quoted strings
- Piping input from files: `cat prompt.txt | claude`
- Using heredoc syntax (if supported)
- Using echo with escape sequences: `echo -e "line1\nline2" | claude`

## Impact

This limitation reduces the usability of the CLI for:

- Complex debugging scenarios
- Code review requests
- Multi-step instructions
- Any use case requiring formatted input

## Suggested Solution

Implement one of the following:

1. **Multi-line input mode**: Enter key creates new lines, special key combo (Shift+Enter, Ctrl+D, etc.) submits
2. **Visual indicator**: Show when in multi-line mode with a continuation prompt (e.g., `> ` for first line, `... ` for continuation)
3. **Command flag**: Add a flag like `--multiline` to enable multi-line input mode
4. **Editor integration**: Provide a `--editor` flag that opens the default text editor for composing prompts

## Additional Context

This is a common pattern in other CLI tools:

- Python REPL uses continuation prompts (`>>>` and `...`)
- PostgreSQL CLI (psql) continues until semicolon
- Many modern CLIs use Ctrl+D or specific delimiters for multi-line input

---

**To submit this bug report:**
Visit https://github.com/anthropics/claude-code/issues and create a new issue with the above content.
