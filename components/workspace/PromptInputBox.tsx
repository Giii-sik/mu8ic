'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ArrowUp, X, Music, Clock, Layers, Zap,
} from 'lucide-react';
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
        'fixed left-1/2 top-1/2 z-50 w-full max-w-[90vw] md:max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#333] bg-[#1F2023] shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
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
}>(({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false }, ref) => {
  const [internal, setInternal] = React.useState(value || '');
  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={{ isLoading, value: value ?? internal, setValue: onValueChange ?? setInternal, maxHeight, onSubmit, disabled }}>
        <div
          ref={ref}
          className={cn('rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300', isLoading && 'border-red-500/50', className)}
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

// ─── Credit cost helpers ───────────────────────────────────────────────────────
function calcCost(duration: number, batchSize: number): number {
  const durationExtra = duration === 120 ? 1 : duration === 180 ? 2 : 0;
  const batchExtra = batchSize - 1;
  return 1 + durationExtra + batchExtra;
}

const CreditBadge = ({ extra }: { extra: number }) =>
  extra > 0 ? (
    <span className="ml-auto text-[10px] text-amber-400/70">+{extra}</span>
  ) : null;

// ─── Main PromptInputBox ───────────────────────────────────────────────────────
export const PromptInputBox = React.forwardRef<HTMLDivElement, {
  onSend?: (message: string, options: { lyrics: string; duration: number; batchSize: number }) => void;
  onInsufficientCredits?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  credits?: number;
}>((props, ref) => {
  const {
    onSend = () => {},
    onInsufficientCredits,
    isLoading = false,
    placeholder = 'Describe the music you want to create...',
    className,
    credits = 0,
  } = props;

  const [input, setInput] = React.useState('');
  const [lyrics, setLyrics] = React.useState('');
  const [duration, setDuration] = React.useState(60);
  const [batchSize, setBatchSize] = React.useState(1);
  const [showDurationPopover, setShowDurationPopover] = React.useState(false);
  const [showBatchPopover, setShowBatchPopover] = React.useState(false);
  const [showLyricsModal, setShowLyricsModal] = React.useState(false);
  const [lyricsInput, setLyricsInput] = React.useState('');

  const boxRef = React.useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  React.useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      if (boxRef.current && !boxRef.current.contains(target)) {
        setShowDurationPopover(false);
        setShowBatchPopover(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const totalCost = calcCost(duration, batchSize);
  const notEnoughCredits = credits < totalCost;

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (notEnoughCredits) { onInsufficientCredits?.(); return; }
    onSend(input, { lyrics, duration, batchSize });
    setInput('');
  };

  const hasContent = input.trim() !== '';

  const durationLabel = (d: number) => {
    if (d === 60) return '1 min';
    if (d === 120) return '2 min';
    if (d === 180) return '3 min';
    return `${d}s`;
  };

  const durationExtra = (d: number) => (d === 120 ? 1 : d === 180 ? 2 : 0);
  const batchExtra = (b: number) => b - 1;

  return (
    <>
      <PromptInput
        ref={ref ?? boxRef}
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        disabled={isLoading}
        className={cn('w-full', className)}
      >
        {/* Textarea */}
        <PromptInputTextarea placeholder={placeholder} />

        {/* Actions bar */}
        <PromptInputActions className="justify-between pt-2">
          {/* Left tools */}
          <div className="flex items-center gap-1" ref={boxRef}>

            {/* Lyrics button */}
            <PromptInputAction tooltip="Set lyrics (leave empty for instrumental)">
              <button
                type="button"
                onClick={() => { setLyricsInput(lyrics); setShowLyricsModal(true); }}
                className={cn(
                  'rounded-full flex items-center gap-1.5 px-2 py-1 border h-8 transition-all text-xs',
                  lyrics
                    ? 'bg-white/5 border-white/20 text-white/70'
                    : 'bg-transparent border-transparent text-white/30 hover:text-white/60',
                )}
              >
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">{lyrics ? 'Lyrics ✓' : 'Lyrics'}</span>
              </button>
            </PromptInputAction>

            <CustomDivider />

            {/* Duration button */}
            <div className="relative">
              <PromptInputAction tooltip="Set duration">
                <button
                  type="button"
                  onClick={() => { setShowDurationPopover((p) => !p); setShowBatchPopover(false); }}
                  className={cn(
                    'rounded-full flex items-center gap-1.5 px-2 py-1 border h-8 transition-all text-xs',
                    duration !== 60
                      ? 'bg-white/5 border-white/20 text-white/70'
                      : 'bg-transparent border-transparent text-white/30 hover:text-white/60',
                  )}
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">{durationLabel(duration)}</span>
                </button>
              </PromptInputAction>

              {showDurationPopover && (
                <div className="absolute bottom-full left-0 mb-2 z-50 rounded-lg border border-[#333] bg-[#1a1a1a] shadow-xl py-1 min-w-[130px]">
                  {[60, 120, 180].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setDuration(d); setShowDurationPopover(false); }}
                      className={cn(
                        'flex w-full items-center px-3 py-2 text-xs transition-colors hover:bg-white/5',
                        duration === d ? 'text-white/90' : 'text-white/50',
                      )}
                    >
                      <span>{durationLabel(d)}</span>
                      <CreditBadge extra={durationExtra(d)} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <CustomDivider />

            {/* Batch size button */}
            <div className="relative">
              <PromptInputAction tooltip="Number of tracks to generate">
                <button
                  type="button"
                  onClick={() => { setShowBatchPopover((p) => !p); setShowDurationPopover(false); }}
                  className={cn(
                    'rounded-full flex items-center gap-1.5 px-2 py-1 border h-8 transition-all text-xs',
                    batchSize !== 1
                      ? 'bg-white/5 border-white/20 text-white/70'
                      : 'bg-transparent border-transparent text-white/30 hover:text-white/60',
                  )}
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">&times;{batchSize}</span>
                </button>
              </PromptInputAction>

              {showBatchPopover && (
                <div className="absolute bottom-full left-0 mb-2 z-50 rounded-lg border border-[#333] bg-[#1a1a1a] shadow-xl py-1 min-w-[100px]">
                  {[1, 2, 3, 4].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => { setBatchSize(b); setShowBatchPopover(false); }}
                      className={cn(
                        'flex w-full items-center px-3 py-2 text-xs transition-colors hover:bg-white/5',
                        batchSize === b ? 'text-white/90' : 'text-white/50',
                      )}
                    >
                      <span>&times;{b}</span>
                      <CreditBadge extra={batchExtra(b)} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: cost indicator + send button */}
          <div className="flex items-center gap-2">
            {/* Credit cost */}
            <div className={cn(
              'flex items-center gap-1 text-[11px] tabular-nums transition-colors',
              notEnoughCredits ? 'text-red-400/80' : 'text-white/25',
            )}>
              <Zap className="h-3 w-3" />
              <span>{totalCost}</span>
            </div>

            <PromptInputAction tooltip={
              notEnoughCredits ? 'Not enough credits' : isLoading ? 'Generating...' : 'Send'
            }>
              <Button
                variant={hasContent ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8 transition-all duration-200"
                onClick={handleSubmit}
                disabled={isLoading || !hasContent}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </PromptInputAction>
          </div>
        </PromptInputActions>
      </PromptInput>

      {/* Lyrics Modal */}
      <Dialog open={showLyricsModal} onOpenChange={setShowLyricsModal}>
        <DialogContent className="p-6">
          <DialogTitle>Lyrics</DialogTitle>
          <p className="text-xs text-white/40 mt-1 mb-4">Leave empty for instrumental</p>
          <textarea
            value={lyricsInput}
            onChange={(e) => setLyricsInput(e.target.value)}
            placeholder="Enter lyrics here..."
            rows={8}
            className="w-full rounded-xl border border-[#333] bg-[#141416] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowLyricsModal(false)}
              className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { setLyrics(lyricsInput); setShowLyricsModal(false); }}
              className="px-4 py-2 rounded-lg bg-white/10 text-sm text-white/80 hover:bg-white/15 transition-colors"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
PromptInputBox.displayName = 'PromptInputBox';
