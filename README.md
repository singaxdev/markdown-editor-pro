# Markdown Editor Pro

> A beautiful, feature-rich markdown editor with AI integration and modern themes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/release/yourusername/markdown-editor-pro.svg)](https://github.com/yourusername/markdown-editor-pro/releases)
[![Downloads](https://img.shields.io/github/downloads/yourusername/markdown-editor-pro/total.svg)](https://github.com/yourusername/markdown-editor-pro/releases)

## ✨ Features

### 🎨 **Modern Interface**
- **Dual Themes**: Beautiful dark and light modes
- **Split View**: Edit and preview simultaneously
- **Sidebar Explorer**: Browse and manage files
- **Customizable Editor**: Adjustable font sizes and preferences

### 🤖 **AI Integration**
- **Multiple Providers**: OpenAI GPT-4, Anthropic Claude, Google Gemini, Ollama
- **Content Generation**: Blog posts, documentation, tutorials, README files
- **Content Enhancement**: Improve, summarize, and restructure existing content
- **Smart Assistance**: Context-aware suggestions and auto-completion

### 📝 **Powerful Editing**
- **Monaco Editor**: VSCode-style editing experience
- **Syntax Highlighting**: Full markdown and code syntax support
- **Live Preview**: Real-time markdown rendering
- **Export Options**: PDF export with custom styling

### 🛠️ **Productivity Features**
- **Recent Files**: Quick access to recently opened documents
- **Auto-save**: Never lose your work
- **File Management**: Full file system integration
- **Keyboard Shortcuts**: Efficient workflow with hotkeys

## 📸 Screenshots

![Main Interface](screenshots/main-interface.png)
*Main editing interface with dark theme*

![Settings Panel](screenshots/settings-panel.png)
*Comprehensive settings panel*

![AI Integration](screenshots/ai-integration.png)
*AI-powered content generation*

## 🚀 Download

### Latest Release (v1.0.0)

| Platform | Download Link | Size |
|----------|---------------|------|
| **Windows** | [Windows Installer (.exe)](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/Markdown-Editor-Pro-Setup-1.0.0.exe) | ~150MB |
| **Windows Portable** | [Portable (.exe)](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/Markdown-Editor-Pro-1.0.0.exe) | ~150MB |
| **macOS** | [macOS DMG (Intel)](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/Markdown-Editor-Pro-1.0.0.dmg) | ~160MB |
| **macOS Apple Silicon** | [macOS DMG (M1/M2)](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/Markdown-Editor-Pro-1.0.0-arm64.dmg) | ~160MB |
| **Linux** | [AppImage](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/Markdown-Editor-Pro-1.0.0.AppImage) | ~170MB |
| **Linux (Debian)** | [.deb Package](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/markdown-editor-pro_1.0.0_amd64.deb) | ~150MB |
| **Linux (RedHat)** | [.rpm Package](https://github.com/yourusername/markdown-editor-pro/releases/latest/download/markdown-editor-pro-1.0.0.x86_64.rpm) | ~150MB |

### System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 18.04, Debian 9, or equivalent

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/markdown-editor-pro.git
cd markdown-editor-pro

# Install dependencies
npm install

# Start development server
npm run electron:dev

# Build for production
npm run dist

# Build for all platforms
npm run dist:all
```

### Project Structure

```
markdown-editor-pro/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── styles/            # CSS and styling
├── public/                # Static assets
│   ├── electron.js        # Electron main process
│   └── preload.js         # Electron preload script
├── build/                 # Build assets (icons, etc.)
└── dist/                  # Built application
```

### Building

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux

# Build for all platforms (requires platform-specific dependencies)
npm run dist:all
```

## ⚙️ Configuration

### AI Integration

1. Open **Settings** (⚙️ icon in toolbar)
2. Navigate to **AI Integration** section
3. Select your preferred provider:
    - **OpenAI**: Requires API key from [OpenAI Platform](https://platform.openai.com/)
    - **Anthropic**: Requires API key from [Anthropic Console](https://console.anthropic.com/)
    - **Google**: Requires API key from [Google AI Studio](https://makersuite.google.com/)
    - **Ollama**: Requires [Ollama](https://ollama.ai/) running locally
4. Enter your API key and save

### Customization

- **Themes**: Switch between dark and light modes
- **Fonts**: Choose from 10+ monospace fonts
- **Editor**: Configure line numbers, word wrap, minimap
- **Auto-save**: Enable/disable automatic saving

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [Marked](https://marked.js.org/) - Markdown parser and compiler
- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- [React](https://reactjs.org/) - User interface library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/markdown-editor-pro/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/markdown-editor-pro/discussions)
- 📧 **Email**: your.email@example.com

## 🗺️ Roadmap

- [ ] Plugin system for extensions
- [ ] Collaborative editing
- [ ] Cloud synchronization
- [ ] Mobile companion app
- [ ] More AI providers and features
- [ ] Advanced PDF export options
- [ ] Vim/Emacs key bindings

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[Download](https://github.com/yourusername/markdown-editor-pro/releases/latest) • [Documentation](https://github.com/yourusername/markdown-editor-pro/wiki) • [Changelog](CHANGELOG.md)

</div>