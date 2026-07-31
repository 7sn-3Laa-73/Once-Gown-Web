/**
 * Once Gown - Firebase Payload Builder
 * Maps the 3-step submission form state to the exact Firestore document schema.
 */

class FirebasePayloadBuilder {
  /**
   * Build complete Firestore dress document payload object
   * @param {Object} formData Raw form values
   * @param {string[]} imageBase64List List of Base64 image strings
   * @returns {Object} Firestore compliant object payload
   */
  static buildPayload(formData, imageBase64List = []) {
    const now = new Date().toISOString();

    return {
      // Owner Data
      ownerName: (formData.ownerName || '').trim(),
      phone: (formData.phone || '').trim(),
      secondPhone: (formData.secondPhone || '').trim(),
      governorate: (formData.governorate || '').trim(),
      city: (formData.city || '').trim(),
      address: (formData.address || '').trim(),

      // Dress Specifications
      listingType: formData.listingType || 'للإيجار والبيع',
      dressCategory: formData.dressCategory || '',
      brand: (formData.brand || '').trim(),
      color: formData.color || '',
      size: formData.size || '',
      weightRange: (formData.weightRange || '').trim(),
      heightRange: (formData.heightRange || '').trim(),
      fabric: (formData.fabric || '').trim(),
      readyOrTailored: formData.readyOrTailored || 'جاهز',
      tailorName: formData.readyOrTailored === 'تفصيل' ? (formData.tailorName || '').trim() : '',

      // Optional Condition Details
      condition: formData.condition || 'جديد',
      hasDefects: Boolean(formData.hasDefects === 'نعم'),
      defectDetails: formData.hasDefects === 'نعم' ? (formData.defectDetails || '').trim() : '',

      // Financials
      rentPrice: formData.rentPrice ? Number(formData.rentPrice) : 0,
      rentDuration: formData.rentDuration || '3 أيام',
      sellPrice: formData.sellPrice ? Number(formData.sellPrice) : 0,
      deposit: formData.deposit ? Number(formData.deposit) : 0,

      // Optional Alterations
      alterationsAllowed: Boolean(formData.alterationsAllowed === 'نعم'),
      alterationDetails: formData.alterationsAllowed === 'نعم' ? (formData.alterationDetails || '').trim() : '',

      // Optional Accessories Array
      accessories: Array.isArray(formData.accessories) ? formData.accessories : [],

      // Media (Base64 list)
      images: imageBase64List,

      // Additional Notes
      notes: (formData.notes || '').trim(),

      // System Metadata
      status: 'pending_review',
      createdAt: now,
      updatedAt: now,
      reviewedAt: null,
      approvedBy: null
    };
  }
}
