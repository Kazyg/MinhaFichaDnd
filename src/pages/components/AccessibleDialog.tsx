import React, { useLayoutEffect, useRef } from 'react';
import '../css/accessibility.css';

type Props = React.HTMLAttributes<HTMLDivElement> & { onClose: () => void };
const focusable = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]';
const stack: HTMLDivElement[] = [];

/** Keeps existing modal layout; owns keyboard, background isolation and focus lifecycle. */
export default function AccessibleDialog({ onClose, children, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useLayoutEffect(() => {
    const dialog = ref.current!;
    const opener = document.activeElement as HTMLElement | null;
    const heading = dialog.querySelector<HTMLElement>('h2, h3');
    const initial = heading || dialog;
    initial.tabIndex = -1;
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusable))
      .filter(el => !el.closest('[hidden], [inert]') && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
    stack.push(dialog);
    initial.focus();
    const isolated: { element: Element; inert: boolean; hidden: string | null }[] = [];
    let branch: Element = dialog;
    while (branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling === branch || ['SCRIPT', 'STYLE'].includes(sibling.tagName)) continue;
        isolated.push({ element: sibling, inert: sibling.hasAttribute('inert'), hidden: sibling.getAttribute('aria-hidden') });
        sibling.setAttribute('inert', '');
        sibling.setAttribute('aria-hidden', 'true');
      }
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
    const active = () => stack[stack.length - 1] === dialog;
    const keydown = (event: KeyboardEvent) => {
      if (!active()) return;
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopPropagation(); close.current();
      }
      if (event.key === 'Tab') {
        const items = controls();
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (!items.length || index < 0 || (event.shiftKey ? index === 0 : index === items.length - 1)) {
          event.preventDefault();
          (items.length ? items[event.shiftKey ? items.length - 1 : 0] : initial).focus();
        }
      }
    };
    const contain = () => {
      if (active() && !dialog.contains(document.activeElement)) initial.focus();
    };
    document.addEventListener('keydown', keydown, true);
    document.addEventListener('focusin', contain);
    // A selected row/filter may disappear without the modal itself unmounting.
    const observer = new MutationObserver(contain);
    observer.observe(dialog, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', keydown, true);
      document.removeEventListener('focusin', contain);
      stack.splice(stack.indexOf(dialog), 1);
      isolated.forEach(({ element, inert, hidden }) => {
        if (!inert) element.removeAttribute('inert');
        if (hidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', hidden);
      });
      if (opener?.isConnected && !opener.closest('[inert]')) opener.focus();
      else {
        // Wait for route/tab replacement to mount its logical destination.
        queueMicrotask(() => {
          if (document.activeElement === document.body) {
            document.querySelector<HTMLElement>('[data-page-focus], button:not(:disabled)')?.focus();
          }
        });
      }
    };
  }, []);
  return <div {...props} ref={ref} role="dialog" aria-modal="true" tabIndex={-1}>{children}</div>;
}
