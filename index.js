/* ============================================================
   清华大学2026博士项目 H5 — 交互逻辑
   ============================================================ */

(function () {
  'use strict';

  /* ── 图片基础路径 ── */
  const IMG  = 'images/每页底/';  // 长图目录

  /* ============================================================
     幻灯片数据（slide 0~11，共 12 张长图）
     对应文件：2_1 ~ 13_1
     ============================================================ */
  const SLIDES = [
    { src: IMG + '2_1_0410_18点.jpg',                              title: '清华经管学院博士项目'          },
    { src: IMG + '3_1_0410_18点.jpg',                              title: '学院概况七大优势'               },
    { src: IMG + '4_1_0410_18点.jpg',                              title: '博士项目教育改革方向'           },
    { src: IMG + '5_1_0410_18点.jpg',                              title: '（过渡页）'                    },
    { src: IMG + '6_专业1（会计学）_1_0410_18点.jpg',              title: '会计学'                        },
    { src: IMG + '7_专业2（理论经济学与应用经济学）_1_0410_18点.jpg', title: '理论经济学与应用经济学'     },
    { src: IMG + '8_专业3（金融学）_1_0410_18点.jpg',              title: '金融学'                        },
    { src: IMG + '9_专业4（领导力与组织管理）_1_0410_18点.jpg',    title: '领导力与组织管理'              },
    { src: IMG + '10_专业5（创新创业与战略）_1_0410_18点.jpg',     title: '创新创业与战略'                },
    { src: IMG + '11_专业6（管理科学与工程）_1_0410_18点.jpg',     title: '管理科学与工程'                },
    { src: IMG + '12_专业7（市场营销）_1_0410_18点.jpg',           title: '市场营销'                      },
    { src: IMG + '13_1_0410_18点.jpg',                             title: '综合考核'                      },
  ];

  /* ============================================================
     目录菜单结构
     type:'item'  → 可点击，对应 SLIDES[slideIndex]
     type:'group' → 分组标题（不可点击），含 children
     ============================================================ */
  const MENU = [
    { type: 'item',  label: '清华大学经济管理学院<br>2026博士项目申报指南',   slideIndex: 0 },
    { type: 'item',  label: '清华经管学院博士项目',   slideIndex: 1 },
    { type: 'item',  label: '学院概况七大优势',        slideIndex: 2 },
    { type: 'item',  label: '博士项目教育改革方向',    slideIndex: 3 },
    {
      type: 'group',
      label: '博士项目7个专业报考方向',
      children: [
        { label: '会计学',               slideIndex: 4  },
        { label: '理论经济学与应用经济学', slideIndex: 5  },
        { label: '金融学',               slideIndex: 6  },
        { label: '领导力与组织管理',      slideIndex: 7  },
        { label: '创新创业与战略',        slideIndex: 8  },
        { label: '管理科学与工程',        slideIndex: 9  },
        { label: '市场营销',             slideIndex: 10 },
      ],
    },
    { type: 'item',  label: '综合考核',               slideIndex: 11 },
  ];

  /* ============================================================
     全局状态
     ============================================================ */
  let appPage    = 0;   // 0=封面  1=轮播  2=尾页
  let slideIndex = 0;
  const TOTAL_SLIDES = SLIDES.length;

  /* ============================================================
     DOM 引用
     ============================================================ */
  const app         = document.getElementById('app');
  const wrapper     = document.getElementById('slidesWrapper');
  const btnPrev     = document.getElementById('btnPrev');
  const btnNext     = document.getElementById('btnNext');
  const menuBtn     = document.getElementById('menuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuPanel   = document.getElementById('menuPanel');
  const menuClose   = document.getElementById('menuClose');
  const menuList    = document.getElementById('menuList');

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    buildSlides();
    buildMenu();
    goToAppPage(0, false);
    bindEvents();
  }

  /* ------ 动态生成 slide 节点 ------ */
  function buildSlides() {
    wrapper.innerHTML = '';
    SLIDES.forEach((data, i) => {
      const div = document.createElement('div');
      div.className     = 'slide';
      div.dataset.index = i;

      // 内容容器（长图 + 按钮）
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'slide-content-wrapper';

      // 长图
      const img = document.createElement('img');
      img.className = 'slide-img';
      img.alt = data.title;
      img.src = data.src;
      img.onerror = function () {
        this.onerror = null;
        this.src = `https://picsum.photos/seed/slide${i + 1}/750/2400`;
      };

      // 立即申请按钮（图片）
      const applyBtn = document.createElement('a');
      applyBtn.className = 'apply-btn';
      applyBtn.href = 'https://yzbm.tsinghua.edu.cn/index';
      const applyImg = document.createElement('img');
      applyImg.src = 'images/立即申请_0410_18点.png';
      applyImg.alt = '立即申请';
      applyImg.className = 'apply-btn-img';
      applyBtn.appendChild(applyImg);
      applyBtn.addEventListener('click', e => e.preventDefault());

      contentWrapper.appendChild(img);
      contentWrapper.appendChild(applyBtn);
      div.appendChild(contentWrapper);
      wrapper.appendChild(div);
    });
  }

  /* ------ 生成两级目录列表 ------ */
  function buildMenu() {
    menuList.innerHTML = '';
    MENU.forEach(entry => {
      if (entry.type === 'item') {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.dataset.slideIndex = entry.slideIndex;
        li.innerHTML = `<span class="menu-item-text">${entry.label}</span>`;
        li.addEventListener('click', () => { goToSlide(entry.slideIndex); closeMenu(); });
        menuList.appendChild(li);

      } else if (entry.type === 'group') {
        // 分组标题（不可点击）
        const header = document.createElement('li');
        header.className = 'menu-group-header';
        header.innerHTML = `<span class="menu-group-title">${entry.label}</span>`;
        menuList.appendChild(header);

        // 子菜单项
        entry.children.forEach(child => {
          const sub = document.createElement('li');
          sub.className = 'menu-sub-item';
          sub.dataset.slideIndex = child.slideIndex;
          sub.innerHTML = `
            <span class="menu-sub-dot">•</span>
            <span class="menu-sub-text">${child.label}</span>
          `;
          sub.addEventListener('click', () => { goToSlide(child.slideIndex); closeMenu(); });
          menuList.appendChild(sub);
        });
      }
    });
  }

  /* ============================================================
     应用级页面切换（cover ↔ slides ↔ ending）
     ============================================================ */
  function goToAppPage(index, animate) {
    if (animate === undefined) animate = true;
    appPage = index;

    app.style.transition = animate ? '' : 'none';
    app.style.transform  = `translateX(${-index * 100}vw)`;

    // 左右翻页箭头始终显示，目录按钮仅轮播页显示
    document.body.classList.toggle('hide-nav',     false);
    document.body.classList.toggle('hide-logo-bar', index === 1);
    menuBtn.style.opacity = index === 1 ? '1' : '0';
    menuBtn.style.pointerEvents = index === 1 ? 'auto' : 'none';

    updateNavBtns();

    if (!animate) { void app.offsetWidth; }
  }

  /* ============================================================
     幻灯片翻页
     ============================================================ */
  function goToSlide(index, skipScroll) {
    slideIndex = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));

    if (!skipScroll) {
      const cur = wrapper.querySelectorAll('.slide')[slideIndex];
      if (cur) cur.scrollTop = 0;
    }

    wrapper.style.transform = `translateX(${-slideIndex * 100}vw)`;
    updateNavBtns();
    updateMenuActive();
  }

  function updateNavBtns() {
    btnPrev.classList.remove('disabled');
    btnNext.classList.remove('disabled');
  }

  function updateMenuActive() {
    menuList.querySelectorAll('.menu-item, .menu-sub-item').forEach(el => {
      el.classList.toggle('active-item', Number(el.dataset.slideIndex) === slideIndex);
    });
  }

  /* ============================================================
     目录面板
     ============================================================ */
  function openMenu() {
    menuOverlay.classList.add('open');
    menuPanel.classList.add('open');
    const active = menuList.querySelector('.active-item');
    if (active) {
      setTimeout(() => active.scrollIntoView({ block: 'center', behavior: 'smooth' }), 200);
    }
  }

  function closeMenu() {
    menuOverlay.classList.remove('open');
    menuPanel.classList.remove('open');
  }

  /* ============================================================
     前进 / 后退
     ============================================================ */
  function handleForward() {
    if (appPage === 0) {
      goToAppPage(1); goToSlide(0);
    } else if (appPage === 1) {
      if (slideIndex < TOTAL_SLIDES - 1) {
        goToSlide(slideIndex + 1);
      } else {
        goToAppPage(2);
      }
    }
  }

  function handleBackward() {
    if (appPage === 2) {
      goToAppPage(1); goToSlide(TOTAL_SLIDES - 1, true);
    } else if (appPage === 1) {
      if (slideIndex > 0) {
        goToSlide(slideIndex - 1);
      } else {
        goToAppPage(0);
      }
    }
  }

  /* ============================================================
     手势识别
     ============================================================ */
  let touchStartX    = 0;
  let touchStartY    = 0;
  let touchStartTime = 0;
  let isDraggingH    = false;
  let isScrollingV   = false;
  let gestureDecided = false;

  function onTouchStart(e) {
    if (menuPanel.classList.contains('open')) return;
    const t = e.touches ? e.touches[0] : e;
    touchStartX = t.clientX; touchStartY = t.clientY;
    touchStartTime = Date.now();
    isDraggingH = isScrollingV = gestureDecided = false;
  }

  function onTouchMove(e) {
    if (menuPanel.classList.contains('open')) return;
    const t  = e.touches ? e.touches[0] : e;
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (!gestureDecided && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      gestureDecided = true;
      isDraggingH    = Math.abs(dx) > Math.abs(dy);
      isScrollingV   = !isDraggingH;
    }
    if (isDraggingH) e.preventDefault();
  }

  function onTouchEnd(e) {
    if (menuPanel.classList.contains('open')) return;
    if (!gestureDecided || isScrollingV) return;
    const t   = e.changedTouches ? e.changedTouches[0] : e;
    const dx  = t.clientX - touchStartX;
    const dt  = Date.now() - touchStartTime;
    const thr = Math.min(window.innerWidth * 0.2, 60);
    if (Math.abs(dx) < thr && dt > 300) return;
    if (dx < -thr) handleForward();
    else if (dx > thr) handleBackward();
  }

  /* 鼠标模拟（PC 预览） */
  let mouseDown = false;
  function onMouseDown(e) { mouseDown = true;  onTouchStart(e); }
  function onMouseMove(e) { if (!mouseDown) return; onTouchMove(e); }
  function onMouseUp  (e) { if (!mouseDown) return; mouseDown = false; onTouchEnd(e); }

  /* 键盘（PC 调试） */
  function onKeyDown(e) {
    if (e.key === 'ArrowLeft')  handleBackward();
    if (e.key === 'ArrowRight') handleForward();
    if (e.key === 'Escape')     closeMenu();
  }

  /* ============================================================
     事件绑定
     ============================================================ */
  function bindEvents() {
    btnPrev.addEventListener('click', handleBackward);
    btnNext.addEventListener('click', handleForward);
    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    app.addEventListener('touchstart', onTouchStart, { passive: true  });
    app.addEventListener('touchmove',  onTouchMove,  { passive: false });
    app.addEventListener('touchend',   onTouchEnd,   { passive: true  });

    app.addEventListener('mousedown',    onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    window.addEventListener('keydown',   onKeyDown);
  }

  /* ============================================================
     启动
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
