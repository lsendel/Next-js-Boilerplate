#!/bin/bash

################################################################################
# Database Backup Script
#
# Comprehensive backup solution supporting PostgreSQL, MySQL, and SQLite
# with compression, encryption, and cloud storage integration.
#
# Usage: ./scripts/backup-database.sh [options]
# Options:
#   --db-type     Database type (postgres|mysql|sqlite)
#   --output-dir  Backup output directory (default: ./backups)
#   --compress    Enable gzip compression (default: true)
#   --encrypt     Enable GPG encryption (default: false)
#   --upload      Upload to cloud storage (aws|gcp|azure)
#   --retention   Retention days (default: 30)
################################################################################

set -euo pipefail

# Default configuration
DB_TYPE="${DB_TYPE:-postgres}"
OUTPUT_DIR="${OUTPUT_DIR:-./backups}"
COMPRESS="${COMPRESS:-true}"
ENCRYPT="${ENCRYPT:-false}"
UPLOAD_TO="${UPLOAD_TO:-}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --db-type)
            DB_TYPE="$2"
            shift 2
            ;;
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --compress)
            COMPRESS="$2"
            shift 2
            ;;
        --encrypt)
            ENCRYPT="$2"
            shift 2
            ;;
        --upload)
            UPLOAD_TO="$2"
            shift 2
            ;;
        --retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create backup directory
mkdir -p "$OUTPUT_DIR"

# Backup filename
BACKUP_FILE="$OUTPUT_DIR/backup-$TIMESTAMP.sql"

log_info "Starting database backup..."
log_info "Database type: $DB_TYPE"
log_info "Output directory: $OUTPUT_DIR"

# Perform backup based on database type
case $DB_TYPE in
    postgres)
        if [[ -z "${DATABASE_URL:-}" ]]; then
            log_error "DATABASE_URL environment variable is not set"
            exit 1
        fi

        # Parse DATABASE_URL
        DB_HOST=$(echo $DATABASE_URL | sed -E 's/.*@([^:]+):.*/\1/')
        DB_PORT=$(echo $DATABASE_URL | sed -E 's/.*:([0-9]+)\/.*/\1/')
        DB_NAME=$(echo $DATABASE_URL | sed -E 's/.*\/([^?]+).*/\1/')
        DB_USER=$(echo $DATABASE_URL | sed -E 's/.*:\/\/([^:]+):.*/\1/')
        DB_PASS=$(echo $DATABASE_URL | sed -E 's/.*:\/\/[^:]+:([^@]+)@.*/\1/')

        log_info "Backing up PostgreSQL database: $DB_NAME"

        PGPASSWORD=$DB_PASS pg_dump \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            --clean \
            --if-exists \
            --no-owner \
            --no-acl \
            > "$BACKUP_FILE"

        if [[ $? -eq 0 ]]; then
            log_info "PostgreSQL backup completed successfully"
        else
            log_error "PostgreSQL backup failed"
            exit 1
        fi
        ;;

    mysql)
        if [[ -z "${DATABASE_URL:-}" ]]; then
            log_error "DATABASE_URL environment variable is not set"
            exit 1
        fi

        # Parse DATABASE_URL for MySQL
        DB_HOST=$(echo $DATABASE_URL | sed -E 's/.*@([^:]+):.*/\1/')
        DB_PORT=$(echo $DATABASE_URL | sed -E 's/.*:([0-9]+)\/.*/\1/')
        DB_NAME=$(echo $DATABASE_URL | sed -E 's/.*\/([^?]+).*/\1/')
        DB_USER=$(echo $DATABASE_URL | sed -E 's/.*:\/\/([^:]+):.*/\1/')
        DB_PASS=$(echo $DATABASE_URL | sed -E 's/.*:\/\/[^:]+:([^@]+)@.*/\1/')

        log_info "Backing up MySQL database: $DB_NAME"

        mysqldump \
            -h "$DB_HOST" \
            -P "$DB_PORT" \
            -u "$DB_USER" \
            -p"$DB_PASS" \
            --single-transaction \
            --routines \
            --triggers \
            "$DB_NAME" \
            > "$BACKUP_FILE"

        if [[ $? -eq 0 ]]; then
            log_info "MySQL backup completed successfully"
        else
            log_error "MySQL backup failed"
            exit 1
        fi
        ;;

    sqlite)
        SQLITE_PATH="${SQLITE_PATH:-./data/database.sqlite}"

        if [[ ! -f "$SQLITE_PATH" ]]; then
            log_error "SQLite database not found at: $SQLITE_PATH"
            exit 1
        fi

        log_info "Backing up SQLite database: $SQLITE_PATH"

        sqlite3 "$SQLITE_PATH" ".dump" > "$BACKUP_FILE"

        if [[ $? -eq 0 ]]; then
            log_info "SQLite backup completed successfully"
        else
            log_error "SQLite backup failed"
            exit 1
        fi
        ;;

    *)
        log_error "Unsupported database type: $DB_TYPE"
        exit 1
        ;;
