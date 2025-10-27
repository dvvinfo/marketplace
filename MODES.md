# Marketplace - Development Modes

## 🔥 Development Mode (Hot-Reload) - RECOMMENDED

**Best for:** Daily development work

### Start

```bash
# Windows
START-DEV.bat

# Linux/Mac
./START-DEV.sh
```

### Features

- ✅ **Hot-reload enabled** - changes automatically reload
- ✅ **Fast feedback** - see changes in seconds
- ✅ **All in Docker** - no local Node.js setup needed
- ✅ **Volume mapping** - edit files on host, run in container

### How it works

- Code is mounted from host into containers
- NestJS watches for changes and recompiles
- Nuxt watches for changes and hot-reloads
- No need to rebuild Docker images

### Stop

```bash
# Windows
STOP-DEV.bat

# Linux/Mac
./STOP-DEV.sh
```

---

## 🚀 Production Mode

**Best for:** Testing production builds, deployment simulation

### Start

```bash
# Windows
START-ALL.bat

# Linux/Mac
./START-ALL.sh
```

### Features

- ✅ **Production builds** - optimized and minified
- ✅ **Performance** - faster runtime
- ❌ **No hot-reload** - need to rebuild after changes

### How it works

- Code is built inside Docker during image build
- Production-optimized bundles
- Smaller image sizes
- Requires rebuild for code changes

### Stop

```bash
# Windows
STOP-ALL.bat

# Linux/Mac
./STOP-ALL.sh
```

---

## 💻 Hybrid Mode

**Best for:** When you prefer local development tools

### Start

**Step 1: Infrastructure**

```bash
# Windows
START-INFRA.bat

# Linux/Mac
./START-INFRA.sh
```

**Step 2: Backend**

```bash
cd backend
npm install
START-ALL.bat  # or ./START-ALL.sh
```

**Step 3: Frontend**

```bash
cd frontend
npm install
npm run dev
```

### Features

- ✅ **Hot-reload** - native Node.js watch mode
- ✅ **Easy debugging** - use your IDE debugger
- ✅ **Familiar** - standard npm commands
- ⚠️ **Requires Node.js** - must install locally

### Stop

```bash
# Stop infrastructure
docker-compose -f docker-compose.dev.yml down

# Stop backend/frontend
Ctrl+C in each terminal
```

---

## Comparison

| Feature                | Development Mode | Production Mode | Hybrid Mode  |
| ---------------------- | ---------------- | --------------- | ------------ |
| Hot-reload             | ✅               | ❌              | ✅           |
| All in Docker          | ✅               | ✅              | ❌           |
| Fast startup           | ⚠️ Medium        | ⚠️ Slow         | ✅ Fast      |
| Production-like        | ❌               | ✅              | ❌           |
| Easy debugging         | ⚠️ Medium        | ❌              | ✅           |
| Requires local Node.js | ❌               | ❌              | ✅           |
| Rebuild after changes  | ❌               | ✅              | ❌           |
| **Recommended for**    | **Development**  | **Testing**     | **Advanced** |

---

## Quick Reference

### View Logs

```bash
# Development mode
docker-compose -f docker-compose.dev.yml logs -f

# Production mode
docker-compose logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f marketplace_frontend
```

### Rebuild

```bash
# Development mode
docker-compose -f docker-compose.dev.yml up -d --build

# Production mode
docker-compose up -d --build
```

### Check Status

```bash
# Development mode
docker-compose -f docker-compose.dev.yml ps

# Production mode
docker-compose ps
```

### Access Services

All modes use the same ports:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- Swagger: http://localhost:3001/api-docs
- PostgreSQL: localhost:5433
- PgAdmin: http://localhost:5050
- RabbitMQ: http://localhost:15672

---

## Troubleshooting

### Development mode not reloading?

```bash
# Restart the service
docker-compose -f docker-compose.dev.yml restart marketplace_frontend

# Check logs
docker-compose -f docker-compose.dev.yml logs -f marketplace_frontend
```

### Port already in use?

```bash
# Stop all Docker containers
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Check what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac
```

### Changes not appearing?

**Development mode:**

- Check if volumes are mounted: `docker-compose -f docker-compose.dev.yml ps`
- Restart service: `docker-compose -f docker-compose.dev.yml restart marketplace_frontend`

**Production mode:**

- You need to rebuild: `docker-compose up -d --build`

---

## Recommendations

### For Daily Development

Use **Development Mode** (START-DEV.bat):

- Fast feedback loop
- No manual rebuilds
- All in Docker

### For Testing Production Builds

Use **Production Mode** (START-ALL.bat):

- Test optimized builds
- Verify production behavior
- Check bundle sizes

### For Advanced Users

Use **Hybrid Mode** (START-INFRA.bat):

- Full control over processes
- Use your favorite debugging tools
- Customize startup commands
