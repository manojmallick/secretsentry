# SecretSentry

SecretSentry is a local-first VS Code extension prototype that scans text for common credential patterns and can write `.agentignore` rules for sensitive files. Scanning runs locally; the project does not send file contents to a service.

## Development

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

Package a VS Code extension archive with `pnpm package`.

## Scope and limitations

The scanner uses a small set of regular expressions and path checks. It can miss credentials and can report false positives. It is a convenience layer, not a substitute for secret management, access controls, or a dedicated security review. Do not use sample credentials from tests as real credentials.

The code is under `src/`; `src/logic/` contains the standalone scanner and ignore-file template.

## License

Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). This source-available license restricts commercial use; it is not an OSI-approved open-source license. See the license for terms and exceptions. Third-party dependencies retain their own licenses.
