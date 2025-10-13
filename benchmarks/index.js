const { registerRoutes } = require('../dist/index.js');
const express = require('express');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

console.log('🚀 Route Wizard 性能基准测试\n');

// 创建测试控制器目录结构
function createTestControllers(baseDir, depth = 3, breadth = 5) {
  if (depth === 0) return;

  for (let i = 0; i < breadth; i++) {
    const dirName = `category${i}`;
    const dirPath = path.join(baseDir, dirName);
    fs.mkdirSync(dirPath, { recursive: true });

    // 创建路由文件
    const methods = ['get', 'post', 'put', 'delete'];
    methods.forEach(method => {
      const filePath = path.join(dirPath, `${method}.js`);
      fs.writeFileSync(filePath, `module.exports = (req, res) => res.json({ method: '${method}', category: '${dirName}' });`);
    });

    // 创建动态路由
    const dynamicDir = path.join(dirPath, '[id]');
    fs.mkdirSync(dynamicDir, { recursive: true });
    fs.writeFileSync(path.join(dynamicDir, 'get.js'), `module.exports = (req, res) => res.json({ id: req.params.id });`);

    // 递归创建子目录
    createTestControllers(dirPath, depth - 1, breadth);
  }
}

// 清理和创建测试目录
const testDir = path.join(__dirname, 'test-controllers');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

console.log('📁 创建测试控制器结构...');
const startCreate = performance.now();
createTestControllers(testDir, 2, 3); // 2层深度，3个分支
const createTime = performance.now() - startCreate;
console.log(`✅ 创建完成，耗时: ${createTime.toFixed(2)}ms\n`);

// 基准测试函数
function benchmark(description, fn, iterations = 10) {
  console.log(`🏃 ${description}`);

  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`   平均: ${avg.toFixed(2)}ms`);
  console.log(`   最快: ${min.toFixed(2)}ms`);
  console.log(`   最慢: ${max.toFixed(2)}ms\n`);

  return { avg, min, max };
}

// 路由扫描基准测试
benchmark('路由扫描性能', () => {
  const app = express();
  registerRoutes(app, { dir: testDir, logEnabled: false });
});

// 内存使用情况
const memUsage = process.memoryUsage();
console.log('📊 内存使用情况:');
console.log(`   RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`   堆使用: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
console.log(`   堆总量: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB\n`);

// 统计信息
function countFiles(dir) {
  let count = 0;
  function walk(current) {
    const items = fs.readdirSync(current);
    for (const item of items) {
      const fullPath = path.join(current, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.js')) {
        count++;
      }
    }
  }
  walk(dir);
  return count;
}

const fileCount = countFiles(testDir);
console.log(`📈 统计信息:`);
console.log(`   路由文件数量: ${fileCount}`);
console.log(`   测试目录大小: ${testDir}`);

// 清理测试目录
fs.rmSync(testDir, { recursive: true, force: true });
console.log('\n✅ 基准测试完成！');