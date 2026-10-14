"use client";
export function ConsentSettingsButton(){return <button type="button" onClick={()=>window.dispatchEvent(new Event('revo-consent-open'))}>Cookie settings</button>;}
