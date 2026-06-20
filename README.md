# Ads Campaign Dashboard

Ads Campaign Console is a React + TypeScript dashboard prototype built to explore data-heavy UI patterns commonly used in advertising, analytics, and internal operations tools. The project simulates an ads campaign management interface where users can view campaign performance, filter and sort campaign data, paginate results, inspect campaign details, and edit campaign settings through a validated form.

The purpose of this project was to deepen my experience with TypeScript in a React application while practicing more production-oriented frontend architecture concepts. It uses React Query to manage server-style data fetching, loading, error, caching, and mutation flows; React Hook Form and Zod for form state and validation; and a fake async API layer to simulate backend filtering, sorting, pagination, and campaign updates.

This project is intentionally focused on the kinds of UI engineering concerns that show up in real dashboard applications: separating server state from UI and form state, treating backend-confirmed data as the source of truth, handling asynchronous request states, validating user edits before save, and keeping table controls like sorting and pagination clear and predictable.
