'use client'

import React, { useState, useRef } from 'react'
import { Bold, Italic, Heading2, List, ListOrdered, Link as LinkIcon, Quote, Eye, Edit3 } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write event description...',
  minHeight = '220px',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const replacement = `${before}${selectedText || 'text'}${after}`

    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + (selectedText ? selectedText.length : 4)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  return (
    <div className="rounded-xl border border-border-color bg-[#101827] overflow-hidden focus-within:border-primary-cyan/70 transition-colors shadow-inner">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-border-color bg-elevated-surface/80 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormat('**', '**')}
            title="Bold"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('*', '*')}
            title="Italic"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('### ')}
            title="Heading"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <div className="h-4 w-[1px] bg-border-color mx-1" />
          <button
            type="button"
            onClick={() => insertLinePrefix('• ')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('1. ')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('> ')}
            title="Quote"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('[', '](https://)')}
            title="Add Link"
            className="p-1.5 rounded hover:bg-main-bg text-secondary-text hover:text-primary-cyan transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-main-bg/80 p-0.5 rounded-lg border border-border-color text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'write'
                ? 'bg-primary-cyan text-main-bg font-bold shadow-sm'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-primary-cyan text-main-bg font-bold shadow-sm'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full bg-[#151F30] p-4 text-sm text-primary-text placeholder-muted-text/70 focus:outline-none resize-y leading-relaxed font-sans"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="w-full bg-[#151F30] p-4 text-sm text-primary-text leading-relaxed whitespace-pre-wrap overflow-y-auto"
        >
          {value.trim() ? (
            value
          ) : (
            <span className="text-muted-text italic">No content to preview yet. Switch to "Write" to add details.</span>
          )}
        </div>
      )}
    </div>
  )
}
