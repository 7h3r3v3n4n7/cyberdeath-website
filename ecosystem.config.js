module.exports = {
  apps: [{
    name: "cyberdeath",
    cwd: "/var/www/cyberdeath",
    script: "./node_modules/next/dist/bin/next",
    args: "start -p 3300 -H 127.0.0.1",
    env: { NODE_ENV: "production" },
    autorestart: true,
    max_memory_restart: "300M"
  }]
};
