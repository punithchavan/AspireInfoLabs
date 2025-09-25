// utils/timeConverter.js
const parseTimeToMs = (timeStr) => {
  const match = /^(\d+)([smhd])$/.exec(timeStr);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
};

export{
    parseTimeToMs
}
