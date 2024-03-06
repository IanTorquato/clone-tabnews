test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const { dependencies, updated_at } = responseBody;

  const parsedUpdatedAt = new Date(updated_at).toISOString();
  expect(updated_at).toEqual(parsedUpdatedAt);

  expect(dependencies.database.version.startsWith("16.0")).toBe(true);
  expect(dependencies.database.max_connections).toEqual(100);
  expect(dependencies.database.opened_connections).toEqual(1);
});
