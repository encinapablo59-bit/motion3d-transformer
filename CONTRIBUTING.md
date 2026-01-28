# Contributing to Motion3D Transformer

Thank you for your interest in contributing! This document provides guidelines for contributing to our motion transfer project.

## 🤝 How to Contribute

### Reporting Bugs

1. Search existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/videos if applicable

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Provide a clear description of feature
3. Explain the use case and benefits
4. Consider implementation approach

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Ensure all tests pass: `pytest tests/`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Development Guidelines

### Code Style

- Python: Follow PEP 8, use black for formatting
- JavaScript/React: Use ESLint + Prettier configuration
- Add type hints for Python functions
- Write comprehensive docstrings

### Testing

- Unit tests for all new features
- Integration tests for API endpoints
- Minimum coverage: 80%
- Use pytest for Python tests

### Documentation

- Update README for user-facing changes
- Add inline comments for complex logic
- Update API documentation for endpoint changes

## 🚀 Pull Request Process

1. Update documentation as needed
2. Ensure all CI checks pass
3. Request code review from maintainers
4. Address review feedback promptly
5. Maintain small, focused PRs

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 🔧 Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```
3. Set up pre-commit hooks
4. Create your feature branch

## 🧪 Testing

Run tests with:
```bash
# Python tests
pytest tests/

# Frontend tests
npm test
```

## 📋 Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or clearly documented)
- [ ] Performance impact considered

Thank you for contributing! 🎉