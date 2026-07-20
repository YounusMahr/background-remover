/**
 * Image Comparison Slider Controller
 */

export function initComparisonSlider(containerEl) {
  if (!containerEl) return;

  const overlay = containerEl.querySelector('.slider-overlay');
  const handle = containerEl.querySelector('.slider-handle');
  if (!overlay || !handle) return;

  let isDragging = false;

  const updateSliderPos = (clientX) => {
    const rect = containerEl.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  const onStart = (e) => {
    isDragging = true;
    updateSliderPos(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    updateSliderPos(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onEnd = () => {
    isDragging = false;
  };

  handle.addEventListener('mousedown', onStart);
  handle.addEventListener('touchstart', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove);
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
}
