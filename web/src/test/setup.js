import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers, resetData } from "./handlers";

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  server.resetHandlers();
  resetData();
});

afterAll(() => server.close());
