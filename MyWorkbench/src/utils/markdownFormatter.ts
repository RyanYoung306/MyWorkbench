// utils/markdownFormatter.ts

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
const escapeHTML = (text: string): string => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Formats markdown text to HTML
 */
export const formatMarkdown = (text: string): string => {
    if (!text) return '';

    let formattedText = text;

    // Convert code blocks with language
    formattedText = formattedText.replace(
        /```([a-z]*)\n([\s\S]*?)\n```/g,
        (_match, language, code) => {
            return `<div><pre><code class="language-${language}">${escapeHTML(code)}</code></pre></div>`;
        }
    );

    // Convert inline code using lazy quantifier
    formattedText = formattedText.replace(
        /`([^`]+?)`/g,
        (_match, code) => `<code>${escapeHTML(code)}</code>`
    );

    // Convert H1 headings
    formattedText = formattedText.replace(
        /^#\s+(.+)$/gm,
        (_match, title) => `<h1>${title}</h1>`
    );

    // Convert H2 to H6 headings
    formattedText = formattedText.replace(
        /^(#{2,6})\s+(.+)$/gm,
        (_match, hashes, title) => {
            const level = hashes.length;
            return `<h${level}>${title}</h${level}>`;
        }
    );

    // Bold text
    formattedText = formattedText.replace(
        /\*\*(.+?)\*\*/g,
        (_match, content) => `<strong>${content}</strong>`
    );

    // Italic text
    formattedText = formattedText.replace(
        /\*(.+?)\*/g,
        (_match, content) => `<em>${content}</em>`
    );

    // Blockquote
    formattedText = formattedText.replace(
        /^\>\s+(.+)$/gm,
        (_match, quote) => `<blockquote>${quote}</blockquote>`
    );

    // Horizontal rule
    formattedText = formattedText.replace(
        /^---$/gm,
        '<hr />'
    );

    // Unordered list items
    formattedText = formattedText.replace(
        /^\-\s+(.+)$/gm,
        (_match, item) => `<li>${item}</li>`
    );
    formattedText = formattedText.replace(
        /(<li>(?:[\s\S](?!<\/ul>))+<\/li>)/gm,
        '<ul>$1</ul>'
    );

    // Ordered list items
    formattedText = formattedText.replace(
        /^\d+\.\s+(.+)$/gm,
        (_match, item) => `<li>${item}</li>`
    );
    formattedText = formattedText.replace(
        /(<li>(?:[\s\S](?!<\/ol>))+<\/li>)/gm,
        '<ol>$1</ol>'
    );

    // Link formatting
    formattedText = formattedText.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (_match, txt, url) => `<a href="${url}">${txt}</a>`
    );

    // Image formatting
    formattedText = formattedText.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (_match, alt, url) => `<img src="${url}" alt="${alt}" />`
    );

    // Strikethrough text
    formattedText = formattedText.replace(
        /~~(.+?)~~/g,
        (_match, txt) => `<del>${txt}</del>`
    );

    // Task list items with checkboxes
    formattedText = formattedText.replace(
        /^\-\s+\[( |x)\]\s+(.+)$/gm,
        (_match, checked, content) => {
            const isChecked = checked.trim() === 'x' ? 'checked' : '';
            return `<li><input type="checkbox" disabled ${isChecked} /> ${content}</li>`;
        }
    );

    // Wrap plain text lines that are not already wrapped in block tags in paragraph tags.
    formattedText = formattedText
        .split('\n')
        .map((line) => {
            if (
                !line.trim() ||
                /^<\/?(h\d|ul|ol|li|pre|blockquote|div|p|img|hr|code|strong|em|del|a)\b/.test(
                    line.trim()
                )
            ) {
                return line;
            }
            return `<p>${line}</p>`;
        })
        .join('\n');

    // Convert remaining line breaks to <br>
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
};