from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
ROOT=Path('/Users/mac/Documents/Codex/2026-10-14/task/preview-source/.seo-dist')
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def do_POST(self):self.send_error(405)
 def do_GET(self):
  path=self.path.split('?')[0]
  if not Path(path).suffix and (ROOT/(path.lstrip('/')+'.html')).is_file():self.path=path+'.html'
  super().do_GET()
 def end_headers(self):
  self.send_header('X-Robots-Tag','noindex, nofollow')
  super().end_headers()
ThreadingHTTPServer(('127.0.0.1',8765),Handler).serve_forever()
