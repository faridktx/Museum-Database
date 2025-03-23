const fs = require("fs");
const path = require("path");

const target = path.resolve(__dirname, "./shared");
const linkPath = path.resolve(__dirname, "node_modules", "shared");

// for this to work permissions need to be set manually on the computer
// need to run reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /t REG_DWORD /f /v AllowDevelopmentWithoutDevLicense /d 1
// from a powershell terminal started in adminstrator mode

try {
  if (!fs.existsSync(linkPath)) {
    fs.symlinkSync(target, linkPath, "dir");
    console.log(`Symlink created: ${linkPath} -> ${target}`);
  } else {
    console.log("Symlink already exists.");
  }
} catch (err) {
  console.error("Error creating symlink:", err);
}
