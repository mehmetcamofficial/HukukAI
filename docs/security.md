# HukukAI Security Notes

Legal data is confidential. Production implementation must enforce authentication before every protected route, resolve the active organization server-side, and scope every case, document, client, research, memory, and audit query to that organization and user role.

Roles are designed as `OWNER`, `LAWYER`, `PARALEGAL`, and `READ_ONLY`. Only authorized lawyers can approve a generated document as final. File bytes belong in secure object storage; PostgreSQL stores metadata and an object path, not document contents.

Uploads must validate MIME type, extension, size, malware scanning status, and processing state. AI endpoints need rate limiting, provider timeouts, redaction policy, and audit events. The service worker intentionally caches only safe static assets and never legal files, case data, tokens, or AI responses.

The current preview is a fictional demo and is not a security boundary. Integrate managed authentication and object storage before storing real client data.