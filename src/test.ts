/**
 * @leizm/accuracy-time
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import { expect } from "chai";
import {
  parseTimeString,
  subtractTimeString,
  addTimeString,
  waitSecond,
  getTime,
  addTime,
  waitUntilTime,
  setIntervalInSecond
} from "./index";

const LIMIT_OF_ACCURACY = 10;

describe("@leizm/accuracy-time", function() {
  it("parseTimeString", function() {
    expect(parseTimeString("12:34:56")).to.deep.equal([12, 34, 56]);
    expect(parseTimeString("00:04:06")).to.deep.equal([0, 4, 6]);
    expect(() => parseTimeString("50:04:06")).to.throws("格式有误");
  });

  it("subtractTimeString", function() {
    expect(subtractTimeString("02:13:24", "01:45:50")).to.deep.equal([
      0,
      27,
      34
    ]);
  });

  it("addTimeString", function() {
    expect(addTimeString("01:45:50", "00:27:34")).to.deep.equal([2, 13, 24]);
  });

  it("getTime", function() {
    const t = Date.now();
    expect(getTime("10:00:01", t) - getTime("10:00:00", t)).to.equal(1000);
    expect(getTime("10:03:45", t) - getTime("10:00:00", t)).to.equal(
      (3 * 60 + 45) * 1000
    );
  });

  it("addTime", function() {
    const t = Date.now();
    expect(addTime("00:00:01", t)).to.equal(t + 1000);
    expect(addTime("00:23:45", t)).to.equal(t + (23 * 60 + 45) * 1000);
    expect(addTime("04:23:45", t)).to.equal(
      t + (4 * 3600 + 23 * 60 + 45) * 1000
    );
  });

  it("setIntervalInSecond", async function() {
    await waitSecond();
    const list: number[] = [];
    let last = Date.now();
    const stop = setIntervalInSecond(1, n => {
      list[n - 1] = Date.now() - last;
      last = Date.now();
    });
    await waitSecond(5);
    stop();
    for (const item of list) {
      expect(Math.abs(item - 1000)).to.lessThan(LIMIT_OF_ACCURACY);
    }
  });

  it("waitUntilTime", async function() {
    await waitSecond();
    const start = Date.now();
    const end = addTime("00:00:05", start);
    const d = await waitUntilTime(new Date(end).toLocaleTimeString(), start);
    expect(Math.abs(d - 5000)).to.lessThan(LIMIT_OF_ACCURACY);
  });

  it("waitSecond", async function() {
    {
      const d = await waitSecond();
      expect(Math.abs(d - 1000)).to.lessThan(LIMIT_OF_ACCURACY);
    }
    for (let i = 0; i < 5; i++) {
      const d = await waitSecond(1);
      expect(Math.abs(d - 1000)).to.lessThan(LIMIT_OF_ACCURACY);
    }
    {
      const d = await waitSecond(2);
      expect(Math.abs(d - 2000)).to.lessThan(LIMIT_OF_ACCURACY);
    }
    {
      const d = await waitSecond(5);
      expect(Math.abs(d - 5000)).to.lessThan(LIMIT_OF_ACCURACY);
    }
  });
});
