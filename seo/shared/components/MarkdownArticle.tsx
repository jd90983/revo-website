import Markdown, {defaultUrlTransform} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {ReviewPage} from '@/lib/review-cohort';
export const articleHeading=(page:ReviewPage)=>page.markdownArticle?.content.split('\n')[0].replace(/^# /,'')??page.title;
/** Render reviewed Markdown as React elements; raw HTML is not executed. */
export function MarkdownArticle({page}:{page:ReviewPage}){
 const article=page.markdownArticle!;
 const preface=article.content.slice(article.content.indexOf('\n')+1).split(/^## /m)[0].replace(page.intro,'').trim();
 const transform=(url:string)=>{
  const asset=article.assets.find(a=>a.reference===url);
  if(asset)return asset.href;
  if(url.startsWith('https://www.revoapp.ai/ai-answering-service/'))return new URL(url).pathname+new URL(url).search+new URL(url).hash;
  return defaultUrlTransform(url);
 };
 const render=(content:string,label:string)=><Markdown remarkPlugins={[remarkGfm]} urlTransform={transform} components={{
  table:({children})=><div className="guide-data"><div className="guide-data-scroll" role="region" aria-label={label} tabIndex={0}><table>{children}</table></div></div>,
  th:({children})=><th scope="col">{children}</th>,
 }}>{content}</Markdown>;
 return <><link rel="stylesheet" href="/css/revo-guide-tables.css"/><link rel="stylesheet" href="/css/revo-markdown-guides.css"/>
 {preface?<section className="home-guide-section"><div className="home-guide-container home-guide-markdown">{render(preface,'Article introduction')}</div></section>:null}
 {page.sections.map((s,i)=><section id={'section-'+i} key={s.title} className="home-guide-section"><div className="home-guide-container home-guide-markdown"><h2>{s.title}</h2>{render(s.paragraphs.join('\n\n'),s.title)}</div></section>)}
 {article.assets.length?<section className="home-guide-section"><div className="home-guide-container home-guide-markdown"><h2>Companion resources</h2><ul>{article.assets.map(a=><li key={a.href}><a href={a.href} download>{a.label}</a></li>)}</ul></div></section>:null}
 </>;
}
