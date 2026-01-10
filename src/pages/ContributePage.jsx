import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Landmark,
  PenLine,
  Plus,
  Camera,
  ChevronRight,
  CheckCircle,
  Upload,
  X,
  MapPin,
  Calendar,
  FileText,
  User,
  Mail,
  Phone,
  Send,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { useContribution, CONTRIBUTION_TYPES } from '../context/ContributionContext';
import { COMMUNES } from '../data/communes';

// Contribution type options
const contributionTypeOptions = [
  {
    id: CONTRIBUTION_TYPES.NEW_HERITAGE,
    icon: Plus,
    titleVi: 'Đề xuất Di sản mới',
    titleEn: 'Suggest New Heritage',
    descVi: 'Đề xuất thêm một di sản văn hóa mới vào hệ thống',
    descEn: 'Suggest adding a new cultural heritage to the system',
    color: 'bg-heritage-red-100 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300',
    borderColor: 'border-heritage-red-300 dark:border-heritage-red-700',
    iconBg: 'bg-heritage-red-600',
  },
  {
    id: CONTRIBUTION_TYPES.CORRECTION,
    icon: PenLine,
    titleVi: 'Yêu cầu Sửa đổi',
    titleEn: 'Request Correction',
    descVi: 'Báo cáo thông tin sai hoặc cần cập nhật',
    descEn: 'Report incorrect or outdated information',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-300 dark:border-blue-700',
    iconBg: 'bg-blue-600',
  },
  {
    id: CONTRIBUTION_TYPES.ADDITIONAL_INFO,
    icon: FileText,
    titleVi: 'Bổ sung Thông tin',
    titleEn: 'Add Information',
    descVi: 'Thêm thông tin chi tiết cho di sản hiện có',
    descEn: 'Add detailed information to existing heritage',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    iconBg: 'bg-emerald-600',
  },
  {
    id: CONTRIBUTION_TYPES.PHOTO,
    icon: Camera,
    titleVi: 'Đóng góp Hình ảnh',
    titleEn: 'Contribute Photos',
    descVi: 'Chia sẻ hình ảnh về di sản văn hóa',
    descEn: 'Share photos of cultural heritage',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-300 dark:border-purple-700',
    iconBg: 'bg-purple-600',
  },
];

