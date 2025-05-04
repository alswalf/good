(function () {
  const steps = [
    { el: '#language', msg: 'اختر اللغة التي تفضلها.' },
    { el: '#server', msg: 'اختر السيرفر الذي تلعب فيه.' },
    { el: '#event', msg: 'حدد الحدث لعرض ترتيبه.' },
    { el: '#mode', msg: 'اختر ترتيب فردي أو تحالف.' },
    { el: '#gameFrame', msg: 'اضغط هنا للدخول للعبة بدون إعلانات مزعجة.' }
  ];

  let tooltipDiv;

  function allElementsExist() {
    return steps.every(step => document.querySelector(step.el));
  }

  function waitForElements(callback) {
    const interval = setInterval(() => {
      if (allElementsExist()) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  }

  window.startTour = function (force = false) {
    console.log("تشغيل الشرح التفاعلي...");
    if (localStorage.getItem('tourShown') && !force) {
      console.log("تم عرض الشرح مسبقًا. لن يُعرض مجددًا.");
      return;
    }

    localStorage.setItem('tourShown', 'true');

    let i = 0;
    tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'tooltip-tour';
    document.body.appendChild(tooltipDiv);

    function nextStep() {
      if (i >= steps.length) {
        tooltipDiv.remove();
        return;
      }

      const step = steps[i];
      const target = document.querySelector(step.el);
      if (!target) {
        i++;
        setTimeout(nextStep, 4000);
        return;
      }

      const rect = target.getBoundingClientRect();
      tooltipDiv.textContent = step.msg;
      tooltipDiv.style.top = `${rect.top + window.scrollY - 50}px`;
      tooltipDiv.style.left = `${rect.left + window.scrollX}px`;
      tooltipDiv.style.display = 'block';

      i++;
      setTimeout(nextStep, 4000);
    }

    waitForElements(() => {
      nextStep();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    startTour();
  });
})();
