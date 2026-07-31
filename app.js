/**
 * Once Gown - Main Application Controller
 * Option 1 (Blurred Storefront Background) + Option 3 (Fixed Top Bar with 20-Day Countdown)
 * Handles 3-step wizard logic, auto-save state, validation,
 * custom color picker, ImageService, and real-time submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Image Service
  const imageService = new ImageService();

  // State Management (3 Steps)
  const state = {
    currentStep: 1,
    totalSteps: 3,
    formData: {},
    images: []
  };

  // Step Titles Configuration
  const stepTitles = {
    1: 'البيانات الأساسية وصور الفستان',
    2: 'تفاصيل اختيارية إضافية',
    3: 'المراجعة والإرسال'
  };

  // DOM Elements
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
        customColorText.textContent = `لون مخصص (${selectedHex})`;
      }
      document.querySelectorAll('[name="color"]').forEach(radio => {
        radio.checked = false;
      });
      state.formData.color = `لون مخصص (${selectedHex})`;
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
    elProgressFill.style.width = `${progressPercent}%`;
    elStepCountDisplay.textContent = `الخطوة ${state.currentStep} من ${state.totalSteps}`;
    elStepTitleDisplay.textContent = stepTitles[state.currentStep] || '';

    if (state.currentStep === 1) {
      elBtnBack.style.visibility = 'hidden';
    } else {
      elBtnBack.style.visibility = 'visible';
    }

    if (state.currentStep === state.totalSteps) {
      elBtnNextText.textContent = 'إرسال طلب الفستان ✨';
      renderReviewSummary();
    } else {
      elBtnNextText.textContent = 'المتابعة';
    }
  }

  // -------------------------------------------------------------
  // Form Validation per Step
  // -------------------------------------------------------------

  function validateCurrentStep() {
    clearErrors();
    let isValid = true;
    collectFormData();

    if (state.currentStep === 1) {
      if (imageService.getImages().length < 1) {
        showError('imageUploadArea', 'الرجاء رفع صورة واحدة على الأقل للفستان');
        isValid = false;
      }
      if (!state.formData.ownerName) {
        showError('ownerName', 'الرجاء إدخال الاسم بالكامل');
        isValid = false;
      }
      if (!state.formData.phone || !/^(01)[0-9]{9}$/.test(state.formData.phone)) {
        showError('phone', 'الرجاء إدخال رقم واتساب مصري صحيح (مثال: 01012345678)');
        isValid = false;
      }
      if (!state.formData.governorate) {
        showError('governorate', 'الرجاء اختيار المحافظة');
        isValid = false;
      }
      if (!state.formData.city) {
        showError('city', 'الرجاء إدخال المدينة');
        isValid = false;
      }
      if (!state.formData.address) {
        showError('address', 'الرجاء إدخال العنوان بالتفصيل');
        isValid = false;
      }
      if (!state.formData.dressCategory) {
        showError('dressCategory', 'الرجاء اختيار المناسبة');
        isValid = false;
      }
      if (!state.formData.color) {
        showError('color', 'الرجاء اختيار لون الفستان أو توضيحه');
        isValid = false;
      }
      if (state.formData.listingType.includes('إيجار')) {
        if (!state.formData.rentPrice || state.formData.rentPrice <= 0) {
          showError('rentPrice', 'الرجاء تحديد سعر الإيجار (بالجنيه)');
          isValid = false;
        }
      }
    }

    if (state.currentStep === 3) {
      const cbAgree = document.getElementById('agreementCheckbox');
      if (!cbAgree.checked) {
        showError('agreementBox', 'يجب الموافقة على صحة البيانات ومراجعة الفستان قبل الإرسال');
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
        if (input.name === 'accessories') {
          if (!Array.isArray(state.formData.accessories)) {
            state.formData.accessories = [];
          }
          if (input.checked && !state.formData.accessories.includes(input.value)) {
            state.formData.accessories.push(input.value);
          } else if (!input.checked) {
            state.formData.accessories = state.formData.accessories.filter(v => v !== input.value);
          }
        } else {
          state.formData[input.name] = input.checked;
        }
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
      elAutoSaveText.textContent = 'تم الحفظ تلقائياً ✨';
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
          if (Array.isArray(value)) {
            el.checked = value.includes(el.value);
          } else {
            el.checked = Boolean(value);
          }
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
        if (e.target.value === 'تفصيل') {
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
        if (e.target.value === 'نعم') {
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
        if (e.target.value === 'نعم') {
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
        if (type === 'للإيجار') {
          groupRentPrice.classList.remove('hidden');
          groupSellPrice.classList.add('hidden');
        } else if (type === 'للبيع') {
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
    elDropzone.addEventListener('click', () => elFileInput.click());

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
      if (e.dataTransfer.files.length > 0) {
        await imageService.processFiles(e.dataTransfer.files);
        renderImagePreviews();
        saveLocalDraft();
      }
    });

    elFileInput.addEventListener('change', async () => {
      if (elFileInput.files.length > 0) {
        await imageService.processFiles(elFileInput.files);
        renderImagePreviews();
        saveLocalDraft();
      }
    });
  }

  function renderImagePreviews() {
    const images = imageService.getImages();
    elPreviewGrid.innerHTML = '';

    images.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'image-preview-card';

      card.innerHTML = `
        <img src="${img.base64}" class="image-preview-img" alt="صورة الفستان" />
        ${img.isCover ? '<span class="cover-badge">الصورة الرئيسية</span>' : ''}
        <div class="image-actions-overlay">
          ${!img.isCover ? `<button type="button" class="action-btn-sm btn-set-cover" data-id="${img.id}">تعيين كغلاف</button>` : ''}
          <button type="button" class="action-btn-sm action-btn-danger btn-remove-img" data-id="${img.id}">حذف</button>
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

    elReviewSummary.innerHTML = `
      <div class="review-summary-card">
        <div class="review-section">
          <div class="review-section-title">بيانات المالكة والتواصل</div>
          <div class="review-row"><span class="review-label">الاسم:</span><span class="review-value">${d.ownerName || '-'}</span></div>
          <div class="review-row"><span class="review-label">واتساب:</span><span class="review-value">${d.phone || '-'}</span></div>
          <div class="review-row"><span class="review-label">العنوان:</span><span class="review-value">${d.governorate || ''}، ${d.city || ''}، ${d.address || '-'}</span></div>
        </div>

        <div class="review-section">
          <div class="review-section-title">مواصفات الفستان والأسعار</div>
          <div class="review-row"><span class="review-label">المناسبة والماركة:</span><span class="review-value">${d.dressCategory || ''} (${d.brand || 'غير محدد'})</span></div>
          <div class="review-row"><span class="review-label">اللون:</span><span class="review-value">${d.color || '-'}</span></div>
          <div class="review-row"><span class="review-label">المقاس:</span><span class="review-value">${d.size || 'غير محدد'}</span></div>
          ${d.rentPrice ? `<div class="review-row"><span class="review-label">سعر الإيجار:</span><span class="review-value">${d.rentPrice} ج.م (${d.rentDuration || '3 أيام'})</span></div>` : ''}
          ${d.sellPrice ? `<div class="review-row"><span class="review-label">سعر البيع:</span><span class="review-value">${d.sellPrice} ج.م</span></div>` : ''}
          <div class="review-row"><span class="review-label">عدد الصور المرفقة:</span><span class="review-value">${images.length} صور</span></div>
        </div>

        <div class="review-section">
          <div class="review-section-title">ملاحظات وملحقات الفستان</div>
          <div class="review-row"><span class="review-label">الملحقات:</span><span class="review-value">${(d.accessories && d.accessories.length > 0) ? d.accessories.join('، ') : 'بدون ملحقات إضافية'}</span></div>
          <div class="review-row"><span class="review-label">الملاحظات:</span><span class="review-value">${d.notes || 'لا يوجد'}</span></div>
        </div>
      </div>
    `;
  }

  async function submitForm() {
    collectFormData();
    const payload = FirebasePayloadBuilder.buildPayload(state.formData, imageService.getBase64Payload());

    elBtnNext.disabled = true;
    elBtnNextText.textContent = 'جاري حفظ الطلب... ✨';

    try {
      await saveDressToFirestore(payload);

      document.querySelector('.progress-card').classList.add('hidden');
      document.querySelector('.wizard-card').classList.add('hidden');
      document.querySelector('.sticky-actions-bar').classList.add('hidden');

      const successView = document.getElementById('successView');
      successView.classList.remove('hidden');

      const btnReset = document.getElementById('btnResetForm');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          localStorage.removeItem('once_gown_draft');
          window.location.reload();
        });
      }
    } catch (err) {
      alert('حدث خطأ أثناء إرسال الفستان، يرجى المحاولة مرة أخرى: ' + (err.message || ''));
      elBtnNext.disabled = false;
      elBtnNextText.textContent = 'إرسال طلب الفستان ✨';
    }
  }
});
