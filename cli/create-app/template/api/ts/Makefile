PROTO_FILES := $(addprefix ../, $(API_PROTO_FILES))
default: npm-install generate npm-build 

npm-install:
	npm i

npm-build:
	npm run build

generate:
	# 只生成ts的message
	npx protoc --proto_path=../protos \
	       --proto_path=../third_party \
		   --ts_out=. \
		   --ts_opt={NEED_REPLACE} \
	    	$(PROTO_FILES)
	node ./bin/index.js

npm-beta-publish: npm-build generate
	npm version prerelease --preid beta;npm run build; npm publish

npm-publish: npm-build generate
	npm version patch; npm run build; npm publish