(() => {
  let flag = 1;
  let lazyScripts = null;
  let counterScripts = 0;

  document.addEventListener('DOMContentLoaded', function () {
    lazyScripts = document.getElementsByTagName('script');

    window.addEventListener('scroll', init);
    window.addEventListener('mousemove', init);
    window.addEventListener('touchstart', init);
    setTimeout(function () {
      init();
    }, 6000);
  });

  function init() {
    if (flag) {
      flag = 0;

      window.removeEventListener('scroll', init);
      window.removeEventListener('mousemove', init);
      window.removeEventListener('touchstart', init);

      typeof asyncVendorsLoad !== 'undefined' && asyncVendorsLoad();

      lazyLoadBgImage();
      lazyLoadIframe();
      load_all_js();
    }
  }

  function lazyLoadBgImage() {
    document.querySelectorAll('[data-bgsrc]').forEach(function (elem) {
      elem.style.backgroundImage = `url(${elem.dataset.bgsrc})`;
    });
  }

  function lazyLoadIframe() {
    document.querySelectorAll('iframe').forEach(function (elem) {
      elem.src = elem.dataset.src || elem.src;
    });
  }

  function load_all_js() {
    setTimeout(function () {
      window.dispatchEvent(new Event('mbc_load'));
    }, 100);

    lazyScripts = document.getElementsByTagName('script');
    lazyLoadScripts();
  }

  function lazyLoadScripts() {
    if (counterScripts === lazyScripts.length) {
      return;
    }

    if (lazyScripts[counterScripts].getAttribute('type') === 'lazyload.js') {
      lazyScripts[counterScripts].setAttribute('type', 'lazyloaded');

      if (typeof lazyScripts[counterScripts].dataset.src !== 'undefined') {
        const script = document.createElement('script');
        script.src = lazyScripts[counterScripts].dataset.src;
        document.body.appendChild(script);
        script.onload = function () {
          counterScripts++;
          lazyLoadScripts();
        };
      } else {
        const script = document.createElement('script');
        script.innerHTML = lazyScripts[counterScripts].innerHTML;
        document.body.appendChild(script);
        counterScripts++;
        lazyLoadScripts();
      }
    }
    else if(lazyScripts[counterScripts].getAttribute('type') === 'lazyload2.js') {
      lazyScripts[counterScripts].setAttribute('type', 'lazyloaded');

      if (typeof lazyScripts[counterScripts].dataset.src !== 'undefined') {
        const script = document.createElement('script');
        script.src = lazyScripts[counterScripts].dataset.src;
        document.head.appendChild(script);
        script.onload = function () {
          counterScripts++;
          lazyLoadScripts();
        };
      } else {
        const script = document.createElement('script');
        script.innerHTML = lazyScripts[counterScripts].innerHTML;
        document.head.appendChild(script);
        counterScripts++;
        lazyLoadScripts();
      }

    }
    else {
      counterScripts++;
      lazyLoadScripts();
    }
  }
})();
