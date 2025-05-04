// tour-guide.js

(function () {
  const steps = [
    { el: '#language', msg: 'اختر اللغة التي تفضلها.' },
    { el: '#server', msg: 'اختر السيرفر الذي تلعب فيه.' },
    { el: '#event', msg: 'حدد الحدث لعرض ترتيبه.' },
    { el: '#mode', msg: 'اختر ترتيب فردي أو تحالف.' },
    { el: '#gameFrame', msg: 'اضغط هنا للدخول للعبة بدون إعلانات مزعجة.' }
  ];

  let tooltipDiv;

  function createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tooltip-tour {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.85);
        color: #E3B21C;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 14px;
        max-width: 250px;
        z-index: 2000;
        transition: top 0.5s, left 0.5s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }

      .tour-restart-btn {
        position: fixed;
        bottom: 100px;
        right: 20px;
        background-color: black;
        color: #E3B21C;
        border: 2px solid #E3B21C;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1001;
      }
    `;
    document.head.appendChild(style);
  }

  function startTour(force = false) {
    if (localStorage.getItem('tourShown') && !force) return;
    localStorage.setItem('tourShown', 'true');

    let i = 0;

    if (!tooltipDiv) {
      tooltipDiv = document.createElement('div');
      tooltipDiv.className = 'tooltip-tour';
      document.body.appendChild(tooltipDiv);
    }

    function nextStep() {
      if (i >= steps.length) {
        tooltipDiv.remove();
        return;
      }

      const step = steps[i];
      const target = document.querySelector(step.el);
      if (!target) {
        i++;
        nextStep();
        return;
      }

      const rect = target.getBoundingClientRect();
      tooltipDiv.textContent = step.msg;
      tooltipDiv.style.top = `${rect.top + window.scrollY - 50}px`;
      tooltipDiv.style.left = `${rect.left + window.scrollX}px`;

      i++;
      setTimeout(nextStep, 4000); // 4 ثوانٍ لكل عنصر
    }

    nextStep();
  }

  function createRestartButton() {
    const btn = document.createElement('div');
    btn.className = 'tour-restart-btn';
    btn.title = 'إعادة الشرح';
    btn.textContent = '🔁';
    btn.onclick = () => startTour(true);
    document.body.appendChild(btn);
  }

  window.addEventListener('load', () => {
    createStyles();
    createRestartButton();
    setTimeout(() => startTour(), 1000);
  });
})();
