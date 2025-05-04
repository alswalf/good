window.addEventListener('DOMContentLoaded', () => {
  const visitorDisplay = document.getElementById("visitorCount");
  const needle = document.getElementById("needle");

  // توليد رقم زوار عشوائي (قابل للتحديث لاحقًا)
  const targetCount = Math.floor(Math.random() * 100000);
  const maxVisitors = 100000;
  const percent = Math.min(targetCount / maxVisitors, 1);
  const angle = -60 + (120 * percent);

  // تحريك الإبرة
  setTimeout(() => {
    needle.style.transform = `rotate(${angle}deg)`;
  }, 100);

  // عداد تصاعدي للعرض
  let current = 0;
  const step = Math.ceil(targetCount / 100);
  const interval = setInterval(() => {
    current += step;
    if (current >= targetCount) {
      current = targetCount;
      clearInterval(interval);
    }
    visitorDisplay.textContent = current.toString().padStart(5, '0');
  }, 20);
});
