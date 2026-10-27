# IDICorp Service Console

A responsive web application built with React, TypeScript, and Vite to interact with IDICorp backend services through REST APIs, WebSocket connections, and HTTP streaming.

## Project Overview

IDICorp Service Console brings together several backend communication workflows in a single web interface. The project focuses on modular feature development, type-safe application logic, asynchronous communication, connection lifecycle management, and a responsive user experience.

The application includes task management, a WebSocket-powered calculator, a Text Echo client, and a Streaming Echo interface.

## Features

### 1. Task Management

A task management interface for working with task data through backend APIs.

The feature is organized into dedicated API, hook, type, and UI modules. It includes components for:

- Displaying task lists
- Creating tasks
- Editing tasks
- Confirming task deletion
- Supporting task-related interactions

### 2. WebSocket Calculator

An interactive calculator that communicates with the backend through a persistent WebSocket connection.

**Endpoint:** `wss://ts.idicorp.ir/ws/calculator`

The implementation includes:

- WebSocket connection lifecycle management
- Token-based connection authentication
- Connection status handling
- Arithmetic operations
- Input validation
- Calculation request and response handling
- Error handling for invalid requests and unexpected server messages
- Calculator utilities for digit entry, decimal input, sign toggling, and deletion

The Calculator WebSocket protocol requires the access token to be sent as the first client message after the connection opens. The application waits for the server's `ready` message before allowing calculations.

### 3. Text Echo

A WebSocket-based interface for sending text messages and receiving echoed responses.

**Endpoint:** `wss://ts.idicorp.ir/ws/echo`

The intended workflow is:

1. Establish a WebSocket connection.
2. Wait for the server's `ready` message.
3. Send a text message.
4. Receive the echoed response.
5. Continue exchanging multiple messages over the same connection.

The feature has its own WebSocket hook, types, and component styling.

### 4. Streaming Echo

An interface for testing the backend's HTTP streaming endpoint.

**Endpoint:** `POST /api/echo/stream`

The backend returns the request body as the response body, preserving the transmitted bytes.

The feature separates its communication logic into a dedicated service module, keeping the transport implementation separate from the UI.

### 5. Application Navigation and Layout

The application uses React Router for page navigation and shared layout components for consistent page structure.

The page-level components compose the feature-specific UI, while the sidebar layout provides a shared navigation structure.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI development |
| TypeScript | Type safety and explicit data contracts |
| Vite | Development server and production build tooling |
| React Router | Client-side routing |
| Axios | HTTP client configuration and requests |
| TanStack Query | Server-state and asynchronous data management |
| WebSocket API | Persistent, bidirectional communication |
| Fetch Streams API | Reading HTTP response streams |
| CSS Modules | Component-scoped styling |

## Architecture

The project follows a feature-oriented structure that groups related functionality together while separating UI rendering, communication logic, and shared configuration.

### Architecture Layers

**Pages and UI components**

Page-level components represent application screens and compose feature components. Feature components handle user interactions and present application state.

**Feature logic**

Each major feature has its own directory containing the relevant components, hooks, utilities, types, and styles. This keeps feature-specific implementation details together.

**API and communication layer**

Shared API configuration is maintained under `src/api/`. HTTP requests use Axios where appropriate, while WebSocket-based features manage persistent connections through dedicated hooks. Streaming Echo has a separate service module.

**Shared infrastructure**

Routing, layouts, shared types, and query-client configuration are kept separate from individual features.

### Project Structure

