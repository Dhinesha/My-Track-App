/**
 * Data formatting utilities
 */

/**
 * Format phone number as +91 XXX XXX XXXX
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "").slice(-10);
  if (!cleaned) return "";
  return `+91 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

/**
 * Format date as DD MMM YYYY
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Format date range as DD MMM - DD MMM YYYY
 */
export const formatDateRange = (
  startDate: Date | string,
  endDate: Date | string,
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startFormatted = `${start.getDate()} ${months[start.getMonth()]}`;
  const endFormatted = `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;

  return `${startFormatted} – ${endFormatted}`;
};

/**
 * Format time as HH:MM AM/PM
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

/**
 * Format timestamp as "2 hours ago" or "Just now"
 */
export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/**
 * Format currency as ₹999
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-IN");
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

/**
 * Format day count (Day 3 of 7)
 */
export const formatDayCount = (
  currentDay: number,
  totalDays: number,
): string => {
  return `Day ${currentDay} of ${totalDays}`;
};

/**
 * Get day name from date
 */
export const getDayName = (date: Date | string): string => {
  const d = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
};

/**
 * Get full day name
 */
export const getFullDayName = (date: Date | string): string => {
  const d = new Date(date);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[d.getDay()];
};
