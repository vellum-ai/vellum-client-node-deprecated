################################
# Generating Typescript Client
################################

generate-client:
	openapi-generator generate -i $(VELLUM_PREDICT_SCHEMA_PATH) -g typescript-node -o . \
		--additional-properties=npmName=vellum-client-node,npmVersion=0.1.5
