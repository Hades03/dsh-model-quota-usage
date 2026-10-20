# Changelog

## 1.1.1

- 适配 dsh 0.2.x：Typert strict codec 由 `{ schema }` 改为 `create()` 工厂。0.2 的 Typert 注册表要求 `codec.create` 是函数，缺了会直接抛 `typert: ... strict codec has no create() factory`；宿主侧 10 处、浏览器侧 17 处编解码器同步调整。
- 兼容性下限提升为 dsh `>=0.2.0-rc.1`；0.1.x 用户请继续使用 1.1.0。

## 1.1.0

- 添加 DeepSeek 余额、今日总 Token 与 Provider/模型明细悬浮面板。
- 支持展开、收起、筛选和手动刷新。
- 支持拖动、位置持久化和双击恢复右下角。
- 改用最近屏幕边缘锚定，修复右下角展开后再收起发生位置漂移的问题。
- 公开运行边界收紧为 DeepSeek 官方余额接口和本地 Token 账本。
- 补齐 GitHub/npm 发布元数据、自动检查和回归测试。

## 1.0.0

- 首个内部版本。
