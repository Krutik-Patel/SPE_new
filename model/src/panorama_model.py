import cv2
import os
import sys

def create_panorama(image_paths, output_path):
    # Load images dynamically from provided paths
    images = [cv2.imread(image_path) for image_path in image_paths]

    if not images or any(img is None for img in images):
        raise ValueError("One or more images could not be loaded. Please check the file paths.")

    # Initialize the stitcher
    stitcher = cv2.Stitcher_create()

    # Perform stitching
    status, panorama = stitcher.stitch(images)

    if status == cv2.Stitcher_OK:
        # Save the panorama as an image
        cv2.imwrite(output_path, panorama)
        return output_path
    else:
        raise RuntimeError(f"Error in stitching images. Status code: {status}")

if __name__ == "__main__":
    # Read input directory and output directory from command-line arguments
    input_directory = sys.argv[1]
    output_directory = sys.argv[2]

    os.makedirs(output_directory, exist_ok=True)

    # Retrieve image paths from the input directory
    image_files = sorted([
        os.path.join(input_directory, file)
        for file in os.listdir(input_directory)
        if file.lower().endswith(('.png', '.jpg', '.jpeg'))
    ])

    if len(image_files) < 2:
        print("At least two images are required to create a panorama.")
        sys.exit(1)

    # Define output panorama path
    panorama_path = os.path.join(output_directory, "panorama.jpg")

    try:
        # Create panorama
        result_path = create_panorama(image_files, panorama_path)
        print(result_path)  # Print the result path to be used by the backend
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
