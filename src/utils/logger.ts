import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeLog(fileName: string, data: any) {
  const logDir = path.join(__dirname, "..", "logs");
  const filePath = path.join(logDir, fileName);

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logContent = `[${new Date().toISOString()}]\n${JSON.stringify(data, null, 2)}\n\n`;
  try {
    fs.appendFileSync(filePath, logContent, "utf8");
  } catch (err) {
    console.error("[writeLog] failed:", err);
  }
}


// EXAMPLE function invoke: writeLog("connection-tables.log", result);