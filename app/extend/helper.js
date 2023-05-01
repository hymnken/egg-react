const dayjs = require("dayjs");
module.exports = {
  base64Encode(str = "") {
    return new Buffer(str).toString("base64");
  },
  time() {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  },
  // 返回时间戳
  timeStamp(data) {
    return new Date(data).getTime();
  },
  // 从对象中剥离某个属性
  unPick(source, arr) {
    if (Array.isArray(arr)) {
      let obj = {};
      for (let i in source) {
        if (!arr.includes(i)) {
          obj[i] = source[i];
        }
      }
      return obj;
    }
  },
};
