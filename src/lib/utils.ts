export function calculateDialogPosition(
  mouseX: number,
  mouseY: number,
  dialogWidth: number = 256, // w-64 = 256px
  dialogHeight: number = 300, // Approximate height
  windowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200,
  windowHeight: number = typeof window !== 'undefined' ? window.innerHeight : 800
) {
  let x = mouseX;
  let y = mouseY;
  let anchor: 'top' | 'bottom' = 'top';

  // Check horizontal positioning - prefer left side if near right edge
  if (mouseX + dialogWidth > windowWidth - 20) {
    x = mouseX - dialogWidth - 10;
  }

  // Check vertical positioning with better logic
  const spaceAbove = mouseY;
  const spaceBelow = windowHeight - mouseY;
  
  if (spaceAbove >= dialogHeight + 30) {
    // Enough space above - position above cursor
    y = mouseY - dialogHeight - 10;
    anchor = 'top';
  } else if (spaceBelow >= dialogHeight + 30) {
    // Enough space below - position below cursor
    y = mouseY + 10;
    anchor = 'bottom';
  } else {
    // Limited space - position where there's more room
    if (spaceAbove > spaceBelow) {
      y = Math.max(10, mouseY - dialogHeight - 10);
      anchor = 'top';
    } else {
      y = Math.min(windowHeight - dialogHeight - 10, mouseY + 10);
      anchor = 'bottom';
    }
  }

  // Ensure dialog stays within viewport bounds
  x = Math.max(10, Math.min(x, windowWidth - dialogWidth - 10));
  y = Math.max(10, Math.min(y, windowHeight - dialogHeight - 10));

  return { x, y, anchor };
}
