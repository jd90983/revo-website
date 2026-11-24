"""Privacy opt-out / GPC (Nov 2026).

Run from the repo root: python3 scripts/add_privacy_optout.py
For every root .html page that loads GTM, the Meta pixel or the TikTok pixel:
- puts the opt-out guard first in <head> (sets window.revoAdOptOut, Consent Mode
  defaults and dataLayer revo_ad_optout before any tag loads);
- wraps the Meta pixel so it does nothing when opted out, and drops its <noscript> image;
- stops the TikTok installer and the deferred fbevents.js loader when opted out.
Safe to run again: pages that already have it are left as they are.
"""
import re,glob,sys
GUARD='''<!-- Privacy opt-out / GPC: must stay the first script in <head> -->
<script>
(function () {
  var optout = false;
  try { optout = navigator.globalPrivacyControl === true; } catch (e) {}
  try { if (localStorage.getItem('revo_ad_optout') === '1') optout = true; } catch (e) {}
  if (!optout && /(?:^|;\\s*)revo_ad_optout=1/.test(document.cookie)) optout = true;
  window.revoAdOptOut = optout;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  if (optout) {
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  }
  dataLayer.push({ revo_ad_optout: optout ? 'yes' : 'no' });
})();
// Opted out: a no-op fbq keeps page code working and stops any later Meta snippet from loading.
if (window.revoAdOptOut && !window.fbq) { window.fbq = window._fbq = function () {}; }
</script>
'''
def transform(s):
    notes=[]
    if 'window.revoAdOptOut = optout' not in s:
        i=s.find('<script'); h=s.find('<head>')
        assert h>=0 and i>h
        # put it right after the viewport meta when that comes before the first script
        m=re.search(r'<meta name="viewport"[^>]*>\n',s[h:i])
        at=h+m.end() if m else s.index('\n',h)+1
        s=s[:at]+GUARD+s[at:]; notes.append('guard')
    # Meta pixel blocks
    def meta(m):
        blk=m.group(0)
        blk=re.sub(r'\n?<noscript><img[^>]*facebook\.com/tr\?id=[^>]*>\s*</noscript>','',blk,flags=re.S)
        def wrap(sm):
            body=sm.group(1)
            if 'if (!window.revoAdOptOut) {' in body: return sm.group(0)
            return '<script>\nif (!window.revoAdOptOut) {\n'+body.strip('\n')+'\n}\n</script>'
        blk=re.sub(r'<script>(.*?)</script>',wrap,blk,count=1,flags=re.S)
        return blk
    s2=re.sub(r'<!-- Meta Pixel Code.*?<!-- End Meta Pixel Code -->',meta,s,flags=re.S)
    if s2!=s: notes.append('meta'); s=s2
    # TikTok installer
    s2=s.replace('if (installed) return;','if (installed || window.revoAdOptOut) return;')
    if s2!=s: notes.append('tiktok'); s=s2
    # Deferred loaders that add fbevents.js themselves
    s2=s.replace("    add('https://connect.facebook.net/en_US/fbevents.js');","    if (!w.revoAdOptOut) add('https://connect.facebook.net/en_US/fbevents.js');")
    if s2!=s: notes.append('loader'); s=s2
    s2=s.replace("<script>fbq('track', 'Lead');</script>","<script>if (window.fbq) fbq('track', 'Lead');</script>")
    if s2!=s: notes.append('lead'); s=s2
    return s,notes
if __name__=='__main__':
    from collections import Counter
    c=Counter()
    for f in sorted(glob.glob('*.html')):
        s=open(f).read()
        if not re.search('GTM-PFJBFLVF|2435811520564771|DARE3CJC77U88MSO6OQ0',s): continue
        s2,n=transform(s)
        open(f,'w').write(s2); c[' '.join(n)]+=1
    print(c)
