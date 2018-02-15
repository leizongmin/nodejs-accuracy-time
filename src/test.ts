/**
 * @leizm/accuracy-time
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import { expect } from "chai";
import {
  waitSecond,
  getTime,
  addTime,
  waitUntilTime,
  setIntervalInSecond
} from "./index";

const LIMIT_OF_ACCURACY = 10;

describe("@leizm/accuracy-time", function() {
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
