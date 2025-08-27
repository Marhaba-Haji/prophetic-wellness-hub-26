import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, ListOrdered } from "lucide-react";

interface SimpleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SimpleContentEditor = ({ value, onChange, disabled }: SimpleContentEditorProps) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setContent(newValue);
    onChange(newValue);
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    handleChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", before: "**", after: "**" },
    { icon: Italic, label: "Italic", before: "*", after: "*" },
    { icon: Link, label: "Link", before: "[", after: "](url)" },
    { icon: List, label: "Bullet List", before: "- ", after: "" },
    { icon: ListOrdered, label: "Numbered List", before: "1. ", after: "" },
  ];

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {formatButtons.map(({ icon: Icon, label, before, after }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText(before, after)}
            disabled={disabled || isPreview}
            title={label}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          disabled={disabled}
          className="text-xs"
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div 
            className="p-4 prose max-w-none min-h-[400px]"
            dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
          />
        ) : (
          <Textarea
            id="content-editor"
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="min-h-[400px] border-0 resize-none focus:ring-0 rounded-none"
            placeholder="Write your blog content here... Use **bold**, *italic*, [link text](url), - for bullet lists, 1. for numbered lists"
          />
        )}
      </div>
    </div>
  );
};

export default SimpleContentEditor;