import json
import os
from jinja2 import Environment, FileSystemLoader

def generate():
    # Setup paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'projects.json')
    template_dir = os.path.join(base_dir, 'templates')
    output_path = os.path.join(base_dir, 'index.html')

    # Load Data
    try:
        with open(data_path, 'r', encoding='utf-8') as f:
            projects = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {data_path}")
        return

    # Helper function to categorize projects
    categories = {}
    for p in projects:
        cat = p.get('category', 'Other')
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(p)

    featured_project = next((p for p in projects if p.get('id') == 'crm-orchestrator'), projects[0] if projects else None)
    
    # Setup Jinja2
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template('index.html')

    # Render
    context = {
        'projects': projects,
        'categories': categories,
        'featured_project': featured_project
    }
    
    html = template.render(context)

    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Successfully generated portfolio at {output_path}")

if __name__ == '__main__':
    generate()
