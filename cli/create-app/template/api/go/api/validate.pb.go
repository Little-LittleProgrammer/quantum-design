// Code generated by protoc-gen-gin-http-leo. DO NOT EDIT.
// versions:
// - protoc-gen-gin-http-leo v0.0.5
// - protoc             v3.21.7
// source: message.proto

package rum

// 处理校验，因为gin 的中间件不在 _http.pb.go 中处理，只能在 _http.pb.go 直接写validate
type validator interface {
	Validate() error
}
