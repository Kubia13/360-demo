const fs = require("fs");
const git = require("git-rev-sync");

const now = new Date();

const fmt = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const buildTime = fmt.format(now).replace(",", ""); // "02.03.2026 13:07:59"

const gitHash = git.short();

const content = `
REACT_APP_BUILD_TIME=${buildTime}
REACT_APP_GIT_HASH=${gitHash}
`;

fs.writeFileSync(".env.production.local", content.trim());
fs.writeFileSync(".env.development.local", content.trim());

console.log("Build version generated:");
console.log(content);