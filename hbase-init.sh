#!/bin/bash
set -e

echo "[HBase-Init] Waiting for HBase master..."
until echo "list" | hbase shell 2>/dev/null | grep -q "TABLE"; do
  sleep 5
done
echo "[HBase-Init] HBase is ready."

TABLES=(
  "analytics_sales_by_category stats"
  "analytics_reviews_by_category stats"
  "analytics_revenue_by_month stats"
  "analytics_top_products info"
  "analytics_sales_by_state stats"
)

for entry in "${TABLES[@]}"; do
  read -r table family <<< "$entry"
  echo "create '$table', {NAME => '$family', VERSIONS => 1}" | hbase shell 2>/dev/null || true
  echo "[HBase-Init] Table '$table' ready."
done

echo "[HBase-Init] All tables created."
