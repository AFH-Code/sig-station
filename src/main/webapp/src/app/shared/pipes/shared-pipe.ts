
import { DatePipe } from '@angular/common';
import { isDevMode, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'highlighter',
  })
  export class HighlighterPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
  
    transform(value: any, args: any, stations: any[]): any {
      if (!args) return value;
      let replacedValue = '';
      let v: any[] = value
        .replace(/(\r\n|\n|\r)/gm, '')
        .split('@')
        .filter(
          (t: any) =>
            t != '' && stations.findIndex((u) => u?.stationName == t.trim()) > -1
        );
  
      if (v.length) {
        v.forEach((element, i) => {
          const re = new RegExp(`@${element}`, 'gi');
          replacedValue = value.replace(
            new RegExp(`@${element}`, 'gi'),
            '<span style="color: #F16E31;">' + value.match(re) + '</span>'
          );
        });
  
        return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
      }
  
      return value;
    }
  }