export default function ContributePage() {
  const { t } = useTranslation();
  const { submitContribution } = useContribution();
  const isVietnamese = t('common.all') !== 'All';

  const [step, setStep] = useState(1); // 1: select type, 2: fill form, 3: success
  const [selectedType, setSelectedType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedContribution, setSubmittedContribution] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    // Contributor info
    contributorName: '',
    contributorEmail: '',
    contributorPhone: '',

    // Heritage info (for new heritage)
    heritageName: '',
    heritageAddress: '',
    heritageCommune: '',
    heritageDescription: '',
    heritageHistory: '',
    heritageYearBuilt: '',
    heritageCondition: '',
    heritageSource: '',

    // Correction info
    existingHeritageName: '',
    fieldToCorrect: '',
    currentValue: '',
    suggestedValue: '',
    correctionReason: '',

    // Additional info
    additionalInfoType: '',
    additionalContent: '',

    // Photos
    photos: [],
    photoDescriptions: '',
    copyrightConfirmed: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 5) {
      setErrors((prev) => ({ ...prev, photos: isVietnamese ? 'Tối đa 5 ảnh' : 'Maximum 5 photos' }));
      return;
    }

    // Convert to base64 for demo (in production, would upload to server)
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, { name: file.name, data: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate based on contribution type
    if (selectedType === CONTRIBUTION_TYPES.NEW_HERITAGE) {
      if (!formData.heritageName.trim()) {
        newErrors.heritageName = isVietnamese ? 'Vui lòng nhập tên di sản' : 'Please enter heritage name';
      }
      if (!formData.heritageAddress.trim()) {
        newErrors.heritageAddress = isVietnamese ? 'Vui lòng nhập địa chỉ' : 'Please enter address';
      }
      if (!formData.heritageDescription.trim()) {
        newErrors.heritageDescription = isVietnamese ? 'Vui lòng nhập mô tả' : 'Please enter description';
      }
    }

    if (selectedType === CONTRIBUTION_TYPES.CORRECTION) {
      if (!formData.existingHeritageName.trim()) {
        newErrors.existingHeritageName = isVietnamese ? 'Vui lòng nhập tên di sản' : 'Please enter heritage name';
      }
      if (!formData.fieldToCorrect.trim()) {
        newErrors.fieldToCorrect = isVietnamese ? 'Vui lòng chọn trường cần sửa' : 'Please select field to correct';
      }
      if (!formData.suggestedValue.trim()) {
        newErrors.suggestedValue = isVietnamese ? 'Vui lòng nhập giá trị đề xuất' : 'Please enter suggested value';
      }
    }

    if (selectedType === CONTRIBUTION_TYPES.ADDITIONAL_INFO) {
      if (!formData.existingHeritageName.trim()) {
        newErrors.existingHeritageName = isVietnamese ? 'Vui lòng nhập tên di sản' : 'Please enter heritage name';
      }
      if (!formData.additionalContent.trim()) {
        newErrors.additionalContent = isVietnamese ? 'Vui lòng nhập nội dung' : 'Please enter content';
      }
    }

    if (selectedType === CONTRIBUTION_TYPES.PHOTO) {
      if (formData.photos.length === 0) {
        newErrors.photos = isVietnamese ? 'Vui lòng tải lên ít nhất 1 ảnh' : 'Please upload at least 1 photo';
      }
      if (!formData.copyrightConfirmed) {
        newErrors.copyrightConfirmed = isVietnamese ? 'Vui lòng xác nhận bản quyền' : 'Please confirm copyright';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const contributor = {
      name: formData.contributorName,
      email: formData.contributorEmail,
      phone: formData.contributorPhone,
    };

    let data = {};

    switch (selectedType) {
      case CONTRIBUTION_TYPES.NEW_HERITAGE:
        data = {
          name: formData.heritageName,
          address: formData.heritageAddress,
          commune: formData.heritageCommune,
          description: formData.heritageDescription,
          history: formData.heritageHistory,
          yearBuilt: formData.heritageYearBuilt,
          condition: formData.heritageCondition,
          source: formData.heritageSource,
          photos: formData.photos,
        };
        break;

      case CONTRIBUTION_TYPES.CORRECTION:
        data = {
          heritageName: formData.existingHeritageName,
          field: formData.fieldToCorrect,
          currentValue: formData.currentValue,
          suggestedValue: formData.suggestedValue,
          reason: formData.correctionReason,
        };
        break;

      case CONTRIBUTION_TYPES.ADDITIONAL_INFO:
        data = {
          heritageName: formData.existingHeritageName,
          infoType: formData.additionalInfoType,
          content: formData.additionalContent,
          source: formData.heritageSource,
        };
        break;

      case CONTRIBUTION_TYPES.PHOTO:
        data = {
          heritageName: formData.existingHeritageName,
          photos: formData.photos,
          descriptions: formData.photoDescriptions,
        };
        break;
    }

    const contribution = submitContribution(selectedType, data, contributor);
    setSubmittedContribution(contribution);
    setIsSubmitting(false);
    setStep(3);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedType(null);
    setSubmittedContribution(null);
    setFormData({
      contributorName: '',
      contributorEmail: '',
      contributorPhone: '',
      heritageName: '',
      heritageAddress: '',
      heritageCommune: '',
      heritageDescription: '',
      heritageHistory: '',
      heritageYearBuilt: '',
      heritageCondition: '',
      heritageSource: '',
      existingHeritageName: '',
      fieldToCorrect: '',
      currentValue: '',
      suggestedValue: '',
      correctionReason: '',
      additionalInfoType: '',
      additionalContent: '',
      photos: [],
      photoDescriptions: '',
      copyrightConfirmed: false,
    });
    setErrors({});
  };

  // Render Step 1: Type Selection
  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/30 mb-4">
          <Sparkles className="w-8 h-8 text-heritage-gold-600 dark:text-heritage-gold-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
          {isVietnamese ? 'Chọn loại đóng góp' : 'Select Contribution Type'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isVietnamese
            ? 'Bạn muốn đóng góp gì cho di sản văn hóa Cà Mau?'
            : 'How would you like to contribute to Ca Mau cultural heritage?'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contributionTypeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setSelectedType(option.id);
              setStep(2);
            }}
            className={`group p-6 rounded-2xl border-2 ${option.borderColor} ${option.color} text-left transition-all hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${option.iconBg} flex items-center justify-center flex-shrink-0`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">
                  {isVietnamese ? option.titleVi : option.titleEn}
                </h3>
                <p className="text-sm opacity-80">
                  {isVietnamese ? option.descVi : option.descEn}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render form input with error
  const renderInput = (field, label, placeholder, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-heritage-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          errors[field]
            ? 'border-red-400 dark:border-red-600'
            : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 transition-all`}
      />
      {errors[field] && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors[field]}</p>
      )}
    </div>
  );

  // Render textarea with error
  const renderTextarea = (field, label, placeholder, rows = 4, required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-heritage-red-500">*</span>}
      </label>
      <textarea
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border ${
          errors[field]
            ? 'border-red-400 dark:border-red-600'
            : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 transition-all resize-none`}
      />
      {errors[field] && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors[field]}</p>
      )}
    </div>
  );

  // Render Step 2: Form
  const renderForm = () => {
    const selectedOption = contributionTypeOptions.find((o) => o.id === selectedType);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setStep(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className={`w-12 h-12 rounded-xl ${selectedOption.iconBg} flex items-center justify-center`}>
            <selectedOption.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">
              {isVietnamese ? selectedOption.titleVi : selectedOption.titleEn}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isVietnamese ? 'Điền thông tin bên dưới' : 'Fill in the information below'}
            </p>
          </div>
        </div>

        {/* Contributor Info Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-heritage-gold-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {isVietnamese ? 'Thông tin người đóng góp' : 'Contributor Information'}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({isVietnamese ? 'tùy chọn' : 'optional'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput(
              'contributorName',
              isVietnamese ? 'Họ và tên' : 'Full Name',
              isVietnamese ? 'Nguyễn Văn A' : 'John Doe'
            )}
            {renderInput(
              'contributorEmail',
              'Email',
              'email@example.com',
              'email'
            )}
            {renderInput(
              'contributorPhone',
              isVietnamese ? 'Số điện thoại' : 'Phone',
              '0912 345 678',
              'tel'
            )}
          </div>
        </div>

        {/* Type-specific forms */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          {/* New Heritage Form */}
          {selectedType === CONTRIBUTION_TYPES.NEW_HERITAGE && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-heritage-red-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {isVietnamese ? 'Thông tin Di sản' : 'Heritage Information'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  'heritageName',
                  isVietnamese ? 'Tên di sản' : 'Heritage Name',
                  isVietnamese ? 'Ví dụ: Đình làng XYZ' : 'E.g., XYZ Temple',
                  'text',
                  true
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isVietnamese ? 'Xã/Phường' : 'Commune/Ward'}
                  </label>
                  <select
                    value={formData.heritageCommune}
                    onChange={(e) => handleInputChange('heritageCommune', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 transition-all"
                  >
                    <option value="">{isVietnamese ? '-- Chọn xã/phường --' : '-- Select commune --'}</option>
                    {COMMUNES.map((commune) => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>
              </div>

              {renderInput(
                'heritageAddress',
                isVietnamese ? 'Địa chỉ chi tiết' : 'Detailed Address',
                isVietnamese ? 'Số nhà, tên đường, ấp/khóm...' : 'House number, street name...',
                'text',
                true
              )}

              {renderTextarea(
                'heritageDescription',
                isVietnamese ? 'Mô tả di sản' : 'Heritage Description',
                isVietnamese ? 'Mô tả về di sản, đặc điểm kiến trúc, ý nghĩa...' : 'Describe the heritage, architecture, significance...',
                4,
                true
              )}

              {renderTextarea(
                'heritageHistory',
                isVietnamese ? 'Lịch sử và giá trị văn hóa' : 'History and Cultural Value',
                isVietnamese ? 'Lịch sử hình thành, các sự kiện quan trọng...' : 'Formation history, important events...',
                4
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  'heritageYearBuilt',
                  isVietnamese ? 'Năm xây dựng (nếu biết)' : 'Year Built (if known)',
                  isVietnamese ? 'Ví dụ: 1920' : 'E.g., 1920'
                )}
                {renderInput(
                  'heritageCondition',
                  isVietnamese ? 'Tình trạng hiện tại' : 'Current Condition',
                  isVietnamese ? 'Ví dụ: Đã được trùng tu' : 'E.g., Recently restored'
                )}
              </div>

              {renderInput(
                'heritageSource',
                isVietnamese ? 'Nguồn thông tin/Tham khảo' : 'Source/Reference',
                isVietnamese ? 'Sách, tài liệu, người cung cấp thông tin...' : 'Books, documents, informants...'
              )}
            </>
          )}

          {/* Correction Form */}
          {selectedType === CONTRIBUTION_TYPES.CORRECTION && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <PenLine className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {isVietnamese ? 'Thông tin Sửa đổi' : 'Correction Information'}
                </h3>
              </div>

              {renderInput(
                'existingHeritageName',
                isVietnamese ? 'Tên di sản cần sửa' : 'Heritage Name to Correct',
                isVietnamese ? 'Nhập tên di sản' : 'Enter heritage name',
                'text',
                true
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isVietnamese ? 'Trường cần sửa' : 'Field to Correct'} <span className="text-heritage-red-500">*</span>
                </label>
                <select
                  value={formData.fieldToCorrect}
                  onChange={(e) => handleInputChange('fieldToCorrect', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fieldToCorrect ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 transition-all`}
                >
                  <option value="">{isVietnamese ? '-- Chọn trường --' : '-- Select field --'}</option>
                  <option value="name">{isVietnamese ? 'Tên' : 'Name'}</option>
                  <option value="address">{isVietnamese ? 'Địa chỉ' : 'Address'}</option>
                  <option value="yearBuilt">{isVietnamese ? 'Năm xây dựng' : 'Year Built'}</option>
                  <option value="yearRanked">{isVietnamese ? 'Năm xếp hạng' : 'Year Ranked'}</option>
                  <option value="rankingType">{isVietnamese ? 'Loại xếp hạng' : 'Ranking Type'}</option>
                  <option value="description">{isVietnamese ? 'Mô tả' : 'Description'}</option>
                  <option value="other">{isVietnamese ? 'Khác' : 'Other'}</option>
                </select>
                {errors.fieldToCorrect && (
                  <p className="mt-1 text-sm text-red-500">{errors.fieldToCorrect}</p>
                )}
              </div>

              {renderInput(
                'currentValue',
                isVietnamese ? 'Giá trị hiện tại (sai)' : 'Current Value (incorrect)',
                isVietnamese ? 'Thông tin hiện đang hiển thị sai' : 'Currently displayed incorrect information'
              )}

              {renderTextarea(
                'suggestedValue',
                isVietnamese ? 'Giá trị đề xuất (đúng)' : 'Suggested Value (correct)',
                isVietnamese ? 'Thông tin đúng theo bạn biết' : 'Correct information as you know',
                3,
                true
              )}

              {renderTextarea(
                'correctionReason',
                isVietnamese ? 'Lý do/Bằng chứng' : 'Reason/Evidence',
                isVietnamese ? 'Giải thích tại sao bạn cho rằng thông tin này sai và nguồn tham khảo' : 'Explain why you think this is incorrect and your references',
                3
              )}
            </>
          )}

          {/* Additional Info Form */}
          {selectedType === CONTRIBUTION_TYPES.ADDITIONAL_INFO && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {isVietnamese ? 'Thông tin Bổ sung' : 'Additional Information'}
                </h3>
              </div>

              {renderInput(
                'existingHeritageName',
                isVietnamese ? 'Tên di sản' : 'Heritage Name',
                isVietnamese ? 'Nhập tên di sản cần bổ sung thông tin' : 'Enter heritage name',
                'text',
                true
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isVietnamese ? 'Loại thông tin' : 'Information Type'}
                </label>
                <select
                  value={formData.additionalInfoType}
                  onChange={(e) => handleInputChange('additionalInfoType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-100 dark:focus:ring-heritage-gold-900/50 transition-all"
                >
                  <option value="">{isVietnamese ? '-- Chọn loại --' : '-- Select type --'}</option>
                  <option value="history">{isVietnamese ? 'Lịch sử' : 'History'}</option>
                  <option value="architecture">{isVietnamese ? 'Kiến trúc' : 'Architecture'}</option>
                  <option value="culture">{isVietnamese ? 'Văn hóa' : 'Culture'}</option>
                  <option value="events">{isVietnamese ? 'Sự kiện' : 'Events'}</option>
                  <option value="stories">{isVietnamese ? 'Truyền thuyết/Câu chuyện' : 'Legends/Stories'}</option>
                  <option value="other">{isVietnamese ? 'Khác' : 'Other'}</option>
                </select>
              </div>

              {renderTextarea(
                'additionalContent',
                isVietnamese ? 'Nội dung bổ sung' : 'Additional Content',
                isVietnamese ? 'Nhập thông tin chi tiết bạn muốn bổ sung...' : 'Enter detailed information you want to add...',
                5,
                true
              )}

              {renderInput(
                'heritageSource',
                isVietnamese ? 'Nguồn thông tin' : 'Source',
                isVietnamese ? 'Sách, tài liệu, người cung cấp...' : 'Books, documents, informants...'
              )}
            </>
          )}

          {/* Photo Form */}
          {selectedType === CONTRIBUTION_TYPES.PHOTO && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {isVietnamese ? 'Đóng góp Hình ảnh' : 'Photo Contribution'}
                </h3>
              </div>

              {renderInput(
                'existingHeritageName',
                isVietnamese ? 'Tên di sản (nếu có)' : 'Heritage Name (if applicable)',
                isVietnamese ? 'Di sản mà ảnh này thuộc về' : 'Heritage this photo belongs to'
              )}

              {/* Photo upload area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isVietnamese ? 'Tải ảnh lên' : 'Upload Photos'} <span className="text-heritage-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">({isVietnamese ? 'Tối đa 5 ảnh' : 'Max 5 photos'})</span>
                </label>

                <div className={`border-2 border-dashed ${errors.photos ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} rounded-xl p-6 text-center`}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {isVietnamese ? 'Nhấp để tải ảnh' : 'Click to upload'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> {isVietnamese ? 'hoặc kéo thả' : 'or drag and drop'}</span>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 10MB each)</p>
                  </label>
                </div>

                {errors.photos && (
                  <p className="mt-1 text-sm text-red-500">{errors.photos}</p>
                )}

                {/* Photo previews */}
                {formData.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.data}
                          alt={photo.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {renderTextarea(
                'photoDescriptions',
                isVietnamese ? 'Mô tả ảnh' : 'Photo Descriptions',
                isVietnamese ? 'Mô tả ngắn về các ảnh bạn đăng tải...' : 'Brief description of the photos you upload...',
                3
              )}

              {/* Copyright confirmation */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.copyrightConfirmed}
                    onChange={(e) => handleInputChange('copyrightConfirmed', e.target.checked)}
                    className="mt-1 w-4 h-4 text-heritage-red-600 border-gray-300 rounded focus:ring-heritage-gold-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {isVietnamese
                      ? 'Tôi xác nhận rằng tôi là chủ sở hữu hoặc có quyền chia sẻ các hình ảnh này, và cho phép sử dụng chúng trong dự án Di sản Văn hóa Cà Mau.'
                      : 'I confirm that I own or have the right to share these images, and allow their use in the Ca Mau Cultural Heritage project.'}
                  </span>
                </label>
                {errors.copyrightConfirmed && (
                  <p className="mt-1 text-sm text-red-500 ml-7">{errors.copyrightConfirmed}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isVietnamese ? 'Quay lại' : 'Back'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isVietnamese ? 'Đang gửi...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {isVietnamese ? 'Gửi đóng góp' : 'Submit Contribution'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render Step 3: Success
  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
        <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
        {isVietnamese ? 'Cảm ơn bạn đã đóng góp!' : 'Thank you for your contribution!'}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        {isVietnamese
          ? 'Đóng góp của bạn đã được ghi nhận và sẽ được xem xét bởi đội ngũ quản trị. Chúng tôi sẽ liên hệ nếu cần thêm thông tin.'
          : 'Your contribution has been recorded and will be reviewed by our admin team. We will contact you if we need more information.'}
      </p>

      {submittedContribution && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-w-sm mx-auto mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Mã đóng góp:' : 'Contribution ID:'}
          </p>
          <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {submittedContribution.id}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-heritage-red-700 text-white rounded-xl font-medium hover:bg-heritage-red-800 transition-colors"
        >
          {isVietnamese ? 'Đóng góp thêm' : 'Contribute More'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="relative bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-6 sm:p-8 mb-8 text-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-md">
              <Landmark className="w-7 h-7 text-heritage-red-800 dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold">
                {isVietnamese ? 'Đóng góp Di sản' : 'Contribute Heritage'}
              </h1>
              <p className="text-heritage-gold-300">
                {isVietnamese
                  ? 'Cùng nhau bảo tồn và phát huy di sản văn hóa Cà Mau'
                  : 'Together we preserve and promote Ca Mau cultural heritage'}
              </p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-heritage-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-heritage-red-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-heritage-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-heritage-red-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              ✓
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {step === 1 && renderTypeSelection()}
          {step === 2 && renderForm()}
          {step === 3 && renderSuccess()}
        </div>

        {/* Info note */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {isVietnamese
              ? 'Tất cả đóng góp sẽ được xem xét và xác minh trước khi được thêm vào hệ thống. Thông tin cá nhân của bạn (nếu cung cấp) sẽ được bảo mật.'
              : 'All contributions will be reviewed and verified before being added to the system. Your personal information (if provided) will be kept confidential.'}
          </p>
        </div>
      </div>
    </div>
  );
}
