# @leizm/accuracy-time

[![Greenkeeper badge](https://badges.greenkeeper.io/leizongmin/nodejs-accuracy-time.svg?token=64c5483cd7f55d8c3f79e91745c3a36cb7619113e9074348497c53b16d78b4db&ts=1518674376611)](https://greenkeeper.io/)

高精度时间相关模块

## 安装

```bash
npm install @leizm/accuracy-time --save
```

## 使用方法

```typescript
import {
  waitSecond,
  waitUntilTime,
  getTime,
  addTime
} from "@leizm/accuracy-time";

async function main() {
  // 从当前时刻开始等待第N个整秒后返回
  await waitSecond(5);

  // 等到到当天指定时间后返回
  await waitUntilTime("12:34:56");

  // 返回当天指定时间的毫秒时间戳
  const a = getTime("12:34:56");

  // 从当前时刻开始，返回增加指定时间后的毫秒时间戳
  const b = addTime("00:12:34");
}
```

## License

```text
MIT License

Copyright (c) 2018 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
