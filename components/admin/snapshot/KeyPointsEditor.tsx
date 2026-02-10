"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type KeyPointsEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  "data-testid"?: string;
};

const emptyContent = "<p></p>";

export function KeyPointsEditor({
  value,
  onChange,
  disabled = false,
}: KeyPointsEditorProps) {
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: value?.trim() || emptyContent,
      editable: !disabled,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange(html === emptyContent ? "" : html);
      },
      editorProps: {
        attributes: {
          class:
            "min-h-[120px] w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-[color:var(--nsi-ink)] focus-within:border-[color:var(--nsi-green)] focus-within:outline-none focus-within:ring-1 focus-within:ring-[color:var(--nsi-green)] prose prose-sm max-w-none",
        },
      },
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value?.trim() || emptyContent;
    if (next !== current) {
      editor.commands.setContent(next, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="key-points-editor">
      <EditorContent editor={editor} />
    </div>
  );
}
