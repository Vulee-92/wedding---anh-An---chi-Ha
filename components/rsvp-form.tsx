"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, User, Phone, Users, ChevronDown, XCircle } from "lucide-react"

interface RSVPFormProps {
  onSubmit?: (data: RSVPData) => void
  className?: string
}

interface RSVPData {
  name: string
  phone: string
  guests: number
  attendance: string
}

export default function RSVPForm({ onSubmit, className = "" }: RSVPFormProps) {
  const [formData, setFormData] = useState<RSVPData>({
    name: "",
    phone: "",
    guests: 1,
    attendance: "",
  })
  const [showConfirmation, setShowConfirmation] = useState<"success" | "declined" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // THAY THẾ 'YOUR_WEB_APP_URL_HERE' BẰNG URL BẠN ĐÃ SAO CHÉP TỪ APPS SCRIPT
  const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxL_HoEZ9a2L2iANEASdFbbxGutPLG84_v5fn9pL5XTTmIdcdgpuMWcSC5WK0AeUxjR/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Quan trọng cho CORS nếu bạn không cấu hình cụ thể bên phía Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Nếu bạn muốn xử lý phản hồi từ Apps Script (chẳng hạn kiểm tra success: true)
      // thì bạn cần bỏ 'no-cors' và cấu hình Apps Script để trả về tiêu đề CORS phù hợp.
      // Tuy nhiên, với "no-cors", chúng ta không thể đọc phản hồi.
      // Về cơ bản, chúng ta tin rằng nếu không có lỗi, nó sẽ hoạt động.

      // Nếu bạn muốn dùng onSubmit prop bên ngoài (ví dụ cho mục đích test/debug khác)
      if (onSubmit) {
         onSubmit(formData);
      }

      if (formData.attendance === "attending") {
        setShowConfirmation("success");
      } else if (formData.attendance === "not-attending") {
        setShowConfirmation("declined");
      }

      setTimeout(() => setShowConfirmation(null), 5000); // Ẩn thông báo sau 5 giây
      setFormData({ // Reset form data
        name: "",
        phone: "",
        guests: 1,
        attendance: "",
      });

    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Đã có lỗi xảy ra khi gửi xác nhận. Vui lòng thử lại!"); // Thông báo lỗi cho người dùng
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof RSVPData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (showConfirmation === "success") {
    return (
      <div
        className={`bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 ${className}`}
      >
        <div className="text-center space-y-8 animate-fade-in">
          {/* Success Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-400 fill-current animate-heartbeat" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-light text-gray-700 leading-relaxed"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Cảm ơn bạn rất nhiều!
            </h3>
            <p className="text-gray-500 font-light text-lg leading-relaxed max-w-md mx-auto">
              Chúng tôi đã nhận được xác nhận của bạn và rất mong được gặp bạn trong ngày trọng đại này.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-3 bg-pink-25 border border-pink-100 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
            <span className="text-pink-500 font-normal text-sm">Đã xác nhận tham gia</span>
          </div>
        </div>
      </div>
    )
  }

  if (showConfirmation === "declined") {
    return (
      <div
        className={`bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 ${className}`}
      >
        <div className="text-center space-y-8 animate-fade-in">
          {/* Declined Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-gray-400 fill-current animate-shake" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Declined Message */}
          <div className="space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-light text-gray-700 leading-relaxed"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Rất tiếc khi bạn không thể tham dự!
            </h3>
            <p className="text-gray-500 font-light text-lg leading-relaxed max-w-md mx-auto" style={{ fontFamily: "Playfair Display, serif" }} >
              Chúng tôi hiểu rằng bạn có thể có những kế hoạch khác. Cảm ơn bạn đã thông báo cho chúng tôi.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-3 bg-gray-100 border border-gray-200 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <span className="text-gray-500 font-normal text-sm"  style={{ fontFamily: "Playfair Display, serif" }}>Không thể tham gia</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2
          className="text-xl sm:text-2xl font-light text-gray-700 leading-relaxed mb-6"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Hãy xác nhận sự hiện diện của bạn trong ngày trọng đại
        </h2>

        {/* Elegant Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field */}
        <div className="space-y-3">
          <Label className="text-gray-700 text-base font-light flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span  style={{ fontFamily: "Playfair Display, serif" }}>Họ và Tên</span>
            <span className="text-pink-300 text-sm"  style={{ fontFamily: "Playfair Display, serif" }}>*</span>
          </Label>
          <div className="relative">
            <Input
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              style={{ fontFamily: "Playfair Display, serif" }}
              className="w-full px-6 py-4 text-base border border-gray-100 bg-gray-25 rounded-[24px] focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-pink-100 transition-all duration-300 placeholder:text-gray-300"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-3">
          <Label className="text-gray-700 text-base font-light flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span  style={{ fontFamily: "Playfair Display, serif" }}>Số Điện Thoại</span>
            <span className="text-gray-300 text-sm font-light"  style={{ fontFamily: "Playfair Display, serif" }}>(Không bắt buộc)</span>
          </Label>
          <div className="relative">
            <Input
              type="tel"
              style={{ fontFamily: "Playfair Display, serif" }}
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full px-6 py-4 text-base border border-gray-100 bg-gray-25 rounded-[24px] focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-pink-100 transition-all duration-300 placeholder:text-gray-300"
              placeholder="Số điện thoại liên hệ"
            />
          </div>
        </div>

        {/* Guest Count */}
        <div className="space-y-3">
          <Label className="text-gray-700 text-base font-light flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span  style={{ fontFamily: "Playfair Display, serif" }}>Số Lượng Khách</span>
          </Label>
          <div className="relative">
            <select
              value={formData.guests}
              style={{ fontFamily: "Playfair Display, serif" }}
              onChange={(e) => updateField("guests", Number.parseInt(e.target.value))}
              className="w-full px-6 py-4 text-base border border-gray-100 bg-gray-25 rounded-[24px] focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-pink-100 transition-all duration-300 appearance-none cursor-pointer text-gray-700"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num} >
                  {num} {num === 1 ? "người" : "người"}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
          </div>
        </div>

        {/* Attendance Status */}
        <div className="space-y-4">
          <Label className="text-gray-700 text-base font-light"  style={{ fontFamily: "Playfair Display, serif" }}>Trạng Thái Tham Gia</Label>
          <div className="space-y-3">
            {/* Attending Option */}
            <label className="block cursor-pointer group">
              <div
                className={`p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                  formData.attendance === "attending"
                    ? "border-pink-200 bg-pink-25"
                    : "border-gray-100 bg-gray-25 hover:border-pink-100 hover:bg-pink-25"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="attending"
                      style={{ fontFamily: "Playfair Display, serif" }}
                      checked={formData.attendance === "attending"}
                      onChange={(e) => updateField("attendance", e.target.value)}
                      className="w-5 h-5 text-pink-300 border-2 border-gray-200 focus:ring-pink-100 focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-light text-gray-700"  style={{ fontFamily: "Playfair Display, serif" }}>✨ Tham Gia</span>
                  </div>
                  {formData.attendance === "attending" && (
                    <Heart className="w-5 h-5 text-pink-300 fill-current animate-pulse" />
                  )}
                </div>
              </div>
            </label>

            {/* Not Attending Option */}
            <label className="block cursor-pointer group">
              <div
                className={`p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                  formData.attendance === "not-attending"
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-100 bg-gray-25 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="not-attending"
                      style={{ fontFamily: "Playfair Display, serif" }}
                      checked={formData.attendance === "not-attending"}
                      onChange={(e) => updateField("attendance", e.target.value)}
                      className="w-5 h-5 text-gray-300 border-2 border-gray-200 focus:ring-gray-100 focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-light text-gray-700"  style={{ fontFamily: "Playfair Display, serif" }}>😔 Rất Tiếc Không Thể Tham Dự</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.attendance}
            className="w-full hover:from-pink-400 hover:to-pink-500 text-white text-base font-light py-6 rounded-[24px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
          >
            <div className="flex items-center justify-center space-x-3">
              <Heart className="w-5 h-5 fill-current" />
              <span  style={{ fontFamily: "Playfair Display, serif" }}>{isSubmitting ? "Đang gửi..." : "Gửi Xác Nhận"}</span>
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </Button>
        </div>
      </form>

      {/* Footer Note */}
      <div className="text-center mt-8 pt-6 border-t border-gray-100">
        <p className="text-gray-400 text-sm font-light leading-relaxed"  style={{ fontFamily: "Playfair Display, serif" }}>
          Sự hiện diện của bạn là món quà quý giá nhất cho chúng tôi
        </p>
      </div>
    </div>
  )
}