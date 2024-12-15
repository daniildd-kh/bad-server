import sanitizeHtml from 'sanitize-html';


const options = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
        a: ['href']
    },
};

export const sanitize = (html: string) => sanitizeHtml(html, options);
