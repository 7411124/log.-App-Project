import http.server
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('', 8080), handler)
print(f'Serving {ROOT} at http://localhost:8080')
httpd.serve_forever()
