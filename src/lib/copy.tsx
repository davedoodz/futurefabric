import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { scheduleSharedLayoutSave } from "./layoutPersistence";

const STORAGE_KEY = "futurefabric-copy";

type CopyValues = Record<string, string>;

interface CopyContextValue {
  copy: CopyValues;
  updateCopy: (key: string, value: string) => void;
  saveCopy: () => void;
  editingEnabled: boolean;
}

const CopyContext = createContext<CopyContextValue | null>(null);

export function CopyProvider({ children, editingEnabled = true }: { children: ReactNode; editingEnabled?: boolean }) {
  const [copy, setCopy] = useState<CopyValues>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as CopyValues;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    scheduleSharedLayoutSave();
  }, [copy]);

  const updateCopy = (key: string, value: string) => {
    setCopy((current) => ({ ...current, [key]: value }));
  };

  const saveCopy = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  };

  return <CopyContext.Provider value={{ copy, updateCopy, saveCopy, editingEnabled }}>{children}</CopyContext.Provider>;
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
  style?: CSSProperties;
}

export function EditableText({ copyKey, defaultValue, as: Component = "span", className, style }: EditableTextProps) {
  const { copy, updateCopy, editingEnabled } = useCopy();
  const value = copy[copyKey] ?? defaultValue;

  return (
    <Component
      className={className}
      style={style}
      contentEditable={editingEnabled ? "plaintext-only" : false}
      suppressContentEditableWarning
      spellCheck={editingEnabled}
      tabIndex={editingEnabled ? 0 : undefined}
      data-copy-key={copyKey}
      onFocus={editingEnabled ? (event: FocusEvent<HTMLElement>) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(event.currentTarget);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } : undefined}
      onPointerDown={editingEnabled ? (event: ReactPointerEvent<HTMLElement>) => {
        event.stopPropagation();
      } : undefined}
      onClick={editingEnabled ? (event: ReactMouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
      } : undefined}
      onBlur={editingEnabled ? (event: FocusEvent<HTMLElement>) => updateCopy(copyKey, event.currentTarget.textContent ?? "") : undefined}
    >
      {value}
    </Component>
  );
}
