# Quick Reference Documentation

Fast lookup guides and cheat sheets for common tasks.

## 📁 Contents

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Comprehensive quick reference guide

## 🎯 What's Inside

The quick reference guide provides instant access to:

### Commands
- Development server commands
- Build commands
- Test commands
- Deployment commands
- Database commands

### File Paths
- Configuration files
- Component locations
- API endpoints
- Test files
- Documentation

### Code Patterns
- Common React patterns
- API structure
- Database queries
- Authentication flows
- Error handling

### Configuration
- Environment variables
- Docker settings
- CI/CD configuration
- Security settings

## 🚀 Quick Links

### For Developers

**Start Development Server**
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm start
```

**Run Tests**
```bash
# All tests
npm test

# With coverage
npm run test:coverage
```

**Build for Production**
```bash
npm run build
```

### For DevOps

**Deploy**
```bash
cd scripts/deployment
./deploy.sh <environment>
```

**Backup Database**
```bash
./backup.sh
```

**Health Check**
```bash
./health-check.sh
```

## 📖 Using the Quick Reference

### When to Use
- ✅ Need a command quickly
- ✅ Forgot a file path
- ✅ Looking for a code pattern
- ✅ Need configuration syntax
- ✅ Quick troubleshooting

### When to Use Full Docs
- ❌ Learning a new feature
- ❌ Understanding architecture
- ❌ Deep troubleshooting
- ❌ Deployment planning
- ❌ Writing tests

## 🔍 Common Lookups

### File Structure
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → File Structure section

### API Endpoints
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → API Endpoints section

### Environment Variables
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Configuration section

### Testing Patterns
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Testing section

## 💡 Tips for Efficiency

### Search Shortcuts
Use your editor's search (Ctrl+F) within the quick reference:
- Search "auth" for authentication patterns
- Search "test" for testing commands
- Search "docker" for container commands
- Search "env" for environment variables

### Bookmarks
Bookmark frequently used sections:
- Commands you run daily
- File paths you access often
- Code patterns you reference
- Configuration snippets

### IDE Integration
Add quick reference commands to VS Code tasks:
1. Open `.vscode/tasks.json`
2. Add common commands
3. Access via `Ctrl+Shift+P` → "Tasks: Run Task"

## 📚 Related Documentation

### Detailed Guides
- **Development**: [../02-development/](../02-development/)
- **Testing**: [../02-development/TESTING_MASTER.md](../02-development/TESTING_MASTER.md)
- **Deployment**: [../03-deployment/DEPLOYMENT_GUIDE.md](../03-deployment/DEPLOYMENT_GUIDE.md)
- **Design System**: [../02-development/DESIGN_SYSTEM.md](../02-development/DESIGN_SYSTEM.md)

### Specialized References
- **Performance**: [../02-development/MEMOIZATION_QUICK_REFERENCE.md](../02-development/MEMOIZATION_QUICK_REFERENCE.md)
- **Security**: [../02-development/SECURITY.md](../02-development/SECURITY.md)
- **CI/CD**: [../03-deployment/CI_CD_SETUP.md](../03-deployment/CI_CD_SETUP.md)

### Project Info
- **Current Status**: [../05-project-management/PROJECT_STATUS.md](../05-project-management/PROJECT_STATUS.md)
- **Roadmap**: [../05-project-management/DEVELOPMENT_ROADMAP.md](../05-project-management/DEVELOPMENT_ROADMAP.md)
- **Master Index**: [../INDEX.md](../INDEX.md)

## 🛠️ Maintaining the Quick Reference

### Keep It Updated
- Update after adding new features
- Add new commands as they're created
- Update paths when structure changes
- Add new patterns as they emerge

### Keep It Concise
- No explanations (link to full docs instead)
- Just commands, paths, and snippets
- Group related items together
- Use clear headings

### Keep It Accurate
- Test commands before adding
- Verify paths exist
- Check code patterns work
- Validate configuration syntax

---

**Can't find what you need?** Check the [Master Index](../INDEX.md) or search the full documentation.
