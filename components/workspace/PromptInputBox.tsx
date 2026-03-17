'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ArrowUp, Paperclip, Square, X, StopCircle, Mic,
  Globe, BrainCog, FolderCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Textarea ────────────────────────────────────────────────────────────────
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    className={cn(
      'prompt-textarea flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:outline-none resize-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip       = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-[#333] bg-[#1F2023] px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ─── Dialog ───────────────────────────────────────────────────────────────────
const Dialog        = DialogPrimitive.Root;
const DialogPortal  = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-[90vw] md:max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#333] bg-[#1F2023] shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-all">
        <X className="h-5 w-5 text-gray-200" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-gray-100', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'icon';
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-white hover:bg-white/80 text-black',
        variant === 'ghost'   && 'bg-transparent hover:bg-white/10',
        size === 'icon'       && 'h-8 w-8 rounded-full',
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

// ─── VoiceRecorder ────────────────────────────────────────────────────────────
const VoiceRecorder: React.FC<{
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}> = ({ isRecording, onStartRecording, onStopRecording, visualizerBars = 32 }) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      onStopRecording(time);
      setTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={cn('flex flex-col items-center w-full transition-all duration-300 py-3', isRecording ? 'opacity-100' : 'opacity-0 h-0')}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-white/80">{fmt(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-white/50 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── ImageViewDialog ──────────────────────────────────────────────────────────
const ImageViewDialog: React.FC<{ imageUrl: string | null; onClose: () => void }> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-[#1F2023] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={imageUrl} alt="Full preview" className="w-full max-h-[80vh] object-contain rounded-2xl" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// ─── PromptInput context & primitives ─────────────────────────────────────────
interface PromptInputCtx {
  isLoading: boolean;
  value: string;
  setValue: (v: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputCtx>({
  isLoading: false, value: '', setValue: () => {}, maxHeight: 240,
});
const usePromptInput = () => React.useContext(PromptInputContext);

const PromptInput = React.forwardRef<HTMLDivElement, {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (v: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}>(({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false, onDragOver, onDragLeave, onDrop }, ref) => {
  const [internal, setInternal] = React.useState(value || '');
  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={{ isLoading, value: value ?? internal, setValue: onValueChange ?? setInternal, maxHeight, onSubmit, disabled }}>
        <div
          ref={ref}
          className={cn('rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300', isLoading && 'border-red-500/50', className)}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
});
PromptInput.displayName = 'PromptInput';

const PromptInputTextarea: React.FC<{ disableAutosize?: boolean; placeholder?: string } & React.ComponentProps<typeof Textarea>> = ({
  className, onKeyDown, disableAutosize = false, placeholder, ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = typeof maxHeight === 'number'
      ? `${Math.min(ref.current.scrollHeight, maxHeight)}px`
      : `min(${ref.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit?.(); }
        onKeyDown?.(e);
      }}
      className={cn('min-h-[36px]', className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('flex items-center gap-2', className)} {...props}>{children}</div>
);

const PromptInputAction: React.FC<{
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ tooltip, children, side = 'top' }) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip>
      <TooltipTrigger asChild disabled={disabled}>{children}</TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────
const CustomDivider = () => (
  <div className="relative h-6 w-px mx-1 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
);

// ─── Main PromptInputBox ───────────────────────────────────────────────────────
export const PromptInputBox = React.forwardRef<HTMLDivElement, {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}>((props, ref) => {
  const { onSend = () => {}, isLoading = false, placeholder = 'Describe the music you want to create...', className } = props;

  const [input, setInput] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showThink, setShowThink] = React.useState(false);
  const [showCanvas, setShowCanvas] = React.useState(false);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const boxRef    = React.useRef<HTMLDivElement>(null);

  const isImageFile = (f: File) => f.type.startsWith('image/');

  const processFile = (file: File) => {
    if (!isImageFile(file) || file.size > 10 * 1024 * 1024) return;
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDragOver  = React.useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragLeave = React.useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop      = React.useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const imgs = Array.from(e.dataTransfer.files).filter(isImageFile);
    if (imgs.length) processFile(imgs[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = React.useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const f = items[i].getAsFile();
        if (f) { e.preventDefault(); processFile(f); break; }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleSubmit = () => {
    if (!input.trim() && !files.length) return;
    const prefix = showSearch ? '[Search: ' : showThink ? '[Think: ' : showCanvas ? '[Canvas: ' : '';
    onSend(prefix ? `${prefix}${input}]` : input, files);
    setInput(''); setFiles([]); setFilePreviews({});
  };

  const hasContent = input.trim() !== '' || files.length > 0;

  return (
    <>
      <PromptInput
        ref={ref ?? boxRef}
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        disabled={isLoading || isRecording}
        className={cn('w-full', isRecording && 'border-red-500/50', className)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* File previews */}
        {files.length > 0 && !isRecording && (
          <div className="flex flex-wrap gap-2 pb-2">
            {files.map((file, i) => filePreviews[file.name] && (
              <div key={i} className="relative group w-14 h-14 rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedImage(filePreviews[file.name])}>
                <img src={filePreviews[file.name]} alt={file.name} className="h-full w-full object-cover" />
                <button onClick={(e) => { e.stopPropagation(); setFiles([]); setFilePreviews({}); }} className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5">
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <div className={cn('transition-all duration-300', isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100')}>
          <PromptInputTextarea
            placeholder={
              showSearch ? 'Search the web...' :
              showThink  ? 'Think deeply...'   :
              showCanvas ? 'Create on canvas...' :
              placeholder
            }
          />
        </div>

        {/* Voice recorder */}
        {isRecording && (
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={() => {}}
            onStopRecording={(d) => { setIsRecording(false); onSend(`[Voice message - ${d}s]`, []); }}
          />
        )}

        {/* Actions bar */}
        <PromptInputActions className="justify-between pt-2">
          {/* Left tools */}
          <div className={cn('flex items-center gap-1 transition-opacity duration-300', isRecording ? 'opacity-0 invisible h-0' : 'opacity-100 visible')}>
            <PromptInputAction tooltip="Upload image">
              <button onClick={() => uploadRef.current?.click()} className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" disabled={isRecording}>
                <Paperclip className="h-4 w-4" />
                <input ref={uploadRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); if (e.target) e.target.value = ''; }}
                />
              </button>
            </PromptInputAction>

            <div className="flex items-center">
              {/* Search toggle */}
              <button type="button" onClick={() => { setShowSearch(p => !p); setShowThink(false); }}
                className={cn('rounded-full flex items-center gap-1 px-2 py-1 border h-8 transition-all', showSearch ? 'bg-[#1EAEDB]/15 border-[#1EAEDB] text-[#1EAEDB]' : 'bg-transparent border-transparent text-white/30 hover:text-white/60')}
              >
                <motion.div animate={{ rotate: showSearch ? 360 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }}>
                  <Globe className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="text-xs overflow-hidden whitespace-nowrap">
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <CustomDivider />

              {/* Think toggle */}
              <button type="button" onClick={() => { setShowThink(p => !p); setShowSearch(false); }}
                className={cn('rounded-full flex items-center gap-1 px-2 py-1 border h-8 transition-all', showThink ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]' : 'bg-transparent border-transparent text-white/30 hover:text-white/60')}
              >
                <motion.div animate={{ rotate: showThink ? 360 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }}>
                  <BrainCog className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {showThink && (
                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="text-xs overflow-hidden whitespace-nowrap">
                      Think
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <CustomDivider />

              {/* Canvas toggle */}
              <button type="button" onClick={() => setShowCanvas(p => !p)}
                className={cn('rounded-full flex items-center gap-1 px-2 py-1 border h-8 transition-all', showCanvas ? 'bg-[#F97316]/15 border-[#F97316] text-[#F97316]' : 'bg-transparent border-transparent text-white/30 hover:text-white/60')}
              >
                <motion.div animate={{ rotate: showCanvas ? 360 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }}>
                  <FolderCode className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {showCanvas && (
                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="text-xs overflow-hidden whitespace-nowrap">
                      Canvas
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Send / mic button */}
          <PromptInputAction tooltip={isLoading ? 'Stop' : isRecording ? 'Stop recording' : hasContent ? 'Send' : 'Voice'}>
            <Button
              variant={hasContent && !isRecording ? 'default' : 'ghost'}
              size="icon"
              className={cn('h-8 w-8 transition-all duration-200', isRecording && 'text-red-500 hover:text-red-400')}
              onClick={() => { if (isRecording) setIsRecording(false); else if (hasContent) handleSubmit(); else setIsRecording(true); }}
              disabled={isLoading && !hasContent}
            >
              {isLoading    ? <Square className="h-4 w-4 fill-current animate-pulse" /> :
               isRecording  ? <StopCircle className="h-5 w-5 text-red-500" /> :
               hasContent   ? <ArrowUp className="h-4 w-4" /> :
               <Mic className="h-4 w-4 text-white/40" />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
});
PromptInputBox.displayName = 'PromptInputBox';
