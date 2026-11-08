import React from 'react';
/** Keep fractions and written number expressions readable inside Arabic prose. */
export function MusaidiText({text}: {text:string}) {
  const number=/[0-9٠-٩۰-۹]+(?:[0-9٠-٩۰-۹ \t.,٫٬/⁄()+−×÷=<>≤≥-]*[0-9٠-٩۰-۹])?/g;
  const parts:React.ReactNode[]=[];let offset=0;
  for(const match of text.matchAll(number)) {
    const index=match.index!;
    parts.push(text.slice(offset,index),<bdi key={index} dir="ltr">{match[0]}</bdi>);
    offset=index+match[0].length;
  }
  parts.push(text.slice(offset));return <>{parts}</>;
}
