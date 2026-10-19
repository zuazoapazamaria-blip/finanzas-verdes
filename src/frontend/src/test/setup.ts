import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Generated components expose stable hooks as `data-ocid`, not `data-testid`.
configure({ testIdAttribute: "data-ocid" });

// jsdom has no ResizeObserver, which recharts' ResponsiveContainer requires.
// A no-op stub lets the chart mount; it does not measure, so chart geometry is
// not asserted here.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

afterEach(() => {
  cleanup();
});
