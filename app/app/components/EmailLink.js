/** Cloudflare's documented comments preserve the public mailto link in raw HTML.
 * All markup is fixed here; only the escaped CSS class is supplied by callers.
 */
export default function EmailLink({ className = '', showIcon = false, desktop = false }) {
  const cssClass = className.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const label = desktop
    ? '<span class="d-inline-flex align-items-center gap-3"><i class="fa fa-envelope fa-2x" aria-hidden="true"></i><span class="d-flex flex-column h6 mb-0">Email Us <span class="text-color">serlesbake@gmail.com</span></span></span>'
    : `${showIcon ? '<i class="fa fa-envelope" aria-hidden="true"></i> ' : ''}<span>serlesbake@gmail.com</span>`;
  return <span dangerouslySetInnerHTML={{ __html: `<!--email_off--><a href="mailto:serlesbake@gmail.com" class="${cssClass}">${label}</a><!--/email_off-->` }} />;
}
