API_PROTO_FILES=$(shell find protos -name "*.proto")
GO_OUT=./rum-go/api
protoc:
	protoc-go;
	protoc-ts;

protoc-go:
	# 生成go
	protoc --proto_path=./protos \
	       --proto_path=./third_party \
 	       --go_out=paths=source_relative:${GO_OUT} \
		   --gin-http-leo_out=paths=source_relative:${GO_OUT} \
	        $(API_PROTO_FILES)
	cd go; go mod tidy

protoc-ts:
	 $(MAKE) -C ts API_PROTO_FILES="$(API_PROTO_FILES)"

npm-beta-publish:
	 $(MAKE) -C ts npm-beta-publish API_PROTO_FILES="$(API_PROTO_FILES)"

npm-publish:
	 $(MAKE) -C ts npm-publish API_PROTO_FILES="$(API_PROTO_FILES)"
