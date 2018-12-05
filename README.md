# zapp-editor

## Deploy to Production

```
cd ./build/web && \
  aws s3 rm s3://$ZAPP_EDITOR_BUCKET --recursive && \
  aws s3 sync . s3://$ZAPP_EDITOR_BUCKET --acl public-read ; \
  aws cloudfront create-invalidation --distribution-id $ZAPP_EDITOR_DISTRIBUTION --paths /\* && \
  cd ../.. && \
cd ./build/electron && \
  aws s3 rm s3://$ZAPP_EDITOR_DESKTOP_BUCKET --recursive && \
  aws s3 sync . s3://$ZAPP_EDITOR_DESKTOP_BUCKET --acl public-read ; \
  aws cloudfront create-invalidation --distribution-id $ZAPP_EDITOR_DESKTOP_DISTRIBUTION --paths /\* && \
  cd ../..
```