```text
src/
├── App.tsx
├── App.css
├── index.css
├── main.tsx
│
├── api/
│   ├── auth.ts
│   ├── axios.ts
│   ├── client.ts
│   ├── config.ts
│   └── queryClient.ts
│
├── assets/
│
├── auth/
│   ├── AuthContext.tsx
│   └── PublicRoute.tsx
│
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.module.css
│
├── features/
│   ├── calculator/
│   │   ├── Calculator.tsx
│   │   ├── Calculator.module.css
│   │   ├── calculatorUtils.ts
│   │   ├── const.ts
│   │   ├── types.ts
│   │   └── useCalculatorSocket.ts
│   │
│   ├── echo/
│   │   ├── EchoStream.tsx
│   │   ├── EchoStream.module.css
│   │   ├── echoStreamService.ts
│   │   ├── TextEcho.tsx
│   │   ├── TextEcho.module.css
│   │   ├── types.ts
│   │   └── useEchoSocket.ts
│   │
│   └── tasks/
│       ├── api.ts
│       ├── hooks.ts
│       ├── types.ts
│       ├── TaskList.tsx
│       ├── TaskList.module.css
│       ├── CreateTaskForm.tsx
│       ├── CreateTaskForm.module.css
│       ├── EditTaskModal.tsx
│       ├── EditTaskModal.module.css
│       ├── ConfirmDeleteModal.tsx
│       └── ConfirmDeleteModal.module.css
│
├── layouts/
│   ├── SidebarLayout.tsx
│   └── SidebarLayout.module.css
│
├── pages/
│   ├── CalculatorPage.tsx
│   ├── CalculatorPage.module.css
│   ├── DashboardPage.tsx
│   ├── DashboardPage.module.css
│   ├── EchoPage.tsx
│   ├── LoginPage.tsx
│   ├── TasksPage.tsx
│   └── TasksPage.module.css
│
├── router/
│   ├── index.tsx
│   └── ProtectedRoute.tsx
│
```

## Backend Integration

The backend base URL is:

```text
https://ts.idicorp.ir
```

The application separates HTTP and WebSocket communication because each requires a different connection and response-handling strategy.

### HTTP

Axios provides shared HTTP configuration and request handling. The API modules organize backend operations by responsibility.

TanStack Query is available for managing server state, including query lifecycle and asynchronous updates where used.

### WebSocket Authentication

The Calculator WebSocket uses the access token stored in `sessionStorage`. The token is sent as the first message after the socket opens.

Example:

```json
{
  "token": "<access_token>"
}
```

After successful authentication, the server sends:

```json
{
  "type": "ready"
}
```

The application does not implement a standalone authentication system as part of the core feature set described here; the token is used for the Calculator connection protocol.

## Error Handling and Connection Management

The application includes explicit handling for asynchronous operations and communication failures.

The Calculator manages connection states such as connecting, authenticating, ready, disconnected, and error. It also validates calculation inputs and prevents overlapping calculation requests.

The Echo features separate communication logic from presentation components, making connection behavior easier to maintain and troubleshoot.

WebSocket connections should be cleaned up when their owning components are unmounted, and user-facing errors should provide useful feedback without exposing sensitive information.

## Responsive Design and Accessibility

The UI uses CSS Modules for scoped component styling and includes semantic HTML and accessible status or error announcements where implemented.

The application is designed to support responsive layouts and clear feedback for connection and operation states.

## Getting Started

### Prerequisites

- Node.js
- npm
- Access to the IDICorp backend services

### Installation

```bash
npm install
```

### Environment Variables

Configure the WebSocket endpoints in the root `.env` file if the application uses these environment variables:

```env
VITE_CALCULATOR_WS_URL=wss://ts.idicorp.ir/ws/calculator
VITE_ECHO_WS_URL=wss://ts.idicorp.ir/ws/echo
```

Restart the Vite development server after changing environment variables.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

Available scripts depend on the project's `package.json`.

## Design Decisions

- **Feature-oriented organization:** Keeps related UI, types, and communication logic together.
- **TypeScript:** Makes feature contracts and application state more explicit.
- **Custom hooks:** Encapsulate WebSocket lifecycle and asynchronous interaction logic.
- **Axios:** Centralizes HTTP client configuration.
- **TanStack Query:** Supports structured server-state management where needed.
- **CSS Modules:** Reduces unintended style conflicts between components.
- **Separate transport implementations:** Uses HTTP for API requests and streaming, and WebSockets for persistent bidirectional messaging.

## Conclusion

IDICorp Service Console demonstrates the integration of REST APIs, WebSocket-based communication, and HTTP streaming within a modular React and TypeScript application.

The project emphasizes separation of concerns, reusable feature logic, type safety, explicit connection states, and maintainable frontend architecture.
