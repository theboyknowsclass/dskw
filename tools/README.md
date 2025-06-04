# Icon Generator

This tool generates multiple icons from the SVG logo in your project:
- `icon-with-border-512.png`: A 384x384px logo centered in a 512x512px white square (for Google Play Store)
- `splash-icon-1024.png`: A 1024x1024px transparent PNG (for splash screens and other uses)

## Requirements
- Python 3.8+
- [Pillow](https://pypi.org/project/Pillow/)
- [Inkscape](https://inkscape.org/release/)

## Setup

### 1. Install Python dependencies

First, create and activate a virtual environment (recommended):

#### Windows
```sh
cd tools
python -m venv venv
venv\Scripts\activate
pip install Pillow
```

#### macOS
```sh
cd tools
python3 -m venv venv
source venv/bin/activate
pip install Pillow
```

### 2. Install Inkscape
- Download and install from: https://inkscape.org/release/
- Ensure `inkscape` is available in your system PATH (restart your terminal after installation).

### 3. (Optional) Install Orbitron Font
- Download from [Google Fonts](https://fonts.google.com/specimen/Orbitron) and install on your system for best results.

## Usage

From the `tools` directory (with your virtual environment activated):

```sh
python generate_icons.py
```

The generated icons will be saved in the `public` directory of your project root:
- `public/icon-with-border-512.png`
- `public/splash-icon-1024.png` 