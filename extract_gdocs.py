#!/usr/bin/env python3
"""
Extract Google Docs content for Suncoast Mobile project
This script will help extract and convert Google Docs to project files
"""

import os
import json
import subprocess
import sys

def get_gdoc_info(gdoc_path):
    """Extract Google Doc ID from .gdoc file"""
    try:
        with open(gdoc_path, 'r') as f:
            content = f.read()
            # Parse the JSON-like content
            data = json.loads(content.split('\n')[0])
            return data.get('doc_id')
    except Exception as e:
        print(f"Error reading {gdoc_path}: {e}")
        return None

def open_google_doc(doc_id):
    """Open Google Doc in browser for manual export"""
    url = f"https://docs.google.com/document/d/{doc_id}/edit"
    print(f"Opening: {url}")
    subprocess.run(['open', url])
    return url

def main():
    # Google Drive Projects path
    gdrive_path = "/Users/jefffranzen/Google Drive/My Drive/Projects"
    
    # Map of Google Docs to their target files
    docs_mapping = {
        "Suncoast Mobile - README.gdoc": "README.md",
        "Suncoast Mobile - HurricaneTracker.tsx.gdoc": "src/components/HurricaneTracker.tsx",
        "Suncoast Mobile - package.json.gdoc": "package.json",
        "Suncoast Mobile - tailwind.config.js.gdoc": "tailwind.config.js",
        "Suncoast Mobile - tsconfig.json.gdoc": "tsconfig.json",
        "Suncoast Mobile - Complete Setup Guide.gdoc": "SETUP.md"
    }
    
    print("=" * 60)
    print("Suncoast Mobile - Google Docs Extractor")
    print("=" * 60)
    print("\nThis script will open each Google Doc in your browser.")
    print("Please manually copy the content and save it to the specified files.\n")
    
    doc_urls = []
    
    for gdoc_name, target_file in docs_mapping.items():
        gdoc_path = os.path.join(gdrive_path, gdoc_name)
        
        if os.path.exists(gdoc_path):
            doc_id = get_gdoc_info(gdoc_path)
            if doc_id:
                print(f"\n📄 {gdoc_name}")
                print(f"   Target file: {target_file}")
                url = f"https://docs.google.com/document/d/{doc_id}/edit"
                doc_urls.append({
                    'name': gdoc_name,
                    'url': url,
                    'target': target_file
                })
                print(f"   URL: {url}")
        else:
            print(f"❌ Not found: {gdoc_path}")
    
    print("\n" + "=" * 60)
    print("INSTRUCTIONS:")
    print("=" * 60)
    print("\n1. Opening all Google Docs in your browser...")
    print("2. For each document:")
    print("   - Copy all content (Cmd+A, Cmd+C)")
    print("   - Save to the corresponding file listed above")
    print("3. Return here when done\n")
    
    input("Press Enter to open all Google Docs in your browser...")
    
    # Open all docs
    for doc in doc_urls:
        subprocess.run(['open', doc['url']])
    
    print("\n✅ All Google Docs have been opened!")
    print("\nTarget files to create:")
    for doc in doc_urls:
        print(f"  - {doc['target']}")
    
    # Create directories if needed
    os.makedirs('src/components', exist_ok=True)
    
    print("\n📁 Created necessary directories:")
    print("  - src/components/")
    
    print("\n" + "=" * 60)
    print("After copying content from Google Docs, create these files:")
    print("=" * 60)
    
    # Generate file creation commands
    for doc in doc_urls:
        print(f"\n# For {doc['name']}:")
        print(f"# Create file: {doc['target']}")
        print(f"# Paste the content from: {doc['url']}")

if __name__ == "__main__":
    main()