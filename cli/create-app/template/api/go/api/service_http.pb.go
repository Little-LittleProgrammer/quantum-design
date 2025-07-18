// Code generated by protoc-gen-gin-http-leo. DO NOT EDIT.
// versions:
// - protoc-gen-gin-http-leo v0.0.5
// - protoc             v3.21.7
// source: service.proto

package rum

import (
	bytes "bytes"
	log "codeup.aliyun.com/qimao/leo/leo/log"
	code_encoding "codeup.aliyun.com/qimao/leo/lib/code-encoding"
	form "codeup.aliyun.com/qimao/leo/lib/code-encoding/form"
	json "codeup.aliyun.com/qimao/leo/lib/code-encoding/json"
	errassets "codeup.aliyun.com/qimao/leo/lib/errassets"
	render "codeup.aliyun.com/qimao/leo/lib/render"
	context "context"
	errors "errors"
	gin "github.com/gin-gonic/gin"
	protojson "google.golang.org/protobuf/encoding/protojson"
	io "io"
	http "net/http"
)

// 引入指定包
var _ = new(gin.Context)
var _ = new(bytes.Buffer)
var _ = code_encoding.Version
var _ = http.StatusOK
var _ = errassets.LevelToast
var _ = log.LevelDebugName
var _ = io.EOF
var _ = form.Name
var _ = json.Name
var _ = new(context.Context)
var _ = errors.New("")
var _ = new(protojson.MarshalOptions)

// 单纯引入 render 包，后续render 包加个常量
// var _, _  = render.render.JSON(0,0)

const OperationRumReport = "/rum.Rum/Report"

type RumHTTPServerController interface {
	Report(*gin.Context, *ReportRequest) (*ReportReply, error)
}

func RegisterRumHTTPServerController(router *gin.RouterGroup, srv RumHTTPServerController) {
	router.POST("/v1/rum/report", _Rum_Report0_HTTP_Handler(srv))
}

func _Rum_Report0_HTTP_Handler(srv RumHTTPServerController) gin.HandlerFunc {
	return func(c *gin.Context) {
		var in ReportRequest
		if c.ContentType() == "application/x-www-form-urlencoded" {
			if err := c.ShouldBind(&in); err != nil {
				c.Negotiate(render.AbortWithError(c, errassets.NewError(44010102, "请求参数错误")))
				return
			}
		} else {
			data, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.Negotiate(render.AbortWithError(c, errassets.NewError(44010102, "请求参数错误")))
				return
			}
			if len(data) != 0 {
				codec, _ := code_encoding.CodecForRequest(c.Request, "Content-Type")
				if err = codec.Unmarshal(data, &in); err != nil {
					c.Negotiate(render.AbortWithError(c, errassets.NewError(44010102, "请求参数错误")))
					return
				}
			}
		}
		var j interface{} = &in
		if v, ok := j.(validator); ok {
			if err := v.Validate(); err != nil {
				c.Negotiate(render.AbortWithError(c, errassets.NewError(44010102, err.Error())))
				return
			}
		}
		out, err := srv.Report(c, &in)
		if err != nil {
			// 兼容来的err code 方式
			if _, ok := err.(errassets.ErrorNo); ok {
				c.Negotiate(render.AbortWithError(c, err.(errassets.ErrorNo)))
				return
			}
			// 处理 context canceled
			if errors.Is(err, context.Canceled) {
				log.Warnf("/rum.Rum/Report err: %+v", err)
			} else {
				log.Errorf("/rum.Rum/Report err: %+v", err)
			}
			c.Negotiate(render.AbortWithError(c, errassets.NewError(47010101, "系统繁忙，请稍后再试")))
			return
		}
		b, err := protojson.MarshalOptions{
			UseProtoNames:   true,
			EmitUnpopulated: true,
		}.Marshal(out)
		if err != nil {
			c.Negotiate(render.AbortWithError(c, errassets.NewError(47010101, "系统繁忙，请稍后再试")))
			return
		}
		c.Writer.Header().Set("Content-Type", "application/json; charset=utf-8")
		_, err = c.Writer.Write(b)
		if err != nil {
			c.Negotiate(render.AbortWithError(c, errassets.NewError(47010101, "系统繁忙，请稍后再试")))
			return
		}
		return
	}
}
