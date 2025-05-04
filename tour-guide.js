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

    function beginTour() {
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
          setTimeout(nextStep, 3000);
          return;
        }

        const rect = target.getBoundingClientRect();
        tooltipDiv.textContent = step.msg;
        tooltipDiv.style.position = 'absolute';
        tooltipDiv.style.background = '#333';
        tooltipDiv.style.color = '#fff';
        tooltipDiv.style.padding = '8px 12px';
        tooltipDiv.style.borderRadius = '8px';
        tooltipDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        tooltipDiv.style.zIndex = '9999';
        tooltipDiv.style.top = `${rect.top + window.scrollY - 50}px`;
        tooltipDiv.style.left = `${rect.left + window.scrollX}px`;

        i++;
        setTimeout(nextStep, 4000);
      }

      nextStep();
    }

    waitForElements();
  };
})();
