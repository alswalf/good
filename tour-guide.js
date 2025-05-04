(function () {
  const steps = [
    { el: '#language', msg: 'اختر اللغة التي تفضلها.' },
    { el: '#server', msg: 'اختر السيرفر الذي تلعب فيه.' },
    { el: '#event', msg: 'حدد الحدث لعرض ترتيبه.' },
    { el: '#mode', msg: 'اختر ترتيب فردي أو تحالف.' },
    { el: '#gameFrame', msg: 'اضغط هنا للدخول للعبة بدون إعلانات مزعجة.' }
  ];

  let tooltipDiv;

  window.startTour = function (force = false) {
    if (localStorage.getItem('tourShown') && !force) return;

    const waitForElements = () => {
      const allExist = steps.every(step => document.querySelector(step.el));
      if (!allExist) {
        setTimeout(waitForElements, 500); // انتظر حتى تظهر العناصر
      } else {
        localStorage.setItem('tourShown', 'true');
        beginTour();
      }
    };

    const beginTour = () => {
      let i = 0;
      tooltipDiv = document.createElement('div');
      tooltipDiv.className = 'tooltip-tour';
      document.body.appendChild(tooltipDiv);

      const nextStep = () => {
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

        tooltipDiv.innerHTML += '<div class="arrow"></div>';  // السهم

        i++;
        setTimeout(nextStep, 4000); // الانتقال للخطوة التالية بعد 4 ثوان
      };

      waitForElements();
      nextStep();
    };
  };
})();
