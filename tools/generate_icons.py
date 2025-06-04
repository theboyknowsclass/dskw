import os
import subprocess
from PIL import Image
import time

def generate_icons():
    # Input and output paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    svg_path = os.path.join(project_root, 'assets', 'logo.svg')
    output_dir = os.path.join(project_root, 'assets')
    
    # Define paths for both icons
    temp_384 = os.path.join(output_dir, 'temp-384x384.png')
    temp_768 = os.path.join(output_dir, 'temp-768x768.png')
    temp_1024 = os.path.join(output_dir, 'temp-1024x1024.png')
    icon_with_border = os.path.join(output_dir, 'icon-with-border-512.png')
    icon_with_border_large = os.path.join(output_dir, 'icon-with-border-1024.png')
    splash_icon = os.path.join(output_dir, 'splash-icon-1024.png')
    
    print(f"Current directory: {current_dir}")
    print(f"Project root: {project_root}")
    print(f"SVG path: {svg_path}")
    print(f"Output directory: {output_dir}")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Check if SVG file exists
    if not os.path.exists(svg_path):
        print(f"Error: SVG file not found at {svg_path}")
        return
    
    try:
        # Clean up any existing temp files
        for temp_file in [temp_384, temp_768, temp_1024]:
            if os.path.exists(temp_file):
                os.remove(temp_file)
                print(f"Removed existing temp file: {temp_file}")
        
        # Generate Play Store icon (384x384 centered in 512x512 white square)
        print("\nGenerating Play Store icon...")
        inkscape_cmd_384 = [
            'inkscape',
            '--export-filename=' + temp_384,
            '--export-width=384',
            '--export-height=384',
            '--export-background=white',
            svg_path
        ]
        
        print("Running Inkscape command for 384x384...")
        subprocess.run(inkscape_cmd_384, check=True)
        print("Inkscape command completed")
        
        # Wait for the temp PNG file to exist
        timeout = 10
        waited = 0
        while not os.path.exists(temp_384) and waited < timeout:
            print(f"Waiting for temp file... ({waited:.1f}s)")
            time.sleep(0.5)
            waited += 0.5
            
        if not os.path.exists(temp_384):
            print(f"Error: Temp PNG file was not created after {timeout} seconds.")
            return
            
        print(f"Temp file found at: {temp_384}")
        
        # Create the 512x512 icon with white background
        final_image = Image.new('RGBA', (512, 512), 'white')
        svg_image = Image.open(temp_384)
        x = (512 - 384) // 2
        y = (512 - 384) // 2
        final_image.paste(svg_image, (x, y), svg_image)
        final_image.save(icon_with_border, 'PNG')
        print(f"Generated icon with border at: {icon_with_border}")

        # Generate 768x768 version for the 1024x1024 icon
        print("\nGenerating 768x768 version for large icon...")
        inkscape_cmd_768 = [
            'inkscape',
            '--export-filename=' + temp_768,
            '--export-width=768',
            '--export-height=768',
            '--export-background=white',
            svg_path
        ]
        
        print("Running Inkscape command for 768x768...")
        subprocess.run(inkscape_cmd_768, check=True)
        print("Inkscape command completed")
        
        # Wait for the temp PNG file to exist
        waited = 0
        while not os.path.exists(temp_768) and waited < timeout:
            print(f"Waiting for temp file... ({waited:.1f}s)")
            time.sleep(0.5)
            waited += 0.5
            
        if not os.path.exists(temp_768):
            print(f"Error: Temp PNG file was not created after {timeout} seconds.")
            return
            
        print(f"Temp file found at: {temp_768}")
        
        # Create the 1024x1024 icon with white background
        final_image_large = Image.new('RGBA', (1024, 1024), 'white')
        svg_image_large = Image.open(temp_768)
        x = (1024 - 768) // 2
        y = (1024 - 768) // 2
        final_image_large.paste(svg_image_large, (x, y), svg_image_large)
        final_image_large.save(icon_with_border_large, 'PNG')
        print(f"Generated large icon with border at: {icon_with_border_large}")
        
        # Generate splash icon (1024x1024 with transparency)
        print("\nGenerating splash icon...")
        inkscape_cmd_1024 = [
            'inkscape',
            '--export-filename=' + temp_1024,
            '--export-width=1024',
            '--export-height=1024',
            svg_path
        ]
        
        print("Running Inkscape command for 1024x1024...")
        subprocess.run(inkscape_cmd_1024, check=True)
        print("Inkscape command completed")
        
        # Wait for the temp PNG file to exist
        waited = 0
        while not os.path.exists(temp_1024) and waited < timeout:
            print(f"Waiting for temp file... ({waited:.1f}s)")
            time.sleep(0.5)
            waited += 0.5
            
        if not os.path.exists(temp_1024):
            print(f"Error: Temp PNG file was not created after {timeout} seconds.")
            return
            
        print(f"Temp file found at: {temp_1024}")
        
        # Save the 1024x1024 splash icon
        splash_image = Image.open(temp_1024)
        splash_image.save(splash_icon, 'PNG')
        print(f"Generated splash icon at: {splash_icon}")
        
        # Clean up temporary files
        for temp_file in [temp_384, temp_768, temp_1024]:
            try:
                os.remove(temp_file)
                print(f"Cleaned up temporary file: {temp_file}")
            except Exception as e:
                print(f"Warning: Could not remove temporary file {temp_file}: {e}")
        
        # Verify the files were created
        for output_file in [icon_with_border, icon_with_border_large, splash_icon]:
            if os.path.exists(output_file):
                print(f"Final file size for {os.path.basename(output_file)}: {os.path.getsize(output_file)} bytes")
            else:
                print(f"Error: {os.path.basename(output_file)} was not created successfully")
            
    except subprocess.CalledProcessError as e:
        print(f"Error running Inkscape: {e}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == '__main__':
    generate_icons() 