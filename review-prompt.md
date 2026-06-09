# TASK

Review the code changes for issue {{TASK_ID}}: {{ISSUE_TITLE}} and improve code clarity, consistency, and maintainability while preserving exact functionality.

# CONTEXT

## Commits related to this issue

!`git log --oneline | grep " Task {{TASK_ID}}:"`

# REVIEW PROCESS

1. **Understand the change**: Read commits above and check their diffs and make sure to understand the intent.

2. **Analyze for improvements**: Look for opportunities to:
   - Reduce unnecessary complexity and nesting
   - Eliminate redundant code and abstractions
   - Improve readability through clear variable and function names
   - Consolidate related logic
   - Remove unnecessary comments that describe obvious code
   - Avoid nested ternary operators - prefer switch statements or if/else chains
   - Choose clarity over brevity - explicit code is often better than overly compact code

3. **Check correctness**:
   - Does the implementation match the intent? Are edge cases handled?
   - Are new/changed behaviours covered by tests?
   - Are there unsafe casts, `any` types, or unchecked assumptions?
   - Does the change introduce injection vulnerabilities, credential leaks, or other security issues?

4. **Maintain balance**: Avoid over-simplification that could:
   - Reduce code clarity or maintainability
   - Create overly clever solutions that are hard to understand
   - Combine too many concerns into single functions or components
   - Remove helpful abstractions that improve code organization
   - Make the code harder to debug or extend

5. **Preserve functionality**: Never change what the code does - only how it does it. All original features, outputs, and behaviors must remain intact.

# EXECUTION

If you find improvements to make:

1. Make the changes directly
2. Run tests and type checking to ensure nothing is broken
3. Commit describing the refinements. Prefix the commit message with `Task NN:` where NN is the Task ID.

If the code is already clean and well-structured, close the issue.

# CLOSE ISSUES

When the review is done, close its issue by updating the status to `closed` in {{ISSUE_PATH}}
Commit the update to the status separately with the commit message: `Closing task NN` where NN is the Task ID.

Finally, output <promise>COMPLETE</promise>.
