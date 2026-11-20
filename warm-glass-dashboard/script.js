/**
 * ATLAS Command Center - Interactive Controller
 * Handles time-range transitions, live filtering, dynamic tooltips,
 * navigation syncing, and modal spotlights.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Data by Time Range ---
  const timeRangeData = {
    '7': {
      revenue: '$14,800',
      revenueRaw: 14800,
      trend: '+6.1%',
      subscriptions: '$10,210',
      services: '$3,150',
      addons: '$1,440',
      automations: '342',
      automationsTrend: '+12.4%',
      subscribers: '512',
      subscribersNote: '+42 this week',
      churn: '3.8%',
      churnTrend: '-0.2%',
      tickets: '4',
      ticketsSub: '3 resolved today',
      capacityUsed: '342 used',
      capacityTotal: '1,000 monthly runs',
      capacityPercent: '34.2%',
      bars: [
        { day: 'Tue', complete: 38, review: 6, compH: 35, revH: 10 },
        { day: 'Wed', complete: 44, review: 8, compH: 42, revH: 12 },
        { day: 'Thu', complete: 52, review: 9, compH: 48, revH: 14 },
        { day: 'Fri', complete: 68, review: 12, compH: 62, revH: 18 },
        { day: 'Sat', complete: 30, review: 4, compH: 28, revH: 8 },
        { day: 'Sun', complete: 48, review: 7, compH: 45, revH: 12 },
        { day: 'Mon', complete: 72, review: 14, compH: 68, revH: 20 }
      ]
    },
    '30': {
      revenue: '$47,200',
      revenueRaw: 47200,
      trend: '+8.3%',
      subscriptions: '$32,379',
      services: '$9,818',
      addons: '$5,003',
      automations: '1,284',
      automationsTrend: '+9.5%',
      subscribers: '1,847',
      subscribersNote: '+124 this month',
      churn: '4.2%',
      churnTrend: '-0.5%',
      tickets: '12',
      ticketsSub: '9 resolved today',
      capacityUsed: '1,284 used',
      capacityTotal: '3,200 monthly runs',
      capacityPercent: '40.1%',
      bars: [
        { day: 'Tue', complete: 142, review: 22, compH: 48, revH: 14 },
        { day: 'Wed', complete: 158, review: 26, compH: 52, revH: 15 },
        { day: 'Thu', complete: 176, review: 30, compH: 58, revH: 16 },
        { day: 'Fri', complete: 210, review: 35, compH: 70, revH: 18 },
        { day: 'Sat', complete: 120, review: 18, compH: 38, revH: 12 },
        { day: 'Sun', complete: 185, review: 28, compH: 62, revH: 15 },
        { day: 'Mon', complete: 245, review: 42, compH: 78, revH: 20 }
      ]
    },
    '90': {
      revenue: '$146,850',
      revenueRaw: 146850,
      trend: '+14.2%',
      subscriptions: '$98,400',
      services: '$31,250',
      addons: '$17,200',
      automations: '4,120',
      automationsTrend: '+16.8%',
      subscribers: '5,340',
      subscribersNote: '+480 this quarter',
      churn: '3.9%',
      churnTrend: '-0.8%',
      tickets: '28',
      ticketsSub: '24 resolved this week',
      capacityUsed: '4,120 used',
      capacityTotal: '9,600 monthly runs',
      capacityPercent: '42.9%',
      bars: [
        { day: 'Tue', complete: 480, review: 70, compH: 54, revH: 15 },
        { day: 'Wed', complete: 520, review: 85, compH: 58, revH: 16 },
        { day: 'Thu', complete: 590, review: 95, compH: 66, revH: 18 },
        { day: 'Fri', complete: 680, review: 110, compH: 76, revH: 20 },
        { day: 'Sat', complete: 390, review: 55, compH: 44, revH: 12 },
        { day: 'Sun', complete: 610, review: 90, compH: 68, revH: 17 },
        { day: 'Mon', complete: 790, review: 130, compH: 82, revH: 22 }
      ]
    }
  };

  // --- Element Selectors ---
  const rangePills = document.querySelectorAll('.range-pill');
  const kpiRevenue = document.getElementById('kpiRevenue');
  const kpiRevenueTrend = document.getElementById('kpiRevenueTrend');
  const kpiSubscriptions = document.getElementById('kpiSubscriptions');
  const kpiServices = document.getElementById('kpiServices');
  const kpiAddons = document.getElementById('kpiAddons');
  const kpiAutomations = document.getElementById('kpiAutomations');
  const kpiSubscribers = document.getElementById('kpiSubscribers');
  const kpiChurn = document.getElementById('kpiChurn');
  const kpiTickets = document.getElementById('kpiTickets');
  const kpiTicketsSub = document.getElementById('kpiTicketsSub');
  const capacityUsed = document.getElementById('capacityUsed');
  const capacityTotal = document.getElementById('capacityTotal');
  const capacityFill = document.getElementById('capacityFill');

  // Chart Elements
  const chartContainer = document.getElementById('barChartContainer');
  const chartTooltip = document.getElementById('chartTooltip');
  const tooltipDay = document.getElementById('tooltipDay');
  const tooltipComplete = document.getElementById('tooltipComplete');
  const tooltipReview = document.getElementById('tooltipReview');

  // Table & Filter Elements
  const searchInput = document.getElementById('activitySearchInput');
  const statusFilterBtn = document.getElementById('statusFilterBtn');
  const statusDropdownMenu = document.getElementById('statusDropdownMenu');
  const selectedStatusText = document.getElementById('selectedStatusText');
  const tableRows = document.querySelectorAll('.activity-row');
  const emptyStateMsg = document.getElementById('emptyStateMsg');

  // Modals
  const aiSearchTrigger = document.getElementById('aiSearchTrigger');
  const aiModal = document.getElementById('aiModal');
  const closeAiModalBtn = document.getElementById('closeAiModalBtn');

  const approvalActionItem = document.getElementById('approvalActionItem');
  const approvalModal = document.getElementById('approvalModal');
  const closeApprovalModalBtn = document.getElementById('closeApprovalModalBtn');

  // Navigation Items
  const railButtons = document.querySelectorAll('.rail-btn');
  const dockButtons = document.querySelectorAll('.dock-btn');

  // --- Number Counter Helper ---
  function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.floor(easeProgress * (end - start) + start);
      element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // --- Time Range Switcher Logic ---
  rangePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selectedRange = pill.getAttribute('data-range');
      if (!selectedRange || pill.classList.contains('active')) return;

      // Update pill classes
      rangePills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      // Update data
      const data = timeRangeData[selectedRange];
      if (!data) return;

      // Parse current revenue
      const currentRev = parseInt(kpiRevenue.textContent.replace(/[^0-9]/g, ''), 10) || 0;
      animateValue(kpiRevenue, currentRev, data.revenueRaw, 500);

      kpiRevenueTrend.textContent = data.trend;
      kpiSubscriptions.textContent = data.subscriptions;
      kpiServices.textContent = data.services;
      kpiAddons.textContent = data.addons;

      kpiAutomations.textContent = data.automations;
      kpiSubscribers.textContent = data.subscribers;
      kpiChurn.textContent = data.churn;
      kpiTickets.textContent = data.tickets;
      kpiTicketsSub.textContent = data.ticketsSub;

      capacityUsed.textContent = data.capacityUsed;
      capacityTotal.textContent = data.capacityTotal;
      capacityFill.style.width = data.capacityPercent;

      // Update chart bars
      const barCols = chartContainer.querySelectorAll('.chart-bar-col');
      barCols.forEach((barCol, index) => {
        const barData = data.bars[index];
        if (!barData) return;
        barCol.setAttribute('data-complete', barData.complete);
        barCol.setAttribute('data-review', barData.review);
        const segReview = barCol.querySelector('.bar-segment-review');
        const segComplete = barCol.querySelector('.bar-segment-complete');
        if (segReview) segReview.style.height = `${barData.revH}%`;
        if (segComplete) segComplete.style.height = `${barData.compH}%`;
      });
    });
  });

  // --- Bar Chart Tooltip Interaction ---
  const barCols = document.querySelectorAll('.chart-bar-col');
  barCols.forEach(col => {
    col.addEventListener('mouseenter', () => {
      const day = col.getAttribute('data-day');
      const complete = col.getAttribute('data-complete');
      const review = col.getAttribute('data-review');

      tooltipDay.textContent = day;
      tooltipComplete.textContent = complete;
      tooltipReview.textContent = review;

      // Position tooltip above current bar
      const colRect = col.getBoundingClientRect();
      const parentRect = chartContainer.getBoundingClientRect();
      const offsetLeft = colRect.left - parentRect.left + (colRect.width / 2);

      chartTooltip.style.left = `${offsetLeft}px`;
      chartTooltip.classList.add('visible');

      barCols.forEach(b => b.classList.remove('active-bar'));
      col.classList.add('active-bar');
    });
  });

  chartContainer.addEventListener('mouseleave', () => {
    chartTooltip.classList.remove('visible');
  });

  // --- Live Table Filtering & Search ---
  let currentFilter = 'all';
  let currentSearch = '';

  function filterTable() {
    let visibleCount = 0;
    tableRows.forEach(row => {
      const rowStatus = row.getAttribute('data-status');
      const rowActivity = row.querySelector('.col-activity')?.textContent.toLowerCase() || '';
      const rowSource = row.querySelector('.col-source')?.textContent.toLowerCase() || '';

      const matchesStatus = (currentFilter === 'all') || (rowStatus === currentFilter);
      const matchesSearch = rowActivity.includes(currentSearch) || rowSource.includes(currentSearch);

      if (matchesStatus && matchesSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      emptyStateMsg.style.display = 'block';
    } else {
      emptyStateMsg.style.display = 'none';
    }
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterTable();
    });
  }

  // Status Dropdown Toggle
  if (statusFilterBtn && statusDropdownMenu) {
    statusFilterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = statusDropdownMenu.classList.contains('show');
      statusDropdownMenu.classList.toggle('show');
      statusFilterBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Option Click
    const dropdownOptions = statusDropdownMenu.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const status = option.getAttribute('data-status');
        currentFilter = status;

        dropdownOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        selectedStatusText.textContent = option.textContent;
        statusDropdownMenu.classList.remove('show');
        statusFilterBtn.setAttribute('aria-expanded', 'false');

        filterTable();
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      if (statusDropdownMenu.classList.contains('show')) {
        statusDropdownMenu.classList.remove('show');
        statusFilterBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Modal Dialogs (AI Spotlight & Approvals) ---
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // AI Spotlight Modal
  if (aiSearchTrigger && aiModal) {
    aiSearchTrigger.addEventListener('click', () => openModal(aiModal));
    aiSearchTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(aiModal);
      }
    });
    if (closeAiModalBtn) {
      closeAiModalBtn.addEventListener('click', () => closeModal(aiModal));
    }
    aiModal.addEventListener('click', (e) => {
      if (e.target === aiModal) closeModal(aiModal);
    });
  }

  // Approvals Modal
  if (approvalActionItem && approvalModal) {
    approvalActionItem.addEventListener('click', () => openModal(approvalModal));
    approvalActionItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(approvalModal);
      }
    });
    if (closeApprovalModalBtn) {
      closeApprovalModalBtn.addEventListener('click', () => closeModal(approvalModal));
    }
    approvalModal.addEventListener('click', (e) => {
      if (e.target === approvalModal) closeModal(approvalModal);
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(aiModal);
      closeModal(approvalModal);
    }
  });

  // --- Navigation Tab Synchronizer ---
  function syncNavigation(navTarget) {
    railButtons.forEach(btn => {
      if (btn.getAttribute('data-nav') === navTarget) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    dockButtons.forEach(btn => {
      if (btn.getAttribute('data-nav') === navTarget) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  railButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const navTarget = btn.getAttribute('data-nav');
      syncNavigation(navTarget);
    });
  });

  dockButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const navTarget = btn.getAttribute('data-nav');
      syncNavigation(navTarget);
    });
  });

  // Button CTAs Interactive Feedback
  const btnViewTrends = document.getElementById('btnViewTrends');
  const btnViewMetrics = document.getElementById('btnViewMetrics');
  if (btnViewTrends) {
    btnViewTrends.addEventListener('click', () => syncNavigation('trends'));
  }
  if (btnViewMetrics) {
    btnViewMetrics.addEventListener('click', () => syncNavigation('metrics'));
  }

  // Ambient Lighting Settings (Theme Toggle)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let isTwilight = false;
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isTwilight = !isTwilight;
      if (isTwilight) {
        document.documentElement.style.setProperty('--canvas-bg', '#1c1715');
        document.documentElement.style.setProperty('--glass-shell-bg', 'rgba(38, 30, 26, 0.88)');
      } else {
        document.documentElement.style.setProperty('--canvas-bg', '#221c19');
        document.documentElement.style.setProperty('--glass-shell-bg', 'rgba(44, 37, 33, 0.82)');
      }
    });
  }

  // Notification Button
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => openModal(aiModal));
  }
});
