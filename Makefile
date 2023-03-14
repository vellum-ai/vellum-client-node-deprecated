################################
# Generating Typescript Client
################################

generate-client:
	openapi-generator generate -i $(VELLUM_PREDICT_SCHEMA_PATH) -g typescript-node -o . \
		--additional-properties=npmName=vellum-client-node,npmVersion=0.0.0 \
        && echo "Update the generated client to use the correct domain. typescript-node generator doesn't support this yet." \
		&& sed -i '' 's/predict.vellum.ai/documents.vellum.ai/g' api/uploadDocumentApi.ts

