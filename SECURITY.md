# Security

## 数据与网络边界

- Token 账本保存在本机 DSH Home 的 `storages/cost-meter/ledger.json`。
- 插件不上传 Token 明细、会话标题或历史记录，也不包含遥测。
- DeepSeek API Key 通过 Harness 凭据服务解析，不写入本插件源码、配置或日志。
- 公开版只主动访问 `https://api.deepseek.com` 的官方余额接口。
- 上游兼容代码中的第三方 Coding Plan、自定义余额和远程价格同步入口已在运行时关闭，且不在界面挂载。

## 报告安全问题

请通过仓库的 GitHub Issues 报告，并避免在公开 Issue 中粘贴 API Key、访问令牌、完整凭据文件或私人会话内容：

https://github.com/Hades03/dsh-model-quota-usage/issues
