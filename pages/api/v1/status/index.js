import database from "infra/database";

export default async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;

  const [maxConnectionsResult, openedConnectionsResult, versionResult] =
    await Promise.all([
      database.query("SHOW max_connections;"),
      database.query({
        text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
        values: [databaseName],
      }),
      database.query("SHOW server_version;"),
    ]);

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: Number(maxConnectionsResult.rows[0].max_connections),
        opened_connections: openedConnectionsResult.rows[0].count,
        version: versionResult.rows[0].server_version,
      },
    },
  });
}
