# Client-round demo notes

## 3–5 minute walkthrough

1. Open `http://localhost:5173`. Explain that the List page requests `GET /api/users` on mount and renders loading, empty, error, and populated states.
2. Click **Add user**. Submit an empty form to show inline validation. Enter a valid record, e.g. `Priya Sharma`, age `28`, city `Hyderabad`, state `Telangana`, pincode `500001`.
3. Save. Explain that the form sends a `POST /api/users` request, then navigates back to List and displays a success notification.
4. Refresh the page and show the user remains because the API persists it in SQLite.
5. Open `http://localhost:5080/swagger`. Demonstrate GET/POST/PUT/DELETE and explain the response codes. Use a disposable record for delete.
6. If asked about failures, stop the API briefly and refresh List to show a friendly connection error; restart the API afterward.

## Architecture explanation

React page → Axios API service → ASP.NET Core controller → EF Core `AppDbContext` → SQLite file. The UI performs fast client-side validation for user experience. The API independently validates requests because clients cannot be trusted. `AsNoTracking()` is used for read-only list/detail queries. Dependency injection supplies the database context to the controller. `CreatedAtAction` returns `201 Created` with a location for the newly created resource.

## Common client questions

- **Why validate on both sides?** Client validation gives immediate feedback; server validation protects the API when requests bypass the UI.
- **Why SQLite?** It is file-based, lightweight, needs no separate database server, and satisfies local persistence requirements.
- **Why `AsNoTracking()`?** Read-only queries do not need EF Core change tracking, reducing overhead.
- **Why `201`, `404`, and `204`?** They communicate resource creation, missing resources, and successful deletion without a response body.
- **What would you improve for production?** Add OAuth2/OIDC JWT validation and authorization, migrations, structured logging, integration/unit tests, pagination, rate limiting, HTTPS, secret/configuration management, and CI/CD.
- **How did AI help?** It helped scaffold and review the project. Be transparent about that, and explain code you submit rather than claiming it was written entirely without assistance.

## Important limitation

The requested UI only includes Add and List pages. The API implements all CRUD operations, but edit/update is exposed through Swagger/API rather than a separate frontend edit page. Authentication and automated tests are intentionally omitted to keep this version focused on core acceptance criteria.
