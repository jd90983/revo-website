"use client";
import publicGuides from '@/data/public-guide-navigation.json';
import {usePathname} from 'next/navigation';
import {RevoBrandHeader,RevoBrandFooter} from './RevoBrandChrome';

const navigation: Array<{slug:string;template:string|null}> = publicGuides;
// Approved call-design compositions supply their own navigation and footer.
export function PublicPageChrome({children,acquisitionEnabled}:{children:React.ReactNode;acquisitionEnabled:boolean}) {
  const pathname=usePathname();
  const guide=pathname.startsWith('/ai-answering-service/') ? navigation.find(guide=>guide.slug===pathname.slice('/ai-answering-service/'.length)) : undefined;
  if(pathname==='/ai-answering-service/after-hours'||guide?.template==='workflow')return <>{children}</>;
  return <><RevoBrandHeader mode="public" acquisitionEnabled={acquisitionEnabled}/>{children}<RevoBrandFooter mode="public"/></>;
}
