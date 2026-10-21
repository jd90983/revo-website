import type {ReviewPage} from './review-cohort';

/** Only substantive dated edits expose new FAQ/date metadata; every answer is rendered on the page. */
export function guideStructuredData(page:ReviewPage) {
  const url='https://www.revoapp.ai/ai-answering-service/'+page.slug;
  const webPage={'@type':'WebPage',name:page.title,description:page.description,url,inLanguage:'en-US',...(page.editorialDate?{dateModified:page.editorialDate}:{})};
  if(!page.editorialDate) return {'@context':'https://schema.org',...webPage};
  return {'@context':'https://schema.org','@graph':[
    webPage,
    {'@type':'FAQPage','@id':url+'#faq',url:url+'#faq',mainEntity:page.faqs.map(faq=>({'@type':'Question',name:faq.q,acceptedAnswer:{'@type':'Answer',text:faq.a}}))}
  ]};
}
