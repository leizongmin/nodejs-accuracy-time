/**
 * @leizm/accuracy-time
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import * as assert from "assert";
import * as createDebug from "debug";

const debug = createDebug("@leizm:accuracy-time");

let msCompensation: number = -1;

/**
 * 设置误差补偿值，默认为-1
 * @param ms
 */
export function setCompensation(ms: number): number {
  return (msCompensation = ms);
}

/**
 * 获取当前误差补偿值
 */
export function getCompensation(): number {
  return msCompensation;
}

/**
 * 解析时间字符串，如果格式不正确会抛出异常
 * @param time 时间，格式：HH:mm:ss
 */
export function parseTimeString(time: string): [number, number, number] {
  const [h, m, s] = time.split(":").map(v => Number(v));
  assert(h >= 0, `${time} 格式有误，小时部分必须大于或等于0`);
  assert(m >= 0, `${time} 格式有误，分钟部分必须大于或等于0`);
  assert(s >= 0, `${time} 格式有误，秒钟部分必须大于或等于0`);
  return [h, m, s];
}

/**
 * 等待到下N秒整数
 * 调用 waitSecond(1) 用于校正到整秒
 * @param seconds 要等待的秒数，默认1秒
 * @param startTimestamp 开始计算的时间戳，默认为当前时间戳
 */
export function waitSecond(
  seconds: number = 1,
  startTimestamp: number = Date.now()
): Promise<number> {
  return new Promise((resolve, reject) => {
    debug("waitSecond: seconds=%s startTimestamp=%s", seconds, startTimestamp);
    const ts = Math.floor(startTimestamp / 1000 + seconds) * 1000;
    const tid = setInterval(() => {
      const nt = Date.now();
      if (nt + msCompensation >= ts) {
        clearInterval(tid);
        const d = nt - startTimestamp;
        resolve(d);
        debug(
          "waitSecond callback: seconds=%s startTimestamp=%s nt=%s d=%s",
          seconds,
          startTimestamp,
          nt,
          d
        );
      }
    }, 0);
  });
}

/**
 * 等待直到当天指定时间
 * @param time 时间，格式：HH:mm:ss
 * @param startTimestamp 开始计算的时间戳，默认为当前时间戳
 */
export function waitUntilTime(
  time: string,
  startTimestamp: number = Date.now()
): Promise<number> {
  debug("waitUntilTime: time=%s startTimestamp=%s", time, startTimestamp);
  return waitSecond(0, getTime(time, startTimestamp)).then(_ => {
    const d = Date.now() - startTimestamp;
    debug(
      "waitUntilTime callback: time=%s startTimestamp=%s d=%s",
      time,
      startTimestamp,
      d
    );
    return d;
  });
}

/**
 * 返回当天指定时间的时间戳
 * @param time 时间，格式：HH:mm:ss
 * @param startTimestamp 开始计算的时间戳，默认为当前时间戳
 */
export function getTime(
  time: string,
  startTimestamp: number = Date.now()
): number {
  parseTimeString(time);
  const date = new Date(startTimestamp).toLocaleDateString();
  return new Date(`${date} ${time}`).getTime();
}

/**
 * 在当前时间加上指定时间值
 * @param time 时间，格式：HH:mm:ss
 * @param startTimestamp 开始计算的时间戳，默认为当前时间戳
 */
export function addTime(
  time: string,
  startTimestamp: number = Date.now()
): number {
  const [h, m, s] = parseTimeString(time);
  return startTimestamp + h * 3600000 + m * 60000 + s * 1000;
}
