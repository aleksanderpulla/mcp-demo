import path from "path";
import fs from "fs";


export function writeLog(fileName: string, data: any) {
  const logDir = path.resolve("logs");
  const filePath = path.join(logDir, fileName);

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logContent = `[${new Date().toISOString()}]\n${JSON.stringify(data, null, 2)}\n\n`;
  fs.appendFileSync(filePath, logContent, "utf8");
}

// EXAMPLE function invoke: writeLog("connection-tables.log", result);