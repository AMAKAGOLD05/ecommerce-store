import { spawn } from "child_process";
import fs from "fs";
import net from "net";
import path from "path";

const PORT = 27017;
const HOST = "127.0.0.1";

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = net.connect({ port: PORT, host: HOST });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function findMongod() {
  if (process.env.MONGOD_PATH && fs.existsSync(process.env.MONGOD_PATH)) {
    return process.env.MONGOD_PATH;
  }

  const roots = [
    "C:\\Program Files\\MongoDB\\Server",
    "C:\\Program Files (x86)\\MongoDB\\Server",
  ];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const versions = fs
      .readdirSync(root)
      .sort()
      .reverse()
      .map((version) => path.join(root, version, "bin", "mongod.exe"));
    const match = versions.find((candidate) => fs.existsSync(candidate));
    if (match) return match;
  }

  return null;
}

async function waitForMongo(timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isPortOpen()) return true;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return false;
}

if (await isPortOpen()) {
  process.exit(0);
}

const mongod = findMongod();
if (!mongod) {
  console.warn(
    "MongoDB is not running and mongod.exe was not found. Admin login needs MongoDB on port 27017.",
  );
  process.exit(0);
}

const dbpath = path.join(process.cwd(), ".data", "mongo");
fs.mkdirSync(dbpath, { recursive: true });

const child = spawn(
  mongod,
  ["--dbpath", dbpath, "--bind_ip", HOST, "--port", String(PORT)],
  {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  },
);
child.unref();

if (await waitForMongo()) {
  console.log("Started local MongoDB for the store.");
  process.exit(0);
}

console.warn("Could not start MongoDB. Admin login will fail until it is running.");
process.exit(0);
