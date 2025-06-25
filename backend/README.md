# NASA APOD 后端服务

### 新 API 接口

- 路径：`POST /api/apod/poetic-copy`
- 请求体：

```json
{
  "explanation": "（APOD图片的explanation字段内容）"
}
```

- 返回：

```json
{
  "poeticCopy": "生成的诗意中文文案"
}
```
