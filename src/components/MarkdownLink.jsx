import React, { useEffect } from 'react';

/**
 * Opens links to other websites in a new tab, and leaves internal links alone.
 *
 * External  = an absolute http(s) URL on a domain that is not Rebalance Impact
 *             (and not the domain the site is currently running on).
 * Internal  = relative links (/#contact-and-quote), #anchors, mailto:, tel:,
 *             and any rebalanceimpact.com URL.
 */
const INTERNAL_HOSTS = ['rebalanceimpact.com', 'www.rebalanceimpact.com'];

export function isExternalHref(href = '') {
    if (!/^https?:\/\//i.test(href)) return false;
    try {
        const { hostname } = new URL(href);
        const current = typeof window !== 'undefined' ? window.location.hostname : '';
        return !INTERNAL_HOSTS.includes(hostname) && hostname !== current;
    } catch {
        return false;
    }
}

/* ---------------------------------------------------------------
 * OPTION 1 - react-markdown (recommended)
 * Pass as the "a" component. No changes to the article content needed.
 *
 *   import ReactMarkdown from 'react-markdown';
 *   import MarkdownLink from './MarkdownLink';
 *
 *   <ReactMarkdown components={{ a: MarkdownLink }}>
 *     {article.content}
 *   </ReactMarkdown>
 * ------------------------------------------------------------- */
export default function MarkdownLink({ href, children, node, ...props }) {
    const external = isExternalHref(href);
    return (
        <a
            href={href}
            {...props}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            {children}
        </a>
    );
}

/* ---------------------------------------------------------------
 * OPTION 2 - any other renderer (marked, markdown-it, or
 * dangerouslySetInnerHTML). Attach the ref to the element that holds
 * the rendered article and it will patch the links after render.
 *
 *   import { useRef } from 'react';
 *   import { useExternalLinks } from './MarkdownLink';
 *
 *   const ref = useRef(null);
 *   useExternalLinks(ref, article.content);
 *   <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
 * ------------------------------------------------------------- */
export function useExternalLinks(ref, dependency) {
    useEffect(() => {
        if (!ref.current) return;
        ref.current.querySelectorAll('a[href]').forEach((a) => {
            if (isExternalHref(a.getAttribute('href'))) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
        });
    }, [ref, dependency]);
}