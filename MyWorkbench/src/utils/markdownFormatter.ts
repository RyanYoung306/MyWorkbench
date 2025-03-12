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
    formattedText = formattedText.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, language, code) => {
        return `<div><pre><code class="language-${language}">${escapeHTML(code)}</code></pre></div>`;
    });

    // Convert inline code
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert headings (H1 to H6)
    formattedText = formattedText.replace(/^(#{1,6})[ \t]+(.+)$/gm, (match, hashes, title) => {
        const level = hashes.length;
        return `<h${level}>${title}</h${level}>`;
    });

    // Bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Blockquote
    formattedText = formattedText.replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    formattedText = formattedText.replace(/^---$/gm, '<hr />');

    // Unordered list items
    formattedText = formattedText.replace(/^\- (.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>(?:[\s\S](?!<\/ul>))+<\/li>)/gm, '<ul>$1</ul>');

    // Ordered list items
    formattedText = formattedText.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>(?:[\s\S](?!<\/ol>))+<\/li>)/gm, '<ol>$1</ol>');

    // Link formatting
    formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Image formatting
    formattedText = formattedText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Strikethrough text
    formattedText = formattedText.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Task list items (using checkboxes)
    formattedText = formattedText.replace(/^- \[( |x)\] (.+)$/gm, (match, checked, content) => {
        const isChecked = (checked.trim() === 'x') ? 'checked' : '';
        return `<li><input type="checkbox" disabled ${isChecked}/> ${content}</li>`;
    });

    // Convert remaining line breaks to <br>
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
};