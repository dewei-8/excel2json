#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { translate: translateVitalets } = require('@vitalets/google-translate-api');
const { translate: translateX } = require('google-translate-api-x');

/**
 * 翻译中文文本为英文
 * @param {string} text - 要翻译的中文文本
 * @param {string} engine - 翻译引擎 ('vitalets', 'google-x')
 * @returns {Promise<string>} 翻译后的英文文本
 */
async function translateToEnglish(text, engine = 'vitalets') {
    try {
        // 检查是否包含中文字符
        if (!/[\u4e00-\u9fff]/.test(text)) {
            return text; // 如果不包含中文，直接返回原文本
        }
        
        let result;
        
        switch (engine) {
            case 'vitalets':
                result = await translateVitalets(text, { from: 'zh', to: 'en' });
                break;
            case 'google-x':
                result = await translateX(text, { from: 'zh', to: 'en', forceFrom: true });
                break;
            default:
                throw new Error(`不支持的翻译引擎: ${engine}`);
        }
        
        // 将空格替换为下划线，并转换为小写
        return result.text.replace(/\s+/g, '_').toLowerCase();
    } catch (error) {
        console.warn(`翻译失败 "${text}" (引擎: ${engine}): ${error.message}`);
        return text; // 翻译失败时返回原文本
    }
}

/**
 * 将Excel文件转换为JSON格式
 * @param {string} excelFilePath - Excel文件路径
 * @param {string} outputPath - 输出JSON文件路径（可选）
 * @param {boolean} translateHeaders - 是否翻译中文表头为英文
 * @param {string} translateEngine - 翻译引擎 ('vitalets', 'google-x')
 * @returns {Promise<Array>} 转换后的JSON数组
 */
async function excelToJson(excelFilePath, outputPath = null, translateHeaders = false, translateEngine = 'vitalets') {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(excelFilePath)) {
            throw new Error(`文件不存在: ${excelFilePath}`);
        }

        console.log(`正在读取Excel文件: ${excelFilePath}`);
        
        // 读取Excel文件
        const workbook = XLSX.readFile(excelFilePath);
        
        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        console.log(`正在处理工作表: ${sheetName}`);
        
        // 将工作表转换为JSON数组
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // 使用数字索引作为键
            defval: '', // 空单元格的默认值
            raw: false // 不保留原始值，进行格式化
        });
        
        if (jsonData.length === 0) {
            throw new Error('Excel文件为空或没有数据');
        }
        
        // 第一行作为键（表头）
        let headers = jsonData[0];
        console.log(`检测到列标题: ${headers.join(', ')}`);
        
        // 如果需要翻译表头
        if (translateHeaders) {
            console.log(`正在使用 ${translateEngine} 引擎翻译中文表头为英文...`);
            const translatedHeaders = [];
            for (const header of headers) {
                const translatedHeader = await translateToEnglish(header, translateEngine);
                translatedHeaders.push(translatedHeader);
            }
            headers = translatedHeaders;
            console.log(`翻译后的列标题: ${headers.join(', ')}`);
        }
        
        // 其他行作为值
        const result = [];
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowObject = {};
            
            // 将每行数据与对应的列标题组合成对象
            for (let j = 0; j < headers.length; j++) {
                const header = headers[j];
                const value = row[j] || ''; // 如果单元格为空，使用空字符串
                rowObject[header] = value;
            }
            
            // 只有当行不为空时才添加到结果中
            if (Object.values(rowObject).some(val => val !== '')) {
                result.push(rowObject);
            }
        }
        
        console.log(`成功转换 ${result.length} 行数据`);
        
        // 保存到文件
        const jsonString = JSON.stringify(result, null, 2);
        fs.writeFileSync(outputPath, jsonString, 'utf8');
        console.log(`JSON文件已保存到: ${outputPath}`);
        
        return result;
        
    } catch (error) {
        console.error('转换过程中发生错误:', error.message);
        throw error;
    }
}

/**
 * 主函数 - 处理命令行参数
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法:');
        console.log('  node excel-to-json.js <Excel文件路径> [输出JSON文件路径] [--translate] [--engine=引擎名]');
        console.log('');
        console.log('示例:');
        console.log('  node excel-to-json.js data.xlsx');
        console.log('  node excel-to-json.js data.xlsx output.json');
        console.log('  node excel-to-json.js data.xlsx output.json --translate');
        console.log('  node excel-to-json.js data.xlsx output.json --translate --engine=vitalets');
        console.log('  node excel-to-json.js data.xlsx output.json --translate --engine=google-x');
        console.log('');
        console.log('支持的翻译引擎:');
        console.log('  vitalets  - @vitalets/google-translate-api (默认)');
        console.log('  google-x  - google-translate-api-x 包');
        console.log('');
        console.log('当前目录中的Excel文件:');
        
        // 列出当前目录中的Excel文件
        const files = fs.readdirSync('.');
        const excelFiles = files.filter(file => 
            file.toLowerCase().endsWith('.xlsx') || 
            file.toLowerCase().endsWith('.xls')
        );
        
        if (excelFiles.length > 0) {
            excelFiles.forEach(file => console.log(`  - ${file}`));
        } else {
            console.log('  未找到Excel文件');
        }
        
        return;
    }
    
    const excelFilePath = args[0];
    const translateHeaders = args.includes('--translate');
    
    // 解析翻译引擎参数
    let translateEngine = 'vitalets'; // 默认引擎
    const engineArg = args.find(arg => arg.startsWith('--engine='));
    if (engineArg) {
        translateEngine = engineArg.split('=')[1];
    }
    
    // 过滤掉翻译相关参数，获取输出路径
    const filteredArgs = args.filter(arg => 
        arg !== '--translate' && !arg.startsWith('--engine=')
    );
    const outputPath = filteredArgs[1] || path.join(path.dirname(excelFilePath), path.basename(excelFilePath, path.extname(excelFilePath)) + '.json');
    
    try {
        const result = await excelToJson(excelFilePath, outputPath, translateHeaders, translateEngine);
        console.log(`转换完成！共处理 ${result.length} 行数据`);
        
    } catch (error) {
        console.error('程序执行失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = { excelToJson };
