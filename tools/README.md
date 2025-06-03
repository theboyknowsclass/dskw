# Play Store Icon Generator

This tool generates a Google Play Store icon from the SVG logo in your project, centering a 384x384px render in a 512x512px white square as required by Play Store guidelines.

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
python generate_play_store_icon.py
```

The generated icon will be saved as `public/play-store-icon-512x512.png` in your project root. 