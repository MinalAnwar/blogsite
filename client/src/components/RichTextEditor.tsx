import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading, 
  List, 
  Link, 
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", tooltip: "Bold" },
    { icon: Italic, command: "italic", tooltip: "Italic" },
    { icon: Underline, command: "underline", tooltip: "Underline" },
    { divider: true },
    { icon: Heading, command: "formatBlock", value: "h2", tooltip: "Heading" },
    { icon: List, command: "insertUnorderedList", tooltip: "Bullet List" },
    { icon: Quote, command: "formatBlock", value: "blockquote", tooltip: "Quote" },
    { divider: true },
    { icon: AlignLeft, command: "justifyLeft", tooltip: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", tooltip: "Align Center" },
    { icon: AlignRight, command: "justifyRight", tooltip: "Align Right" },
    { divider: true },
    { icon: Link, command: "createLink", tooltip: "Insert Link" },
    { icon: Image, command: "insertImage", tooltip: "Insert Image" },
    { icon: Code, command: "formatBlock", value: "pre", tooltip: "Code Block" },
  ];

  const handleLinkInsert = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleImageInsert = () => {
    const url = prompt("Enter the image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-3 border-b border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.divider) {
            return <div key={index} className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-2" />;
          }

          const Icon = button.icon!;
          const handleClick = () => {
            if (button.command === "createLink") {
              handleLinkInsert();
            } else if (button.command === "insertImage") {
              handleImageInsert();
            } else {
              execCommand(button.command, button.value);
            }
          };

          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 hover:bg-gray-200 dark:hover:bg-slate-600"
              onClick={handleClick}
              title={button.tooltip}
            >
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className={`p-4 min-h-[200px] bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none ${
            !value && !isEditorFocused ? "text-gray-500 dark:text-gray-400" : ""
          }`}
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          style={{
            lineHeight: "1.6",
          }}
          suppressContentEditableWarning={true}
        />
        {!value && !isEditorFocused && (
          <div className="absolute top-4 left-4 text-gray-500 dark:text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Editor Tips */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Use the toolbar above to format your content. You can also paste content from other sources.
        </p>
      </div>
    </div>
  );
}
