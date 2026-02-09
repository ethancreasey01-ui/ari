#!/bin/bash
# Daily backup script for all GitHub repos
# Created: 2026-02-09

LOG_FILE="/Users/adbiptuy/clawd/.backup-log.txt"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "=== Backup Started: $DATE ===" >> $LOG_FILE

# Function to backup a repo
backup_repo() {
    local repo_path=$1
    local repo_name=$2
    
    echo "Backing up $repo_name..." >> $LOG_FILE
    
    cd "$repo_path" || return 1
    
    # Check if there are changes to commit
    if [[ -n $(git status --porcelain) ]]; then
        git add . >> $LOG_FILE 2>&1
        git commit -m "Daily backup: $DATE" >> $LOG_FILE 2>&1
        git push origin main >> $LOG_FILE 2>&1
        echo "✅ $repo_name: Changes backed up" >> $LOG_FILE
    else
        echo "⏭️  $repo_name: No changes" >> $LOG_FILE
    fi
}

# Backup main ari repo
backup_repo "/Users/adbiptuy/clawd" "ari"

# Backup project repos
backup_repo "/Users/adbiptuy/clawd/dsea-site" "dsea-site"
backup_repo "/Users/adbiptuy/clawd/plumber-site" "plumber-site"
backup_repo "/Users/adbiptuy/clawd/meal-planner" "meal-planner"
backup_repo "/Users/adbiptuy/clawd/skills/ticket-scraper" "ticket-scraper"
backup_repo "/Users/adbiptuy/clawd/call-ready-sites" "call-ready-sites"

echo "=== Backup Completed: $(date '+%Y-%m-%d %H:%M:%S') ===" >> $LOG_FILE
echo "" >> $LOG_FILE
