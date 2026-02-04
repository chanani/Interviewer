import './NotionRenderer.css';

function RichText({ richText }) {
  if (!richText || richText.length === 0) return null;

  return richText.map((segment, i) => {
    const { bold, italic, strikethrough, underline, code, color } = segment.annotations;
    let content = segment.plain_text;

    if (code) return <code key={i} className="notion-inline-code">{content}</code>;

    let el = content;
    if (bold) el = <strong>{el}</strong>;
    if (italic) el = <em>{el}</em>;
    if (strikethrough) el = <s>{el}</s>;
    if (underline) el = <u>{el}</u>;

    if (segment.href) {
      return (
        <a key={i} href={segment.href} target="_blank" rel="noopener noreferrer" className="notion-link">
          {el}
        </a>
      );
    }

    return <span key={i}>{el}</span>;
  });
}

function Block({ block }) {
  switch (block.type) {
    case 'paragraph':
      if (block.paragraph.rich_text.length === 0) return <div className="notion-spacer" />;
      return <p className="notion-paragraph"><RichText richText={block.paragraph.rich_text} /></p>;

    case 'heading_1':
      return <h1 className="notion-h1"><RichText richText={block.heading_1.rich_text} /></h1>;

    case 'heading_2':
      return <h2 className="notion-h2"><RichText richText={block.heading_2.rich_text} /></h2>;

    case 'heading_3':
      return <h3 className="notion-h3"><RichText richText={block.heading_3.rich_text} /></h3>;

    case 'code':
      return (
        <div className="notion-code-wrapper">
          {block.code.language && block.code.language !== 'plain text' && (
            <span className="notion-code-lang">{block.code.language}</span>
          )}
          <pre className="notion-code"><code>{block.code.rich_text.map((t) => t.plain_text).join('')}</code></pre>
        </div>
      );

    case 'bulleted_list_item':
      return <li className="notion-li"><RichText richText={block.bulleted_list_item.rich_text} /></li>;

    case 'numbered_list_item':
      return <li className="notion-li"><RichText richText={block.numbered_list_item.rich_text} /></li>;

    case 'quote':
      return <blockquote className="notion-quote"><RichText richText={block.quote.rich_text} /></blockquote>;

    case 'callout':
      return (
        <div className="notion-callout">
          {block.callout.icon?.emoji && <span className="notion-callout-icon">{block.callout.icon.emoji}</span>}
          <div><RichText richText={block.callout.rich_text} /></div>
        </div>
      );

    case 'divider':
      return <hr className="notion-divider" />;

    case 'toggle':
      return (
        <details className="notion-toggle">
          <summary><RichText richText={block.toggle.rich_text} /></summary>
        </details>
      );

    default:
      return null;
  }
}

function groupBlocks(blocks) {
  const groups = [];
  let i = 0;

  while (i < blocks.length) {
    if (blocks[i].type === 'bulleted_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blocks[i]);
        i++;
      }
      groups.push({ type: '_bulleted_list', items, id: items[0].id });
    } else if (blocks[i].type === 'numbered_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blocks[i]);
        i++;
      }
      groups.push({ type: '_numbered_list', items, id: items[0].id });
    } else {
      groups.push(blocks[i]);
      i++;
    }
  }

  return groups;
}

export default function NotionRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  const grouped = groupBlocks(blocks);

  return (
    <div className="notion-renderer">
      {grouped.map((group) => {
        if (group.type === '_bulleted_list') {
          return (
            <ul key={group.id} className="notion-ul">
              {group.items.map((block) => <Block key={block.id} block={block} />)}
            </ul>
          );
        }
        if (group.type === '_numbered_list') {
          return (
            <ol key={group.id} className="notion-ol">
              {group.items.map((block) => <Block key={block.id} block={block} />)}
            </ol>
          );
        }
        return <Block key={group.id} block={group} />;
      })}
    </div>
  );
}
