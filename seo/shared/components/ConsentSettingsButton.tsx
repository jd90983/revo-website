"use client";
import {useEffect,useState} from 'react';
export function ConsentSettingsButton(){
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 return <button type="button" disabled={!ready} onClick={()=>window.dispatchEvent(new Event('revo-consent-open'))}>Cookie settings</button>;
}
