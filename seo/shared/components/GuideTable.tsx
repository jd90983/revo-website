import type {GuideTable as GuideTableData} from '@/lib/review-cohort';

/** A server-rendered, scrollable table; source links remain adjacent on small screens. */
export function GuideTable({table}:{table:GuideTableData}) {
  return <><link rel="stylesheet" href="/css/revo-guide-tables.css"/><div className="guide-data">
    <div className="guide-data-scroll" role="region" aria-label={table.caption} tabIndex={0}>
      <table><caption>{table.caption}</caption>
        <thead><tr>{table.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{table.rows.map(row=><tr key={row[0]}>{row.map((cell,index)=>index===0?<th scope="row" key={index}>{cell}</th>:<td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {table.sources?.length?<nav aria-label="Table sources"><ul>{table.sources.map(source=><li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul></nav>:null}
  </div></>;
}
