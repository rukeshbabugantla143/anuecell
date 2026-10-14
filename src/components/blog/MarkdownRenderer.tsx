import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  // Process markdown into structured blocks
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let currentListItems: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const flushList = () => {
    if (currentListItems.length > 0 && listType) {
      if (listType === 'ul') {
        blocks.push(
          <ul key={`list-${blocks.length}`} className="my-4 space-y-2 pl-6 list-disc marker:text-primary-cyan text-secondary-text">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        )
      } else {
        blocks.push(
          <ol key={`list-${blocks.length}`} className="my-4 space-y-2 pl-6 list-decimal marker:text-primary-cyan text-secondary-text">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ol>
        )
      }
      currentListItems = []
      listType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList()
      blocks.push(
        <h3 key={i} className="text-xl sm:text-2xl font-heading font-bold text-primary-text mt-8 mb-3 tracking-tight">
          {renderInlineFormatting(trimmed.substring(4))}
        </h3>
      )
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushList()
      blocks.push(
        <h2 key={i} className="text-2xl sm:text-3xl font-heading font-bold text-primary-text mt-10 mb-4 border-b border-border-color/60 pb-2.5 tracking-tight">
          {renderInlineFormatting(trimmed.substring(3))}
        </h2>
      )
      continue
    }
    if (trimmed.startsWith('# ')) {
      flushList()
      blocks.push(
        <h1 key={i} className="text-3xl sm:text-4xl font-heading font-black text-primary-text mt-12 mb-5 tracking-tight">
          {renderInlineFormatting(trimmed.substring(2))}
        </h1>
      )
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList()
      blocks.push(
        <blockquote
          key={i}
          className="my-6 border-l-4 border-primary-cyan bg-[#151F30]/60 p-4 sm:p-5 rounded-r-xl text-primary-text italic font-medium shadow-sm"
        >
          {renderInlineFormatting(trimmed.substring(2))}
        </blockquote>
      )
      continue
    }

    // Unordered List item (- or * or •)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (listType !== 'ul') flushList()
      listType = 'ul'
      currentListItems.push(trimmed.substring(2))
      continue
    }

    // Ordered List item (1. 2.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (olMatch) {
      if (listType !== 'ol') flushList()
      listType = 'ol'
      currentListItems.push(olMatch[2])
      continue
    }

    // Markdown Table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList()
      // Collect all consecutive table rows
      const tableRows: string[] = [trimmed]
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
        i++
        tableRows.push(lines[i].trim())
      }

      if (tableRows.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())

        const headerCells = parseRow(tableRows[0])
        // Filter out separator row (e.g., |---|---|)
        const bodyRows = tableRows.slice(1).filter((r) => !r.match(/^\|(\s*:?-+:?\s*\|)+$/))

        blocks.push(
          <div key={`table-${blocks.length}`} className="my-6 overflow-x-auto rounded-xl border border-border-color bg-[#0f1522]">
            <table className="w-full text-left text-sm whitespace-normal">
              <thead className="bg-[#151F30] border-b border-border-color">
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx} className="px-5 py-3.5 font-heading font-bold text-primary-cyan uppercase tracking-wider text-xs">
                      {renderInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/60 bg-[#101827]">
                {bodyRows.map((r, rIdx) => {
                  const cells = parseRow(r)
                  return (
                    <tr key={rIdx} className="hover:bg-[#151F30]/50 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-5 py-3 text-secondary-text leading-relaxed">
                          {renderInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    }

    // Regular paragraph
    flushList()
    blocks.push(
      <p key={i} className="text-secondary-text text-base sm:text-lg leading-relaxed my-4">
        {renderInlineFormatting(trimmed)}
      </p>
    )
  }

  flushList()

  return <div className="space-y-2">{blocks}</div>
}

// Inline formatting helper: **bold**, *italic*, `code`, [link](url)
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex parsing segments
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0

  while (remaining) {
    // 1. Link [label](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/)
    // 2. Bold **bold**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
    // 3. Italic *italic*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/)
    // 4. Code `code`
    const codeMatch = remaining.match(/`(.*?)`/)

    const candidates = [
      linkMatch && typeof linkMatch.index === 'number' ? { type: 'link', match: linkMatch, index: linkMatch.index } : null,
      boldMatch && typeof boldMatch.index === 'number' ? { type: 'bold', match: boldMatch, index: boldMatch.index } : null,
      italicMatch && typeof italicMatch.index === 'number' ? { type: 'italic', match: italicMatch, index: italicMatch.index } : null,
      codeMatch && typeof codeMatch.index === 'number' ? { type: 'code', match: codeMatch, index: codeMatch.index } : null,
    ].filter((c): c is { type: string; match: RegExpMatchArray; index: number } => Boolean(c))

    candidates.sort((a, b) => a.index - b.index)
    const earliest = candidates[0] || null

    if (!earliest) {
      parts.push(remaining)
      break
    }

    // Push text before match
    if (earliest.index > 0) {
      parts.push(remaining.substring(0, earliest.index))
    }

    // Push formatted element
    if (earliest.type === 'link') {
      const [, label, url] = earliest.match
      parts.push(
        <a
          key={`inline-${keyIdx++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-cyan underline underline-offset-4 hover:brightness-125 transition-all font-semibold"
        >
          {label}
        </a>
      )
    } else if (earliest.type === 'bold') {
      parts.push(
        <strong key={`inline-${keyIdx++}`} className="font-bold text-primary-text">
          {earliest.match[1]}
        </strong>
      )
    } else if (earliest.type === 'italic') {
      parts.push(
        <em key={`inline-${keyIdx++}`} className="italic text-primary-text/90">
          {earliest.match[1]}
        </em>
      )
    } else if (earliest.type === 'code') {
      parts.push(
        <code
          key={`inline-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded bg-[#1A2639] text-primary-cyan font-mono text-xs border border-border-color"
        >
          {earliest.match[1]}
        </code>
      )
    }

    remaining = remaining.substring(earliest.index + earliest.match[0].length)
  }

  return parts
}
