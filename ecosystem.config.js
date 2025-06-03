module.exports = {
  apps: [
    {
      name: 'be-cms-gwt',        // Nama aplikasi di PM2
      script: 'dist/server.js',      // Entry-point setelah di-build (JS)
      instances: 'max',              // Jalankan sebanyak core CPU (cluster mode)
      exec_mode: 'cluster',          // Gunakan mode cluster untuk scalability
      watch: false,                  // Nonaktifkan watch (jangan restart otomatis saat file berubah)
      autorestart: true,             // Otomatis restart jika crash
      max_restarts: 5,               // Maksimal restart sebelum PM2 menyerah
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3012
      }
    }
  ]
};
