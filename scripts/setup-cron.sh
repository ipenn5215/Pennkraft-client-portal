#!/bin/bash

# Setup Cron Job for Automated Deployment
# Run this on the server to set up automatic deployments

echo "Setting up cron job for automated deployment..."

# The cron job to add
CRON_JOB="*/30 * * * * /bin/bash /home/inmoti87/deploy.sh > /home/inmoti87/logs/cron-deploy.log 2>&1"

# Add to crontab (runs every 30 minutes)
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added successfully!"
echo ""
echo "The deployment script will run every 30 minutes."
echo "To view current cron jobs, run: crontab -l"
echo ""
echo "To modify the schedule:"
echo "- Every hour: 0 * * * *"
echo "- Every 30 minutes: */30 * * * *"
echo "- Every 15 minutes: */15 * * * *"
echo "- Daily at 2 AM: 0 2 * * *"
echo ""
echo "To edit cron jobs: crontab -e"
echo "To remove all cron jobs: crontab -r"