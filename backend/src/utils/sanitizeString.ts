// npm i sanitize-html
// npm install -D @types/sanitize-html

import sanitizeHtml, { IOptions } from 'sanitize-html';

const sanitizeOptions:IOptions = {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
  allowedAttributes: {
    'a': [ 'href', 'name', 'target' ]
  },
  disallowedTagsMode: 'escape'
}

export function sanitizeStringPartial (sketchy:string) {
  return sanitizeHtml(sketchy, sanitizeOptions);
}

export function sanitizeStringFull (sketchy:string) {
  return sanitizeHtml(sketchy, {
    allowedTags: [],
    allowedAttributes: {}
  });
}
