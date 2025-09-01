/**
 * Excel to JSON Converter - Usage Examples
 * 
 * This file demonstrates various ways to use the excel2json
 * both as a library and as a command-line tool.
 */

const { excelToJson } = require('./excel-to-json.js');

console.log('🚀 Excel to JSON Converter - Examples\n');

// Example 1: Basic conversion
console.log('📋 Example 1: Basic Excel to JSON conversion');
try {
    // Note: Replace 'sample.xlsx' with your actual Excel file
    console.log('// const data = excelToJson("sample.xlsx");');
    console.log('// console.log(data);\n');
} catch (error) {
    console.log('❌ Error:', error.message, '\n');
}

// Example 2: Convert and save to file
console.log('💾 Example 2: Convert and save to JSON file');
try {
    console.log('// const data = excelToJson("input.xlsx", "output.json");');
    console.log('// console.log(`Saved ${data.length} records to output.json`);\n');
} catch (error) {
    console.log('❌ Error:', error.message, '\n');
}

// Example 3: Data processing and validation
console.log('🔍 Example 3: Data processing and validation');
const exampleData = [
    { Name: 'John', Age: 25, City: 'NYC' },
    { Name: 'Jane', Age: 30, City: 'LA' },
    { Name: '', Age: 35, City: 'Chicago' } // Empty name example
];

console.log('// Process and validate data:');
console.log('const validRecords = data.filter(record => record.Name && record.Age);');
console.log('console.log(`Valid records: ${validRecords.length}/${data.length}`);\n');

// Example 4: Error handling
console.log('🛡️ Example 4: Proper error handling');
console.log('try {');
console.log('    const data = excelToJson("nonexistent.xlsx");');
console.log('    console.log("Success:", data.length, "records");');
console.log('} catch (error) {');
console.log('    console.error("Error:", error.message);');
console.log('}\n');

// Example 5: Command line usage
console.log('💻 Example 5: Command line usage');
console.log('# Install globally:');
console.log('npm install -g excel2json\n');
console.log('# Use as CLI tool:');
console.log('excel-to-json data.xlsx');
console.log('excel-to-json data.xlsx output.json\n');

console.log('✨ For more examples, check the README.md file!');
