// Mock Adapter — frontend/src/api/mockAdapter.ts
// Routes API calls to mock implementations when VITE_USE_MOCK_API=true.
// Switch to real backend by setting VITE_USE_MOCK_API=false.

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Simulate network latency for realistic mock UX */
export function mockDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
