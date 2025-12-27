# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**MES Backend API** - Manufacturing Execution System backend built with NestJS, TypeScript, PostgreSQL, and TypeORM.

This API serves as the backend for the Angular frontend (mes-front) and provides endpoints for manufacturing operations management, including production orders, machine monitoring, quality control, traceability, and reporting.

### Tech Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT with Passport
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

## Common Commands

### Setup and Installation
```powershell
# Install dependencies
npm install

# Start PostgreSQL database (Docker)
docker-compose up -d

# Check database status
docker ps
```

### Development
```powershell
# Run in development mode with hot reload
npm run start:dev

# Run in debug mode
npm run start:debug

# Build for production
npm run build

# Run production build
npm run start:prod
```

### Database Operations
```powershell
# TypeORM will auto-sync in development (DB_SYNCHRONIZE=true)
# For production, use migrations:

# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

### Code Quality
```powershell
# Run linter
npm run lint

# Format code with Prettier
npm run format

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Watch mode for tests
npm run test:watch
```

### API Documentation
```powershell
# After starting the server, access Swagger UI at:
# http://localhost:3000/api/docs
```

## Code Architecture

### Module Structure

The application follows a **modular monolithic architecture** organized by business domains:

```
src/
├── auth/                    # Authentication & authorization
├── config/                  # Configuration files
├── master-data/            # Master data modules
│   ├── users/              # User management
│   ├── machines/           # Machine catalog
│   ├── products/           # Product catalog
│   ├── routes/             # Production routes
│   ├── work-centers/       # Work center definitions
│   └── schift/             # Shift definitions
├── production-orders/      # Production order management
├── dispatching/            # Order dispatching & scheduling
├── data-collection/        # Shop floor data collection
├── monitoring/             # Real-time monitoring
├── quality/                # Quality control & inspections
├── traceability/          # Product traceability
├── reports/               # Reporting & analytics
├── integration/           # External system integration
└── iot-ingestion/         # IoT device data ingestion
```

### Module Pattern

Each module follows the standard NestJS pattern:
- **Module** (`*.module.ts`): Dependency injection and module configuration
- **Controller** (`*.controller.ts`): HTTP endpoints and routing
- **Service** (`*.service.ts`): Business logic
- **Entity** (`entities/*.entity.ts`): TypeORM database models
- **DTO** (`dto/*.dto.ts`): Data Transfer Objects for validation
- **Guards** (`guards/*.guard.ts`): Route protection and authorization
- **Decorators** (`decorators/*.decorator.ts`): Custom decorators

### Authentication & Authorization

- **JWT-based authentication** using Passport strategy
- **Guards**:
  - `JwtAuthGuard`: Protects routes requiring authentication
  - `RolesGuard`: Enforces role-based access control (RBAC)
- **Login endpoint**: `POST /auth/login`
- **Register endpoint**: `POST /auth/register`
- Protected routes use `@UseGuards(JwtAuthGuard)` decorator

### Database Configuration

- **ORM**: TypeORM with PostgreSQL
- **Connection**: Configured via environment variables (.env)
- **Auto-sync**: Enabled in development (`DB_SYNCHRONIZE=true`)
- **Logging**: Enabled in development (`DB_LOGGING=true`)
- **Entities**: Auto-loaded via `autoLoadEntities: true`

### CORS Configuration

- Configured in `main.ts` to allow Angular frontend
- Default origin: `http://localhost:4200`
- Credentials enabled for JWT cookies

## API Endpoints

### Base URL
- Development: `http://localhost:3000`
- API Prefix: All endpoints are accessed directly (no `/api` prefix unless in route)

### Core Modules

#### Authentication (`/auth`)
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/register` - User registration

#### Master Data
- **Users** (`/users`) - User CRUD operations
- **Machines** (`/machines`) - Machine catalog management
- **Products** (`/products`) - Product catalog management
- **Routes** (`/routes`) - Production route definitions
- **Work Centers** (`/work-centers`) - Work center management
- **Shifts** (`/schift`) - Shift schedule management

#### Production
- **Production Orders** (`/production-orders`) - Order lifecycle management
- **Dispatching** (`/dispatching`) - Order scheduling and assignment
- **Data Collection** (`/data-collection`) - Shop floor data entry
- **Monitoring** (`/monitoring`) - Real-time production monitoring

#### Quality & Traceability
- **Quality** (`/quality`) - Quality inspections and control
- **Traceability** (`/traceability`) - Product genealogy tracking

#### Reporting & Integration
- **Reports** (`/reports`) - Analytics and reporting
- **Integration** (`/integration`) - External system integration
- **IoT Ingestion** (`/iot-ingestion`) - IoT device data processing

## Environment Variables

Required variables in `.env`:

```bash
# Application
NODE_ENV=development
APP_PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mes_db
DB_USER=mes_user
DB_PASSWORD=mes_password
DB_LOGGING=true
DB_SYNCHRONIZE=true  # false in production

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
```

## Development Guidelines

### Creating New Modules

1. Generate module using NestJS CLI:
```powershell
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

2. Create entities in `entities/` subdirectory
3. Create DTOs in `dto/` subdirectory
4. Register module in `app.module.ts`

### Entity Conventions

- Use TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Define relationships clearly (`@OneToMany`, `@ManyToOne`, etc.)
- Add timestamps: `@CreateDateColumn`, `@UpdateDateColumn`
- Export entities from module for TypeORM auto-loading

### DTO Conventions

- Use `class-validator` decorators for validation
- Create separate DTOs for create, update operations
- Use `PartialType` from `@nestjs/mapped-types` for update DTOs
- Add Swagger decorators (`@ApiProperty`) for documentation

### Controller Best Practices

- Use `@ApiTags` for Swagger grouping
- Add `@ApiOperation` for endpoint descriptions
- Apply `@UseGuards(JwtAuthGuard)` for protected routes
- Use `@Roles()` decorator with `RolesGuard` for RBAC
- Implement proper HTTP status codes

### Service Layer

- Keep business logic in services, not controllers
- Use dependency injection for related services
- Handle errors appropriately (throw HttpException)
- Use TypeORM repository pattern

## Testing

### Unit Tests
- Located alongside source files (`*.spec.ts`)
- Mock dependencies using Jest
- Test business logic in services

### E2E Tests
- Located in `test/` directory
- Use Supertest for HTTP testing
- Test complete request/response cycles

## Frontend Integration (Angular)

### CORS
- Frontend URL: `http://localhost:4200`
- CORS already configured in `main.ts`

### Authentication Flow
1. Frontend sends `POST /auth/login` with credentials
2. Backend returns JWT token
3. Frontend stores token (localStorage/sessionStorage)
4. Frontend includes token in `Authorization: Bearer <token>` header
5. Backend validates token using `JwtAuthGuard`

### HTTP Client Setup (Angular)
```typescript
// Use HttpClient with interceptor for JWT
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

## Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Set `DB_SYNCHRONIZE=false`
3. Use environment-specific `.env` file
4. Change JWT_SECRET to secure random string
5. Enable HTTPS
6. Configure proper CORS origins
7. Run database migrations instead of auto-sync
8. Set up logging and monitoring
9. Configure rate limiting (add throttler module)
10. Review and secure all endpoints

### Docker Deployment
```powershell
# Build production image
docker build -t mes-api .

# Run with docker-compose (production)
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

**Database connection fails**
- Verify PostgreSQL is running: `docker ps`
- Check `.env` database credentials
- Ensure port 5432 is not in use

**Module import errors**
- Check circular dependencies between modules
- Verify entity imports in module's `TypeOrmModule.forFeature([])`

**JWT authentication fails**
- Verify JWT_SECRET matches between requests
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`

**CORS errors from Angular**
- Verify frontend URL in `main.ts` CORS config
- Check browser console for specific CORS error
- Ensure credentials are included if using cookies

## Useful Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Project-Specific Notes

- This is a **Manufacturing Execution System (MES)** for production management
- Designed to integrate with shop floor equipment and ERP systems
- Real-time monitoring capabilities via IoT ingestion module
- Comprehensive traceability for quality compliance
- Role-based access control for different user types (operators, supervisors, managers)
