#!/bin/bash
set -e
echo "🚀 Deploying to AWS..."

# Create S3 bucket
aws s3 mb s3://auditiq-documents

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket auditiq-documents \
  --policy file://s3-bucket-policy.json

# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name auditiq-infrastructure \
  --template-body file://cloudformation-template.yaml \
  --parameters ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD

echo "✅ AWS deployment complete!"
