#!/bin/bash
# DevPulse Cloud Run Deployment Script
# Run this from the project root directory (devpulse/)

set -e

# Configuration - UPDATE THESE VALUES
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-your-project-id}"
SERVICE_NAME="devpulse"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 DevPulse Cloud Run Deployment"
echo "================================"
echo "Project: ${PROJECT_ID}"
echo "Service: ${SERVICE_NAME}"
echo "Region: ${REGION}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the devpulse/ root directory"
    exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not found. Install from https://cloud.google.com/sdk"
    exit 1
fi

# Authenticate and set project
echo "📋 Setting Google Cloud project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# Build and push container using Cloud Build
echo "🏗️ Building container with Cloud Build..."
gcloud builds submit \
    --config=deploy/cloudrun/cloudbuild.yaml \
    --substitutions=_SERVICE_NAME=${SERVICE_NAME},_REGION=${REGION} \
    .

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your service URL:"
gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)'
echo ""
echo "📝 Next steps:"
echo "   1. Configure your custom domain: gcloud beta run domain-mappings create --service=${SERVICE_NAME} --domain=YOUR_DOMAIN --region=${REGION}"
echo "   2. Update DNS records in GoDaddy as shown in Cloud Console"
