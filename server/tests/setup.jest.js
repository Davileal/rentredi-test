jest.mock("../src/config/firebase", () => {
  return {
    initFirebase: jest.fn(() => {}),
    db: jest.fn(() => {
      throw new Error(
        "db() should not be called in tests; mock repository instead."
      );
    }),
  };
});

const origError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    origError.apply(console, args);
  };
});
afterAll(() => {
  console.error = origError;
});
