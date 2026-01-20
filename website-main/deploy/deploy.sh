#!/bin/bash

# 설정
export GENERATE_SOURCEMAP=false
export NODE_ENV=production
PROFILE="--profile=union"
BUCKET="union-tf.com"
DISTRIBUTION_ID="E13RUF7U9ZEBP6"

# 공통 함수
aws_cmd() {
  echo "▶️ $*"
  aws "$@" $PROFILE
}

# React 앱 빌드
echo "📦 React 앱 빌드 중..."
npm run build

# S3 버킷 전체 삭제
echo "🧹 S3 버킷 기존 파일 삭제 중..."
aws_cmd s3 rm s3://$BUCKET --recursive

# 빌드 결과물 업로드
echo "⬆️  S3 버킷에 업로드 중..."
aws_cmd s3 cp ./dist s3://$BUCKET --recursive

# CloudFront 캐시 무효화
echo "🚀 CloudFront 캐시 무효화 요청 중..."
aws_cmd cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths '/*'

echo "✅ 배포 완료!"
