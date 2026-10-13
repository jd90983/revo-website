import type {Metadata} from 'next';
import config from '../site.config.json';
import {PublicPageChrome} from '@/components/PublicPageChrome';
import '@/app/globals.css';import '@/app/revo-review.css';import '@/app/revo-pricing.css';
import {LandingConsent} from '@/components/LandingConsent';
export const metadata:Metadata={metadataBase:new URL('https://www.revoapp.ai'),robots:{index:true,follow:true},icons:{icon:'/favicon-32x32.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" className="revo-brand-document"><body className="revo-brand-body"><PublicPageChrome acquisitionEnabled={config.acquisitionEnabled}>{children}</PublicPageChrome><LandingConsent gaId="G-GZHGSMXCJQ" acquisitionEnabled={config.acquisitionEnabled}/></body></html>;}
