#!/bin/bash
set -euo pipefail

# Migration wrapper with observability
# Usage: ENVIRONMENT=staging ./scripts/db/migrate-with-telemetry.sh

ENVIRONMENT=${ENVIRONMENT:-development}
MIGRATION_ID=$(date +%s)
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Log migration start
echo "🔄 Migration started: environment=$ENVIRONMENT id=$MIGRATION_ID timestamp=$START_TIME"

# Optionally send to observability stack (Grafana Loki)
send_telemetry() {
  local level=$1
  local message=$2

  if [ -n "${GRAFANA_LOKI_URL:-}" ]; then
    curl -X POST "$GRAFANA_LOKI_URL/loki/api/v1/push" \
      -H "Content-Type: application/json" \
      -d "{
        \"streams\": [{
          \"stream\": {
            \"environment\": \"$ENVIRONMENT\",
            \"service\": \"database-migrations\",
            \"level\": \"$level\",
            \"migration_id\": \"$MIGRATION_ID\"
          },
          \"values\": [[\"$(date +%s)000000000\", \"$message\"]]
        }]
      }" 2>/dev/null || echo "Warning: Failed to send telemetry to Loki"
  fi
}

# Send start event
send_telemetry "info" "Migration started: $MIGRATION_ID in $ENVIRONMENT"

# Run migration
if npm run db:migrate; then
  END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  DURATION=$(($(date +%s) - MIGRATION_ID))

  echo "✅ Migration completed: start=$START_TIME end=$END_TIME duration=${DURATION}s"

  # Log success
  send_telemetry "info" "Migration completed successfully: $MIGRATION_ID (${DURATION}s)"

  exit 0
else
  END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  DURATION=$(($(date +%s) - MIGRATION_ID))

  echo "❌ Migration failed: start=$START_TIME end=$END_TIME duration=${DURATION}s"

  # Log failure
  send_telemetry "error" "Migration failed: $MIGRATION_ID (${DURATION}s)"

  # Optionally send alert to PagerDuty/OpsGenie
  if [ -n "${PAGERDUTY_INTEGRATION_KEY:-}" ] && [ "$ENVIRONMENT" = "production" ]; then
    curl -X POST "https://events.pagerduty.com/v2/enqueue" \
      -H "Content-Type: application/json" \
      -d "{
        \"routing_key\": \"$PAGERDUTY_INTEGRATION_KEY\",
        \"event_action\": \"trigger\",
        \"payload\": {
          \"summary\": \"Database migration failed in $ENVIRONMENT\",
          \"severity\": \"error\",
          \"source\": \"database-migrations\",
          \"custom_details\": {
            \"migration_id\": \"$MIGRATION_ID\",
            \"environment\": \"$ENVIRONMENT\",
            \"duration\": \"${DURATION}s\"
          }
        }
      }" 2>/dev/null || echo "Warning: Failed to send alert to PagerDuty"
  fi

  exit 1
fi
