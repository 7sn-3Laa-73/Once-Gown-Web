/**
 * Once Gown - Main Application Controller
 * Handles Role Selection (Seller vs Buyer), 4-step wizard logic, Buyer "Coming Soon" preview,
 * i18n language switching, auto-save state, validation, custom color picker, ImageService,
 * and real-time Firestore submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Image Service
  const imageService = new ImageService();

  // State Management (Role & 4 Steps)
  const state = {
    role: null, // 'seller' | 'buyer' | null
    currentStep: 1,
    totalSteps: 4,
    formData: {},
    images: []
  };

  // DOM Elements - Role Modal & Views
  const elRoleModalOverlay = document.getElementById('roleModalOverlay');
  const elBtnSelectSeller = document.getElementById('btnSelectSeller');
  const elBtnSelectBuyer = document.getElementById('btnSelectBuyer');
  const elBtnOpenRoleModal = document.getElementById('btnOpenRoleModal');
  const elBuyerComingSoonView = document.getElementById('buyerComingSoonView');
  const elSellerProgressCard = document.getElementById('sellerProgressCard');
  const elWizardCard = document.getElementById('wizardCard');
  const elStickyActionsBar = document.getElementById('stickyActionsBar');
  const elHeaderBadgeSeller = document.getElementById('headerBadgeSeller');

  // DOM Elements - Form & Wizard Navigation
  const elProgressFill = document.getElementById('progressFill');
  const elStepCountDisplay = document.getElementById('stepCountDisplay');
  const elStepTitleDisplay = document.getElementById('stepTitleDisplay');
  const elBtnBack = document.getElementById('btnBack');
  const elBtnNext = document.getElementById('btnNext');
  const elBtnNextText = document.getElementById('btnNextText');
  const elAutoSaveText = document.getElementById('autoSaveText');
  const elDropzone = document.getElementById('uploadDropzone');
  const elFileInput = document.getElementById('imageFileInput');
  const elPreviewGrid = document.getElementById('imagePreviewGrid');
  const elReviewSummary = document.getElementById('reviewSummaryContainer');

  // Custom Color Picker Elements
  const customColorPicker = document.getElementById('customColorPicker');
  const customColorText = document.getElementById('customColorText');

  // VIP Subscription Elements
  const btnSubscribeVip = document.getElementById('btnSubscribeVip');
  const buyerVipEmail = document.getElementById('buyerVipEmail');
  const vipSubscribeMsg = document.getElementById('vipSubscribeMsg');
  const btnSwitchToSellerFromBuyer = document.getElementById('btnSwitchToSellerFromBuyer');

  // Initialize Language & Apply Initial Translations
  setupLanguageSwitcher();

  // Initialize Role Selector System
  setupRoleSelector();

  // Initialize 20-Day Countdown Timer
  startBarCountdownTimer();

  // Load Saved Draft on App Start
  loadLocalDraft();

  // Attach Event Listeners
  setupNavigationEvents();
  setupImageServiceEvents();
  setupConditionalFields();
  setupColorPicker();
  setupAutoSave();

  // Initial UI Render
  updateStepUI();

  // -------------------------------------------------------------
  // Role Selector & View Switching System
  // -------------------------------------------------------------

  function setupRoleSelector() {
    // Check if user has saved role choice or show modal by default
    const savedRole = localStorage.getItem('once_gown_role');

    if (savedRole === 'seller') {
      setRole('seller', false);
    } else if (savedRole === 'buyer') {
      setRole('buyer', false);
    } else {
      // Show modal on first visit
      showRoleModal();
    }

    if (elBtnSelectSeller) {
      elBtnSelectSeller.addEventListener('click', () => setRole('seller', true));
    }

    const btnSellerAction = document.querySelector('.btn-seller-action');
    if (btnSellerAction) {
      btnSellerAction.addEventListener('click', (e) => {
        e.stopPropagation();
        setRole('seller', true);
      });
    }

    if (elHeaderBadgeSeller) {
      elHeaderBadgeSeller.style.cursor = 'pointer';
      elHeaderBadgeSeller.addEventListener('click', () => setRole('seller', true));
    }

    if (elBtnSelectBuyer) {
      elBtnSelectBuyer.addEventListener('click', () => setRole('buyer', true));
    }

    const btnBuyerAction = document.querySelector('.btn-buyer-action');
    if (btnBuyerAction) {
      btnBuyerAction.addEventListener('click', (e) => {
        e.stopPropagation();
        setRole('buyer', true);
      });
    }

    if (elBtnOpenRoleModal) {
      elBtnOpenRoleModal.addEventListener('click', () => showRoleModal());
    }

    if (btnSwitchToSellerFromBuyer) {
      btnSwitchToSellerFromBuyer.addEventListener('click', () => setRole('seller', true));
    }

    if (btnSubscribeVip) {
      btnSubscribeVip.addEventListener('click', () => {
        if (buyerVipEmail && buyerVipEmail.value.includes('@')) {
          vipSubscribeMsg.classList.remove('hidden');
          buyerVipEmail.value = '';
        } else {
          alert(i18n.lang === 'ar' ? 'يرجى كتابة بريد إلكتروني صحيح' : 'Please enter a valid email address');
        }
      });
    }
  }

  function showRoleModal() {
    if (elRoleModalOverlay) {
      elRoleModalOverlay.classList.remove('hidden');
    }
  }

  function hideRoleModal() {
    if (elRoleModalOverlay) {
      elRoleModalOverlay.classList.add('hidden');
    }
  }

  function setRole(role, persist = true) {
    state.role = role;
    if (persist) {
      localStorage.setItem('once_gown_role', role);
    }

    hideRoleModal();

    const successView = document.getElementById('successView');

    if (role === 'seller') {
      // Show Seller Listing Form & Hide Other Views
      if (elBuyerComingSoonView) elBuyerComingSoonView.classList.add('hidden');
      if (successView) successView.classList.add('hidden');

      if (elSellerProgressCard) elSellerProgressCard.classList.remove('hidden');
      if (elWizardCard) elWizardCard.classList.remove('hidden');
      if (elStickyActionsBar) elStickyActionsBar.classList.remove('hidden');
      if (elHeaderBadgeSeller) elHeaderBadgeSeller.classList.remove('hidden');

      // Reset step if form was previously completed
      if (state.currentStep > state.totalSteps) {
        state.currentStep = 1;
      }

      updateStepUI();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else if (role === 'buyer') {
      // Show Buyer Coming Soon View & Hide Seller Views
      if (successView) successView.classList.add('hidden');
      if (elSellerProgressCard) elSellerProgressCard.classList.add('hidden');
      if (elWizardCard) elWizardCard.classList.add('hidden');
      if (elStickyActionsBar) elStickyActionsBar.classList.add('hidden');
      if (elHeaderBadgeSeller) elHeaderBadgeSeller.classList.add('hidden');
      if (elBuyerComingSoonView) elBuyerComingSoonView.classList.remove('hidden');

      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  // -------------------------------------------------------------
  // Language Switcher Setup
  // -------------------------------------------------------------

  function setupLanguageSwitcher() {
    const langBtns = [
      document.getElementById('langSwitchBtn'),
      document.getElementById('modalLangSwitchBtn')
    ];

    langBtns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        const option = e.target.closest('[data-lang]');
        const targetLang = option ? option.getAttribute('data-lang') : (i18n.lang === 'en' ? 'ar' : 'en');
        i18n.setLanguage(targetLang);
      });
    });

    // Apply saved or default language (English default)
    i18n.setLanguage(i18n.lang);

    window.addEventListener('languageChanged', () => {
      updateStepUI();
      if (state.currentStep === state.totalSteps && state.role === 'seller') {
        renderReviewSummary();
      }
      if (elTrackingModalOverlay && !elTrackingModalOverlay.classList.contains('hidden') && activeTrackingDressId) {
        openTrackingModal(activeTrackingDressId);
      }
    });
  }

  // -------------------------------------------------------------
  // Live 20-Day Countdown Timer in Fixed Top Announcement Bar
  // -------------------------------------------------------------

  function startBarCountdownTimer() {
    const elDays = document.getElementById('barDays');
    const elHours = document.getElementById('barHours');
    const elMinutes = document.getElementById('barMinutes');
    const elSeconds = document.getElementById('barSeconds');

    if (!elDays) return;

    // Target Date: 20 Days from now
    const targetDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).getTime();

    function updateBarTimer() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        elDays.textContent = '00';
        elHours.textContent = '00';
        elMinutes.textContent = '00';
        elSeconds.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      elDays.textContent = String(days).padStart(2, '0');
      elHours.textContent = String(hours).padStart(2, '0');
      elMinutes.textContent = String(minutes).padStart(2, '0');
      elSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateBarTimer();
    setInterval(updateBarTimer, 1000);
  }

  // -------------------------------------------------------------
  // Custom Color Picker Handler
  // -------------------------------------------------------------

  function setupColorPicker() {
    if (!customColorPicker) return;

    customColorPicker.addEventListener('input', (e) => {
      const selectedHex = e.target.value;
      if (customColorText) {
        customColorText.textContent = `${i18n.t('step2.colorCustomLabel')} ${selectedHex}`;
      }
      document.querySelectorAll('[name="color"]').forEach(radio => {
        radio.checked = false;
      });
      state.formData.color = `${selectedHex}`;
      saveLocalDraft();
    });

    document.querySelectorAll('[name="color"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (customColorText) {
          customColorText.textContent = '';
        }
        state.formData.color = e.target.value;
        saveLocalDraft();
      });
    });
  }

  // -------------------------------------------------------------
  // Step Navigation Logic
  // -------------------------------------------------------------

  function setupNavigationEvents() {
    elBtnNext.addEventListener('click', async () => {
      if (state.currentStep === state.totalSteps) {
        await submitForm();
      } else {
        if (validateCurrentStep()) {
          state.currentStep++;
          updateStepUI();
          saveLocalDraft();
          window.scrollTo({ top: 100, behavior: 'smooth' });
        }
      }
    });

    elBtnBack.addEventListener('click', () => {
      if (state.currentStep > 1) {
        state.currentStep--;
        updateStepUI();
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    });
  }

  function updateStepUI() {
    document.querySelectorAll('.step-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const currentPane = document.getElementById(`stepPane${state.currentStep}`);
    if (currentPane) {
      currentPane.classList.add('active');
    }

    const progressPercent = (state.currentStep / state.totalSteps) * 100;
    if (elProgressFill) elProgressFill.style.width = `${progressPercent}%`;

    if (elStepCountDisplay) elStepCountDisplay.textContent = `${i18n.t('progress.stepPrefix')} ${state.currentStep} ${i18n.t('progress.stepOf')}`;
    if (elStepTitleDisplay) elStepTitleDisplay.textContent = i18n.t(`step${state.currentStep}.progressTitle`);

    if (state.currentStep === 1) {
      if (elBtnBack) elBtnBack.style.visibility = 'hidden';
    } else {
      if (elBtnBack) elBtnBack.style.visibility = 'visible';
    }

    if (state.currentStep === state.totalSteps) {
      if (elBtnNextText) elBtnNextText.textContent = i18n.t('nav.submit');
      renderReviewSummary();
    } else {
      if (elBtnNextText) elBtnNextText.textContent = i18n.t('nav.continue');
    }
  }

  // -------------------------------------------------------------
  // Form Validation per Step
  // -------------------------------------------------------------

  function validateCurrentStep() {
    clearErrors();
    let isValid = true;
    collectFormData();

    // Step 1 Validation: Photos
    if (state.currentStep === 1) {
      if (imageService.getImages().length < 1) {
        showError('imageUploadArea', i18n.t('error.photoRequired'));
        isValid = false;
      }
    }

    // Step 2 Validation: Color & Price Specs
    if (state.currentStep === 2) {
      if (!state.formData.color) {
        showError('colorGroup', i18n.t('error.colorRequired'));
        isValid = false;
      }
      const listingType = state.formData.listingType || 'للإيجار والبيع';
      if (listingType.includes('إيجار') || listingType.includes('Rent')) {
        if (!state.formData.rentPrice || Number(state.formData.rentPrice) <= 0) {
          showError('rentPriceGroup', i18n.t('error.rentPriceRequired'));
          isValid = false;
        }
      }
      if (listingType === 'للبيع' || listingType === 'Sale Only') {
        if (!state.formData.sellPrice || Number(state.formData.sellPrice) <= 0) {
          showError('sellPriceGroup', i18n.t('error.sellPriceRequired'));
          isValid = false;
        }
      }
    }

    // Step 3 Validation: Owner Info & Location
    if (state.currentStep === 3) {
      if (!state.formData.ownerName) {
        showError('ownerNameGroup', i18n.t('error.ownerNameRequired'));
        isValid = false;
      }
      if (!state.formData.phone || !/^(01)[0-9]{9}$/.test(state.formData.phone)) {
        showError('phoneGroup', i18n.t('error.phoneRequired'));
        isValid = false;
      }
      if (!state.formData.governorate) {
        showError('governorateGroup', i18n.t('error.governorateRequired'));
        isValid = false;
      }
      if (!state.formData.city) {
        showError('cityGroup', i18n.t('error.cityRequired'));
        isValid = false;
      }
      if (!state.formData.address) {
        showError('addressGroup', i18n.t('error.addressRequired'));
        isValid = false;
      }
    }

    // Step 4 Validation: Agreement
    if (state.currentStep === 4) {
      const cbAgree = document.getElementById('agreementCheckbox');
      if (!cbAgree || !cbAgree.checked) {
        showError('agreementBox', i18n.t('error.agreementRequired'));
        isValid = false;
      }
    }

    return isValid;
  }

  function showError(fieldId, message) {
    const target = document.getElementById(fieldId);
    const parent = target?.closest('.form-group') || target;
    if (parent) {
      parent.classList.add('has-error');
      const errEl = parent.querySelector('.error-message');
      if (errEl) {
        errEl.textContent = message;
      }
    }
  }

  function clearErrors() {
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  }

  // -------------------------------------------------------------
  // Data Collection & Auto-Save
  // -------------------------------------------------------------

  function collectFormData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.name) return;

      if (input.type === 'radio') {
        if (input.checked) {
          state.formData[input.name] = input.value;
        }
      } else if (input.type === 'checkbox') {
        state.formData[input.name] = input.checked;
      } else {
        state.formData[input.name] = input.value;
      }
    });
  }

  function setupAutoSave() {
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        collectFormData();
        saveLocalDraft();
      });
      el.addEventListener('change', () => {
        collectFormData();
        saveLocalDraft();
      });
    });
  }

  function saveLocalDraft() {
    try {
      const draft = {
        formData: state.formData,
        currentStep: state.currentStep,
        imagesBase64: imageService.getBase64Payload()
      };
      localStorage.setItem('once_gown_draft', JSON.stringify(draft));
      if (elAutoSaveText) elAutoSaveText.textContent = i18n.t('nav.autoSave');
    } catch (e) {
      console.warn('Draft cache limit:', e);
    }
  }

  function loadLocalDraft() {
    const saved = localStorage.getItem('once_gown_draft');
    if (!saved) return;

    try {
      const draft = JSON.parse(saved);
      if (draft.formData) {
        state.formData = draft.formData;
        restoreFormInputs(draft.formData);
      }
      if (draft.imagesBase64 && Array.isArray(draft.imagesBase64)) {
        imageService.loadBase64List(draft.imagesBase64);
        renderImagePreviews();
      }
    } catch (e) {
      console.error('Draft restore note:', e);
    }
  }

  function restoreFormInputs(data) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      const elements = document.querySelectorAll(`[name="${key}"]`);
      elements.forEach(el => {
        if (el.type === 'radio') {
          el.checked = (el.value === value);
        } else if (el.type === 'checkbox') {
          el.checked = Boolean(value);
        } else {
          el.value = value;
        }
      });
    });
  }

  function setupConditionalFields() {
    const radioReady = document.querySelectorAll('[name="readyOrTailored"]');
    const groupTailor = document.getElementById('tailorNameGroup');
    radioReady.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'تفصيل' || e.target.value === 'Bespoke / Tailored') {
          groupTailor.classList.remove('hidden');
        } else {
          groupTailor.classList.add('hidden');
        }
      });
    });

    const radioDefects = document.querySelectorAll('[name="hasDefects"]');
    const groupDefects = document.getElementById('defectDetailsGroup');
    radioDefects.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'نعم' || e.target.value === 'Minor Notes Present') {
          groupDefects.classList.remove('hidden');
        } else {
          groupDefects.classList.add('hidden');
        }
      });
    });

    const radioAlterations = document.querySelectorAll('[name="alterationsAllowed"]');
    const groupAlterations = document.getElementById('alterationDetailsGroup');
    radioAlterations.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'نعم' || e.target.value === 'Yes') {
          groupAlterations.classList.remove('hidden');
        } else {
          groupAlterations.classList.add('hidden');
        }
      });
    });

    const radioListing = document.querySelectorAll('[name="listingType"]');
    const groupRentPrice = document.getElementById('rentPriceGroup');
    const groupSellPrice = document.getElementById('sellPriceGroup');
    radioListing.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'للإيجار' || type === 'Rent Only') {
          groupRentPrice.classList.remove('hidden');
          groupSellPrice.classList.add('hidden');
        } else if (type === 'للبيع' || type === 'Sale Only') {
          groupRentPrice.classList.add('hidden');
          groupSellPrice.classList.remove('hidden');
        } else {
          groupRentPrice.classList.remove('hidden');
          groupSellPrice.classList.remove('hidden');
        }
      });
    });
  }

  function setupImageServiceEvents() {
    if (!elDropzone || !elFileInput) return;

    elDropzone.addEventListener('click', (e) => {
      e.stopPropagation();
      elFileInput.click();
    });

    elDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elDropzone.classList.add('dragover');
    });

    elDropzone.addEventListener('dragleave', () => {
      elDropzone.classList.remove('dragover');
    });

    elDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      elDropzone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await imageService.processFiles(e.dataTransfer.files);
        renderImagePreviews();
        saveLocalDraft();
      }
    });

    elFileInput.addEventListener('change', async () => {
      if (elFileInput.files && elFileInput.files.length > 0) {
        await imageService.processFiles(elFileInput.files);
        renderImagePreviews();
        saveLocalDraft();
        elFileInput.value = ''; // Clear value so selecting same file works again
      }
    });
  }

  function renderImagePreviews() {
    const images = imageService.getImages();
    if (!elPreviewGrid) return;
    elPreviewGrid.innerHTML = '';

    const area = document.getElementById('imageUploadArea');
    if (images.length > 0 && area) {
      area.classList.remove('has-error');
      const errEl = area.querySelector('.error-message');
      if (errEl) errEl.textContent = '';
    }

    images.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'image-preview-card';

      card.innerHTML = `
        <img src="${img.base64}" class="image-preview-img" alt="Gown Image" />
        ${img.isCover ? `<span class="cover-badge">${i18n.t('preview.coverBadge')}</span>` : ''}
        <div class="image-actions-overlay">
          ${!img.isCover ? `<button type="button" class="action-btn-sm btn-set-cover" data-id="${img.id}">${i18n.t('preview.setCover')}</button>` : ''}
          <button type="button" class="action-btn-sm action-btn-danger btn-remove-img" data-id="${img.id}">${i18n.t('preview.remove')}</button>
        </div>
      `;

      elPreviewGrid.appendChild(card);
    });

    elPreviewGrid.querySelectorAll('.btn-set-cover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageService.setCover(btn.dataset.id);
        renderImagePreviews();
        saveLocalDraft();
      });
    });

    elPreviewGrid.querySelectorAll('.btn-remove-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageService.removeImage(btn.dataset.id);
        renderImagePreviews();
        saveLocalDraft();
      });
    });
  }

  function renderReviewSummary() {
    collectFormData();
    const d = state.formData;
    const images = imageService.getImages();
    const curr = i18n.t('review.currency');
    if (!elReviewSummary) return;

    elReviewSummary.innerHTML = `
      <div class="review-summary-card">
        <div class="review-section">
          <div class="review-section-title">${i18n.t('review.ownerTitle')}</div>
          <div class="review-row"><span class="review-label">${i18n.t('review.ownerName')}</span><span class="review-value">${d.ownerName || '-'}</span></div>
          <div class="review-row"><span class="review-label">${i18n.t('review.phone')}</span><span class="review-value">${d.phone || '-'}</span></div>
          <div class="review-row"><span class="review-label">${i18n.t('review.address')}</span><span class="review-value">${d.governorate || ''}${d.city ? ', ' + d.city : ''}${d.address ? ', ' + d.address : '-'}</span></div>
        </div>

        <div class="review-section">
          <div class="review-section-title">${i18n.t('review.specsTitle')}</div>
          <div class="review-row"><span class="review-label">${i18n.t('review.brand')}</span><span class="review-value">${d.brand || i18n.t('review.notSpecified')}</span></div>
          <div class="review-row"><span class="review-label">${i18n.t('review.color')}</span><span class="review-value">${d.color || '-'}</span></div>
          <div class="review-row"><span class="review-label">${i18n.t('review.size')}</span><span class="review-value">${d.size || i18n.t('review.notSpecified')}</span></div>
          ${d.rentPrice ? `<div class="review-row"><span class="review-label">${i18n.t('review.rentPrice')}</span><span class="review-value">${d.rentPrice} ${curr}</span></div>` : ''}
          ${d.sellPrice ? `<div class="review-row"><span class="review-label">${i18n.t('review.sellPrice')}</span><span class="review-value">${d.sellPrice} ${curr}</span></div>` : ''}
          <div class="review-row"><span class="review-label">${i18n.t('review.imageCount')}</span><span class="review-value">${images.length} ${i18n.t('review.photosCount')}</span></div>
        </div>

        <div class="review-section">
          <div class="review-section-title">${i18n.t('review.notesTitle')}</div>
          <div class="review-row"><span class="review-label">${i18n.t('review.notes')}</span><span class="review-value">${d.notes || i18n.t('review.none')}</span></div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // Real-Time Gown Tracking & Status System
  // -------------------------------------------------------------

  const elBtnOpenTrackingModal = document.getElementById('btnOpenTrackingModal');
  const elTrackingModalOverlay = document.getElementById('trackingModalOverlay');
  const elTrackingModalBody = document.getElementById('trackingModalBody');
  const elBtnCloseTrackingModal = document.getElementById('btnCloseTrackingModal');

  function saveListingIdToLocal(docId) {
    if (!docId) return;
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('once_gown_my_listings') || '[]');
    } catch(e) { saved = []; }

    if (!saved.includes(docId)) {
      saved.unshift(docId);
      localStorage.setItem('once_gown_my_listings', JSON.stringify(saved));
    }
    updateHeaderTrackingBtn();
  }

  function getLocalListings() {
    try {
      return JSON.parse(localStorage.getItem('once_gown_my_listings') || '[]');
    } catch(e) { return []; }
  }

  function updateHeaderTrackingBtn() {
    const listings = getLocalListings();
    if (listings.length > 0 && elBtnOpenTrackingModal) {
      elBtnOpenTrackingModal.classList.remove('hidden');
    }
  }

  function setupTrackingSystem() {
    updateHeaderTrackingBtn();

    if (elBtnOpenTrackingModal) {
      elBtnOpenTrackingModal.addEventListener('click', () => {
        const listings = getLocalListings();
        if (listings.length > 0) {
          openTrackingModal(listings[0]);
        }
      });
    }

    if (elBtnCloseTrackingModal) {
      elBtnCloseTrackingModal.addEventListener('click', () => {
        if (elTrackingModalOverlay) elTrackingModalOverlay.classList.add('hidden');
      });
    }

    if (elTrackingModalOverlay) {
      elTrackingModalOverlay.addEventListener('click', (e) => {
        if (e.target === elTrackingModalOverlay) {
          elTrackingModalOverlay.classList.add('hidden');
        }
      });
    }

    // Check URL query param ?track=ID
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    if (trackId) {
      saveListingIdToLocal(trackId);
      openTrackingModal(trackId);
    }
  }

  let activeTrackingUnsubscribe = null;
  let activeTrackingDressId = null;

  function openTrackingModal(dressId) {
    if (!elTrackingModalOverlay || !elTrackingModalBody) return;
    activeTrackingDressId = dressId;
    elTrackingModalOverlay.classList.remove('hidden');
    hideRoleModal();

    elTrackingModalBody.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-secondary);">
        ⏳ ${i18n.lang === 'ar' ? 'جاري تحميل حالة الطلب من قاعدة البيانات...' : 'Loading tracking status from Firestore...'}
      </div>
    `;

    if (typeof db === 'undefined' || !db) {
      elTrackingModalBody.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--rose-deep);">
          ⚠️ ${i18n.lang === 'ar' ? 'يتطلب الاتصال بقاعدة البيانات لراحتكِ.' : 'Database connection required for live tracking.'}
        </div>
      `;
      return;
    }

    if (activeTrackingUnsubscribe) {
      activeTrackingUnsubscribe();
    }

    activeTrackingUnsubscribe = db.collection('dresses').doc(dressId).onSnapshot((doc) => {
      if (!doc.exists) {
        elTrackingModalBody.innerHTML = `
          <div style="text-align: center; padding: 20px; color: var(--status-rejected);">
            ❌ ${i18n.lang === 'ar' ? 'عفواً، لم نتمكن من العثور على طلب الفستان بهذا الرابط.' : 'Gown listing submission not found for this link.'}
          </div>
        `;
        return;
      }

      const dress = doc.data();
      renderLiveTrackingCard(dressId, dress);
    }, (err) => {
      console.error('Error tracking dress:', err);
    });
  }

  function renderLiveTrackingCard(dressId, dress) {
    const isAr = i18n.lang === 'ar';
    const status = dress.status || 'pending_review';

    let bannerClass = 'banner-pending';
    let statusBadgeText = i18n.t('track.statusPending');
    let statusDescText = i18n.t('track.pendingDesc');

    if (status === 'approved') {
      bannerClass = 'banner-approved';
      statusBadgeText = i18n.t('track.statusApproved');
      statusDescText = i18n.t('track.approvedDesc');
    } else if (status === 'rejected') {
      bannerClass = 'banner-rejected';
      statusBadgeText = i18n.t('track.statusRejected');
      statusDescText = i18n.t('track.rejectedDesc');
    }

    const coverImage = (dress.images && dress.images.length > 0) ? dress.images[0] : 'assets/logo.jpg';
    const trackingUrl = window.location.origin + window.location.pathname + '?track=' + dressId;

    const listings = getLocalListings();
    let multiSelectHtml = '';
    if (listings.length > 1) {
      multiSelectHtml = `
        <div style="margin-bottom: 16px; background: var(--surface-input); padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border-color);">
          <label style="font-size: 0.82rem; font-weight: 600; color: var(--rose-deep); display: block; margin-bottom: 6px;">
            👗 ${isAr ? 'اختر الفستان المراد متابعته:' : 'Select Listed Gown:'}
          </label>
          <select id="multiGownSelect" class="form-input" style="font-size: 0.85rem; padding: 6px 10px; background: #FFF;">
            ${listings.map((id, index) => `
              <option value="${id}" ${id === dressId ? 'selected' : ''}>
                ${isAr ? `طلب فستان #${listings.length - index}` : `Gown Submission #${listings.length - index}`} (${id.substring(0, 12)}...)
              </option>
            `).join('')}
          </select>
        </div>
      `;
    }

    elTrackingModalBody.innerHTML = `
      <div class="tracking-card-container">

        ${multiSelectHtml}

        <!-- Status Banner Header -->
        <div class="tracking-status-banner ${bannerClass}">
          <h3 style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            ${statusBadgeText}
          </h3>
          <p style="font-size: 0.88rem; opacity: 0.95;">
            ${statusDescText}
          </p>
        </div>

        <!-- Rejection Reason Notice Box (if status is rejected) -->
        ${(status === 'rejected' && dress.rejectionReason) ? `
          <div class="rejection-reason-notice">
            <strong style="display: block; margin-bottom: 4px; font-weight: 700;">
              ❌ ${i18n.t('track.rejectionReasonTitle')}
            </strong>
            <p style="font-size: 0.92rem; line-height: 1.5; color: #2B181B;">
              ${dress.rejectionReason}
            </p>
          </div>
        ` : ''}

        <!-- Gown Preview Card -->
        <div style="display: flex; gap: 14px; background: var(--surface-input); border: 1px solid var(--border-color); padding: 14px; border-radius: 14px; align-items: center;">
          <img src="${coverImage}" style="width: 70px; height: 90px; border-radius: 10px; object-fit: cover;" alt="صورة الفستان" />
          <div style="font-size: 0.88rem;">
            <div style="font-weight: 700; color: var(--rose-deep); margin-bottom: 4px;">${dress.brand ? dress.brand : (isAr ? 'فستان فاخر' : 'Luxury Gown')} ${dress.color ? `• ${dress.color}` : ''}</div>
            <div style="color: var(--text-secondary); margin-bottom: 2px;">${isAr ? 'المقاس:' : 'Size:'} ${dress.size || '-'}</div>
            <div style="color: var(--gold-dark); font-weight: 700;">${dress.rentPrice ? `${dress.rentPrice.toLocaleString()} ${i18n.t('review.currency')}` : (dress.sellPrice ? `${dress.sellPrice.toLocaleString()} ${i18n.t('review.currency')}` : '')}</div>
          </div>
        </div>

        <!-- Link Box inside modal -->
        <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; font-size: 0.82rem; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <span style="direction: ltr; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-secondary);">${trackingUrl}</span>
          <button type="button" class="btn-luxury btn-secondary-outline" id="btnModalCopyLink" style="padding: 6px 12px; font-size: 0.78rem; flex-shrink: 0;">${i18n.t('track.copyBtn')}</button>
        </div>

        <!-- Action Buttons Footer -->
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <a href="https://wa.me/201012345678?text=${encodeURIComponent(isAr ? `مرحباً، أستفسر عن فستاني المرفوع برابط المتابعة: ${trackingUrl}` : `Hello! Inquiring about my gown tracking link: ${trackingUrl}`)}" target="_blank" class="btn-luxury btn-secondary-outline" style="font-size: 0.82rem; padding: 8px 16px; color: #25D366; border-color: rgba(37, 211, 102, 0.4);">
            💬 ${isAr ? 'التواصل مع الدعم' : 'Contact Support'}
          </a>
        </div>

      </div>
    `;

    const btnModalCopy = document.getElementById('btnModalCopyLink');
    if (btnModalCopy) {
      btnModalCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(trackingUrl);
        btnModalCopy.textContent = i18n.t('track.copiedMsg');
        setTimeout(() => { btnModalCopy.textContent = i18n.t('track.copyBtn'); }, 2500);
      });
    }

    const elMultiSelect = document.getElementById('multiGownSelect');
    if (elMultiSelect) {
      elMultiSelect.addEventListener('change', (e) => {
        openTrackingModal(e.target.value);
      });
    }
  }

  // Initialize Tracking System
  setupTrackingSystem();

  async function submitForm() {
    collectFormData();
    const payload = FirebasePayloadBuilder.buildPayload(state.formData, imageService.getBase64Payload());

    elBtnNext.disabled = true;
    elBtnNextText.textContent = i18n.t('nav.saving');

    try {
      const docId = await saveDressToFirestore(payload);
      saveListingIdToLocal(docId);

      if (elSellerProgressCard) elSellerProgressCard.classList.add('hidden');
      if (elWizardCard) elWizardCard.classList.add('hidden');
      if (elStickyActionsBar) elStickyActionsBar.classList.add('hidden');

      const successView = document.getElementById('successView');
      if (successView) successView.classList.remove('hidden');

      // Setup Private Tracking Link Box on Success View
      const trackingLinkBox = document.getElementById('trackingLinkBox');
      const trackingUrlInput = document.getElementById('trackingUrlInput');
      const btnCopyTrackingUrl = document.getElementById('btnCopyTrackingUrl');
      const trackingCopyToast = document.getElementById('trackingCopyToast');
      const btnShareTrackingWa = document.getElementById('btnShareTrackingWa');
      const btnViewTrackingLive = document.getElementById('btnViewTrackingLive');

      if (docId && trackingLinkBox && trackingUrlInput) {
        const trackingUrl = window.location.origin + window.location.pathname + '?track=' + docId;
        trackingUrlInput.value = trackingUrl;
        trackingLinkBox.classList.remove('hidden');

        if (btnCopyTrackingUrl) {
          btnCopyTrackingUrl.addEventListener('click', () => {
            navigator.clipboard.writeText(trackingUrl);
            if (trackingCopyToast) trackingCopyToast.classList.remove('hidden');
            setTimeout(() => {
              if (trackingCopyToast) trackingCopyToast.classList.add('hidden');
            }, 3000);
          });
        }

        if (btnShareTrackingWa) {
          btnShareTrackingWa.addEventListener('click', () => {
            const isAr = i18n.lang === 'ar';
            const waText = isAr ? `رابط متابعة فستاني المرفوع على Once Gown: ${trackingUrl}` : `My Once Gown listing tracking link: ${trackingUrl}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
          });
        }

        if (btnViewTrackingLive) {
          btnViewTrackingLive.addEventListener('click', () => {
            openTrackingModal(docId);
          });
        }
      }

      const btnReset = document.getElementById('btnResetForm');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          localStorage.removeItem('once_gown_draft');
          window.location.reload();
        });
      }
    } catch (err) {
      alert('Error submitting listing, please try again: ' + (err.message || ''));
      elBtnNext.disabled = false;
      elBtnNextText.textContent = i18n.t('nav.submit');
    }
  }
});
