"use client";
import {usePathname} from 'next/navigation';
import {RevoBrandHeader,RevoBrandFooter} from './RevoBrandChrome';

// The approved after-hours composition supplies its own navigation and footer.
export function PublicPageChrome({children,acquisitionEnabled}:{children:React.ReactNode;acquisitionEnabled:boolean}) {
  const pathname=usePathname();
  if(pathname==='/ai-answering-service/after-hours')return <>{children}</>;
  return <><RevoBrandHeader mode="public" acquisitionEnabled={acquisitionEnabled}/>{children}<RevoBrandFooter mode="public"/></>;
}
