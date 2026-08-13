import DOMPurify from 'dompurify';

// SEC-02: the single choke point for any HTML string that could end up rendered via
// dangerouslySetInnerHTML — currently that's CmsCourseItem.bodyHtmlContent (CMS "Rich Content"
// lesson body) and AI-generated course bodies (Gemini via AiGeneratorModule). No script/event
// handlers/iframes survive; only the tags a lesson body actually needs are kept.
const ALLOWED_TAGS = [
  'div', 'p', 'span', 'br', 'strong', 'b', 'em', 'i', 'u',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'blockquote', 'code', 'pre', 'sup', 'sub', 'hr', 'a', 'img',
];

const ALLOWED_ATTR = ['class', 'dir', 'href', 'src', 'alt', 'title', 'target', 'rel'];

export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