esac

# Get backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log_info "Backup size: $BACKUP_SIZE"

# Compress backup
if [[ "$COMPRESS" == "true" ]]; then
    log_info "Compressing backup..."
    gzip -9 "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    COMPRESSED_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_info "Compressed size: $COMPRESSED_SIZE"
fi

# Encrypt backup
if [[ "$ENCRYPT" == "true" ]]; then
    if ! command -v gpg &> /dev/null; then
        log_warn "GPG not found, skipping encryption"
    else
        log_info "Encrypting backup..."

        if [[ -z "${GPG_PASSPHRASE:-}" ]]; then
            log_error "GPG_PASSPHRASE environment variable is not set"
            exit 1
        fi

        echo "$GPG_PASSPHRASE" | gpg \
            --batch \
            --yes \
            --passphrase-fd 0 \
            --symmetric \
            --cipher-algo AES256 \
            "$BACKUP_FILE"

        rm "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE}.gpg"
        log_info "Backup encrypted successfully"
    fi
fi

# Upload to cloud storage
if [[ -n "$UPLOAD_TO" ]]; then
    case $UPLOAD_TO in
        aws)
            if ! command -v aws &> /dev/null; then
                log_warn "AWS CLI not found, skipping upload"
            else
                S3_BUCKET="${S3_BUCKET:-}"
                if [[ -z "$S3_BUCKET" ]]; then
                    log_error "S3_BUCKET environment variable is not set"
                    exit 1
                fi

                log_info "Uploading to AWS S3: s3://$S3_BUCKET/backups/"
                aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/backups/$(basename $BACKUP_FILE)"

                if [[ $? -eq 0 ]]; then
                    log_info "Upload to S3 completed successfully"
                else
                    log_error "Upload to S3 failed"
                fi
            fi
            ;;

        gcp)
            if ! command -v gsutil &> /dev/null; then
                log_warn "gsutil not found, skipping upload"
            else
                GCS_BUCKET="${GCS_BUCKET:-}"
                if [[ -z "$GCS_BUCKET" ]]; then
                    log_error "GCS_BUCKET environment variable is not set"
                    exit 1
                fi

                log_info "Uploading to Google Cloud Storage: gs://$GCS_BUCKET/backups/"
                gsutil cp "$BACKUP_FILE" "gs://$GCS_BUCKET/backups/$(basename $BACKUP_FILE)"

                if [[ $? -eq 0 ]]; then
                    log_info "Upload to GCS completed successfully"
                else
                    log_error "Upload to GCS failed"
                fi
            fi
            ;;

        azure)
            if ! command -v az &> /dev/null; then
                log_warn "Azure CLI not found, skipping upload"
            else
                AZURE_STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-}"
                AZURE_CONTAINER="${AZURE_CONTAINER:-backups}"

                if [[ -z "$AZURE_STORAGE_ACCOUNT" ]]; then
                    log_error "AZURE_STORAGE_ACCOUNT environment variable is not set"
                    exit 1
                fi

                log_info "Uploading to Azure Blob Storage..."
                az storage blob upload \
                    --account-name "$AZURE_STORAGE_ACCOUNT" \
                    --container-name "$AZURE_CONTAINER" \
                    --name "backups/$(basename $BACKUP_FILE)" \
                    --file "$BACKUP_FILE"

                if [[ $? -eq 0 ]]; then
                    log_info "Upload to Azure completed successfully"
                else
                    log_error "Upload to Azure failed"
                fi
            fi
            ;;

        *)
            log_error "Unsupported cloud provider: $UPLOAD_TO"
            ;;
    esac
fi

# Clean old backups
log_info "Cleaning backups older than $RETENTION_DAYS days..."
find "$OUTPUT_DIR" -name "backup-*.sql*" -mtime +$RETENTION_DAYS -delete
CLEANED_COUNT=$(find "$OUTPUT_DIR" -name "backup-*.sql*" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
log_info "Cleaned $CLEANED_COUNT old backup(s)"

# Summary
log_info "Backup completed successfully!"
log_info "Backup file: $BACKUP_FILE"
log_info "Backup location: $OUTPUT_DIR"

# Return success
exit 0
