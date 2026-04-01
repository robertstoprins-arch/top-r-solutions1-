"""
Netlify Functions entry point for the ToP-R Solutions API.

At runtime, Netlify bundles this file alongside the included_files
(api/** and knowledge_base/**), so the directory layout inside the
Lambda package is:

  api.py                  ← this file
  api/
    server.py
    chat_prompt.py
    material_checker.py
    ...
  knowledge_base/
    services.md

We add api/ to sys.path and set KB_ROOT so chat_prompt.py can find
the knowledge base file.
"""

import sys
import os
from pathlib import Path

_here = Path(__file__).parent

# Make api/ modules importable
sys.path.insert(0, str(_here / "api"))

# Tell chat_prompt.py where the repo root is (so it finds knowledge_base/)
os.environ.setdefault("KB_ROOT", str(_here))

from mangum import Mangum
from server import app  # noqa: E402

handler = Mangum(app, lifespan="off")
