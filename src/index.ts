/**
 * @leizm/accuracy-time
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import * as assert from "assert";
import * as createDebug from "debug";

const debug = createDebug("@leizm:accuracy-time");

/** 误差补偿值，默认-1 */
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
  assert(h >= 0 && h < 24, `${time} 格式有误，小时部分必须大于或等于0`);
  assert(m >= 0 && m < 60, `${time} 格式有误，分钟部分必须大于或等于0`);
  assert(s >= 0 && s < 60, `${time} 格式有误，秒钟部分必须大于或等于0`);
  return [h, m, s];
}

/**
 * 时间相减 t1 - t2
 * @param t1
 * @param t2
 */
export function subtractTimeString(
  t1: string,
  t2: string
): [number, number, number] {
  const [h1, m1, s1] = parseTimeString(t1);
  const [h2, m2, s2] = parseTimeString(t2);
  let [h, m, s] = [h1 - h2, m1 - m2, s1 - s2];
  if (s < 0) {
    m--;
    s += 60;
  }
  if (m < 0) {
    h--;
    m += 60;
  }
  return [h, m, s];
}

/**
 * 时间相加 t1 + t2
 * @param t1
 * @param t2
 */
export function addTimeString(
  t1: string,
  t2: string
): [number, number, number] {
  const [h1, m1, s1] = parseTimeString(t1);
  const [h2, m2, s2] = parseTimeString(t2);
  let [h, m, s] = [h1 + h2, m1 + m2, s1 + s2];
  if (s > 60) {
    m++;
    s -= 60;
  }
  if (m > 60) {
    h++;
    m -= 60;
  }
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

export type IntervalHandler = (n: number) => void;
export type StopInterval = () => void;

/**
 * 设置每隔N整秒回调一次
 * @param seconds
 * @param handler
 */
export function setIntervalInSecond(
  seconds: number,
  handler: IntervalHandler
): StopInterval {
  debug("setIntervalInSecond: seconds=%s", seconds);
  let counter = 0;
  let isRunning = true;
  (async () => {
    while (isRunning) {
      await waitSecond(seconds);
      counter++;
      debug("setIntervalInSecond callback: n=%s", counter);
      handler(counter);
    }
    debug("setIntervalInSecond stopped");
  })();
  const stop = () => {
    debug("setIntervalInSecond stop by user");
    isRunning = false;
  };
  return stop;
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
