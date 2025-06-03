import os
import subprocess
from PIL import Image
import time

def generate_play_store_icon():
    # Input and output paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    svg_path = os.path.join(project_root, 'src', 'assets', 'logo.svg')
    output_dir = os.path.join(project_root, 'public')
    temp_png = os.path.join(output_dir, 'temp-384x384.png')
    output_path = os.path.join(output_dir, 'play-store-icon-512x512.png')
    
    print(f"Current directory: {current_dir}")
    print(f"Project root: {project_root}")
    print(f"SVG path: {svg_path}")
    print(f"Output directory: {output_dir}")
    print(f"Temp PNG path: {temp_png}")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Check if SVG file exists
    if not os.path.exists(svg_path):
        print(f"Error: SVG file not found at {svg_path}")
        return
    
    try:
        # Ensure output directory exists before running Inkscape
        os.makedirs(output_dir, exist_ok=True)
        
        # Remove temp file if it exists from a previous run
        if os.path.exists(temp_png):
            os.remove(temp_png)
            print("Removed existing temp file")
        
        # Use Inkscape to convert SVG to PNG
        inkscape_cmd = [
            'inkscape',
            '--export-filename=' + temp_png,
            '--export-width=384',
            '--export-height=384',
            '--export-background=white',
            svg_path
        ]
        
        print("Running Inkscape command...")
        print(f"Command: {' '.join(inkscape_cmd)}")
        subprocess.run(inkscape_cmd, check=True)
        print("Inkscape command completed")
        
        # Wait for the temp PNG file to exist (max 10 seconds)
        timeout = 10
        waited = 0
        while not os.path.exists(temp_png) and waited < timeout:
            print(f"Waiting for temp file... ({waited:.1f}s)")
            time.sleep(0.5)
            waited += 0.5
            
        if not os.path.exists(temp_png):
            print(f"Error: Temp PNG file was not created after {timeout} seconds.")
            print(f"Expected path: {temp_png}")
            return
            
        print(f"Temp file found at: {temp_png}")
        print(f"Temp file size: {os.path.getsize(temp_png)} bytes")
        
        # Create a new 512x512 image with white background
        final_image = Image.new('RGBA', (512, 512), 'white')
        
        # Open the rendered SVG as an image
        svg_image = Image.open(temp_png)
        
        # Calculate position to center the 384x384 image in the 512x512 canvas
        x = (512 - 384) // 2
        y = (512 - 384) // 2
        
        # Paste the SVG image onto the white background
        final_image.paste(svg_image, (x, y), svg_image)
        
        # Save the final image with a descriptive name
        final_image.save(output_path, 'PNG')
        print(f"Generated Play Store icon at: {output_path}")
        
        # Clean up temporary file
        try:
            os.remove(temp_png)
            print("Temporary file cleaned up successfully")
        except Exception as e:
            print(f"Warning: Could not remove temporary file: {e}")
        
        # Verify the file was created
        if os.path.exists(output_path):
            print(f"Final file size: {os.path.getsize(output_path)} bytes")
        else:
            print("Error: Final file was not created successfully")
            
    except subprocess.CalledProcessError as e:
        print(f"Error running Inkscape: {e}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == '__main__':
    generate_play_store_icon() 