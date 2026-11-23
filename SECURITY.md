# Security Policy

## Security Model & Privacy Architecture

AeroPulse AI is built with a local-first, privacy-by-design architecture:
- **Local Credential Storage**: Google Gemini API keys are encoded and kept in local browser storage; credentials are never transmitted to third-party tracking servers.
- **XSS Mitigation**: All dynamic Markdown and HTML outputs rendered from AI responses are processed through DOMPurify with strict HTML tag whitelisting.
- **Safe Network Integration**: Open-Meteo telemetry requests use verified HTTPS endpoints with response schema validation.
- **Zero Telemetry Collection**: No personal medical records, search locations, or IP logs are collected or persisted externally.

## Reporting a Vulnerability

If you discover any security issue, please open an issue in this repository or contact the project maintainer. Vulnerabilities will be addressed and resolved promptly.
