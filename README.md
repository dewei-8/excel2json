# Excel 转 JSON 转换器

[![npm version](https://badge.fury.io/js/excel2json.svg)](https://badge.fury.io/js/excel2json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个强大的 Node.js 命令行工具和库，用于将 Excel 文件（.xlsx/.xls）转换为 JSON 格式。非常适合数据处理、API 开发和数据迁移任务。

## ✨ 功能特性

- 🔄 **智能转换**: 使用第一行作为 JSON 对象的键（表头）
- 📊 **多格式支持**: 支持 .xlsx 和 .xls 文件
- 🌐 **中文翻译**: 自动将中文表头翻译为英文
- 🔧 **多翻译引擎**: 可选择不同的翻译服务
- 🚀 **CLI 和库**: 可作为命令行工具使用或作为库导入
- 🛡️ **错误处理**: 全面的错误处理和验证
- 📝 **灵活输出**: 控制台显示或文件输出
- 🧹 **自动清理**: 自动过滤空行并处理空单元格
- ⚡ **快速处理**: 针对大型 Excel 文件优化

## 📦 安装

### 快速开始（无需安装）
```bash
# 直接运行，无需安装（推荐）
npx excel2json <path-to-excel-file>
```

### 全局安装（CLI 工具）
```bash
npm install -g excel2json
```

### 本地安装（库）
```bash
npm install excel2json
```

## 🚀 使用方法

### 命令行界面

#### 基本用法
```bash
# Convert Excel file and save as JSON (auto-generated filename)
node excel-to-json.js <path-to-excel-file>

# Convert Excel file and save as specific JSON file
node excel-to-json.js <path-to-excel-file> <output-json-file>

# Convert with Chinese header translation
node excel-to-json.js <path-to-excel-file> --translate

# Convert with specific translation engine
node excel-to-json.js <path-to-excel-file> --translate --engine=vitalets
node excel-to-json.js <path-to-excel-file> --translate --engine=google-x
```

#### 示例
```bash
# 基本转换
node excel-to-json.js data.xlsx
node excel-to-json.js data.xlsx output.json

# 带中文翻译
node excel-to-json.js "高德POI分类与编码.xlsx" --translate
node excel-to-json.js "高德POI分类与编码.xlsx" output.json --translate --engine=google-x

# 显示帮助
node excel-to-json.js
```

### 作为库使用

```javascript
const { excelToJson } = require('./excel-to-json.js');

// Convert Excel to JSON array
const jsonData = await excelToJson('data.xlsx');

// Convert and save to file
const jsonData = await excelToJson('data.xlsx', 'output.json');

// Convert with Chinese header translation
const jsonData = await excelToJson('data.xlsx', 'output.json', true, 'vitalets');

console.log(jsonData);
```

### ES6 导入
```javascript
import { excelToJson } from './excel-to-json.js';

const data = await excelToJson('spreadsheet.xlsx', null, true, 'google-x');
```

## 📋 输出格式

转换器将您的 Excel 数据转换为干净的 JSON 数组：

### 不翻译
**输入 Excel:**
| 姓名 | 年龄 | 城市 |
|------|-----|------|
| 张三 | 25  | 北京  |
| 李四 | 30  | 上海   |

**输出 JSON:**
```json
[
  {
    "姓名": "张三",
    "年龄": 25,
    "城市": "北京"
  },
  {
    "姓名": "李四", 
    "年龄": 30,
    "城市": "上海"
  }
]
```

### 带翻译 (`--translate`)
**输出 JSON:**
```json
[
  {
    "name": "张三",
    "age": 25,
    "city": "北京"
  },
  {
    "name": "李四", 
    "age": 30,
    "city": "上海"
  }
]
```

## ⚙️ 配置

### 选项

- **第一行作为表头**: 自动使用第一行作为 JSON 对象的键
- **空单元格处理**: 空单元格转换为空字符串
- **空行过滤**: 自动移除完全空白的行
- **工作表选择**: 默认处理第一个工作表
- **中文翻译**: 使用 `--translate` 标志将中文表头翻译为英文
- **翻译引擎**: 在 `vitalets`（默认）和 `google-x` 之间选择

### 翻译引擎

| 引擎 | 包 | 描述 |
|--------|---------|-------------|
| `vitalets` | @vitalets/google-translate-api | 默认引擎，可靠且快速 |
| `google-x` | google-translate-api-x | 替代的 Google 翻译 API |

## 🔧 API 参考

### `excelToJson(excelFilePath, outputPath?, translateHeaders?, translateEngine?)`

**参数:**
- `excelFilePath` (string): Excel 文件路径
- `outputPath` (string, 可选): 输出 JSON 文件路径
- `translateHeaders` (boolean, 可选): 是否将中文表头翻译为英文（默认: false）
- `translateEngine` (string, 可选): 使用的翻译引擎 - 'vitalets' 或 'google-x'（默认: 'vitalets'）

**返回值:**
- `Promise<Array>`: 解析为表示 Excel 数据的对象数组的 Promise

**抛出异常:**
- `Error`: 如果文件不存在或无效

## 📝 示例

### 处理大型数据集
```javascript
const { excelToJson } = require('./excel-to-json.js');

try {
  const data = await excelToJson('large-dataset.xlsx', 'processed-data.json');
  console.log(`Processed ${data.length} records successfully`);
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

### 中文数据翻译
```javascript
const { excelToJson } = require('./excel-to-json.js');

try {
  // Translate Chinese headers to English
  const data = await excelToJson('chinese-data.xlsx', 'output.json', true, 'vitalets');
  console.log(`Processed ${data.length} records with translated headers`);
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

### 数据验证
```javascript
const { excelToJson } = require('./excel-to-json.js');

const data = await excelToJson('user-data.xlsx');

// Validate required fields
const validRecords = data.filter(record => 
  record.Name && record.Email && record.Age
);

console.log(`Valid records: ${validRecords.length}/${data.length}`);
```

## 🛠️ 开发

### 前置要求
- Node.js >= 12.0.0
- npm 或 yarn

### 设置
```bash
git clone https://github.com/yourusername/aoiTypeFormat.git
cd aoiTypeFormat
npm install
```

### 依赖
```bash
npm install xlsx @vitalets/google-translate-api google-translate-api-x
```

### 测试
```bash
npm test
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📞 支持

- 🐛 **错误报告**: [GitHub Issues](https://github.com/yourusername/excel2json/issues)
- 💡 **功能请求**: [GitHub Discussions](https://github.com/yourusername/excel2json/discussions)
- 📧 **邮箱**: your.email@example.com

## 🙏 致谢

- 使用 [SheetJS](https://sheetjs.com/) 进行 Excel 文件处理
- 翻译功能由 [@vitalets/google-translate-api](https://github.com/vitalets/google-translate-api) 和 [google-translate-api-x](https://github.com/AidanSwanson/google-translate-api-x) 提供支持
- 受到对简单 Excel 转 JSON 转换工具（支持中文）需求的启发

---

**为开发者社区用 ❤️ 制作**
