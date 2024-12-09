import os
import random
import sys

def get_random_image(folder_path):
    try:
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        if not files:
            return "No images found"
        return random.choice(files)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    folder_path = sys.argv[1]
    print(get_random_image(folder_path))
