# src/logic

This is the only directory meant to hold app-specific business logic. `src/extension.ts`
just wires VS Code commands to functions defined here — add more commands in
`package.json`'s `contributes.commands` (+ matching `activationEvents`) and register them
in `extension.ts`.
