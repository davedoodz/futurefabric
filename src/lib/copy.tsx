import { createContext, useContext, useEffect, useState, type ElementType, type FocusEvent, type ReactNode } from "react";

const STORAGE_KEY = "futurefabric-copy";

type CopyValues = Record<string, string>;

interface CopyContextValue {
  copy: CopyValues;
  updateCopy: (key: string, value: string) => void;
  saveCopy: () => void;
}

const CopyContext = createContext<CopyContextValue | null>(null);

export function CopyProvider({ children }: { children: ReactNode }) {
  const [copy, setCopy] = useState<CopyValues>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as CopyValues;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  }, [copy]);

  const updateCopy = (key: string, value: string) => {
    setCopy((current) => ({ ...current, [key]: value }));
  };

  const saveCopy = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  };

  return <CopyContext.Provider value={{ copy, updateCopy, saveCopy }}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  const context = useContext(CopyContext);
  if (!context) throw new Error("useCopy must be used inside CopyProvider");
  return context;
}

interface EditableTextProps {
  copyKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
}

export function EditableText({ copyKey, defaultValue, as: Component = "span", className }: EditableTextProps) {
  const { copy, updateCopy } = useCopy();
  const value = copy[copyKey] ?? defaultValue;

  return (
    <Component
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-copy-key={copyKey}
      onFocus={(event: FocusEvent<HTMLElement>) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(event.currentTarget);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }}
      onBlur={(event: FocusEvent<HTMLElement>) => updateCopy(copyKey, event.currentTarget.textContent ?? "")}
    >
      {value}
    </Component>
  );
}
