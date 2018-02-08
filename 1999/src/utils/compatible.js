export function setContentHeight(self) {
  const isIE = /* @cc_on!@ */false || !!document.documentMode;
  if (isIE) {
    console.log(123);
    try {
      // const warp = document.getElementsByClassName('allPageContentWarp')[0].getBoundingClientRect();
      const win = document.documentElement;
      const main = document.getElementById('mainSider');
      const sub = document.getElementById('subSider');
      const ele = document.getElementsByClassName('allPageContent')[0];

      const rect = ele.getBoundingClientRect();

      const eleWidth = rect.width;

      if (eleWidth) {
        const winRect = win.getBoundingClientRect().width;
        const mainRect = (main) ? main.getBoundingClientRect().width : 0;
        const subRect = (sub) ? sub.getBoundingClientRect().width : 0;

        ele.style.height = `${200}px`;
        ele.style.width = `${winRect - mainRect - subRect}px`;
        console.log(winRect - mainRect - subRect);
      }

      console.log(eleWidth);
    } catch (e) {
      setTimeout(self, 300);
    }
  }
}
