import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  // React DatePicker 样式

// 从 date-fns 导入中/英文 locale
import { enUS } from 'date-fns/locale/en-US';
import { zhCN } from 'date-fns/locale/zh-CN';
import { Language } from '@/types/language';

interface ReactDatePickerProps {
  value: string;                     // "YYYY-MM-DD" 或 ''  
  onChange: (newVal: string) => void; 
  language: Language; 
}

const ReactDatePickerWrapper: React.FC<ReactDatePickerProps> = ({
  value,
  onChange,
  language
}) => {
  // 先注册 locale, 一般只需要注册一次即可
  // 我们可以放在组件顶层, 这样每次渲染时都会确保 locale 已注册
  useEffect(() => {
    registerLocale('en', enUS);
    registerLocale('zh', zhCN);
  }, []);

  // 根据 language 决定传给 DatePicker 的 locale 字符串
  const currentLocale = language === 'zh' ? 'zh' : 'en';

  // 内部用 Date 类型表示
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 计算当前年份以及 1900 到当前年份之间的年数
  const currentYear = new Date().getFullYear();
  const yearRange = currentYear - 1900 + 1; // 包含 1900 和 currentYear 自身

  // 如果父组件传过来了初始字符串, 就在这里把它解析成 Date 对象
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      setSelectedDate(dt);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // 当用户在日历上选了一个日期时, onChange 回调会传一个 Date
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // 格式化成 YYYY-MM-DD
      const year  = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day   = date.getDate().toString().padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      showYearDropdown
      // 一次在下拉里展示从 1900 到当前年的所有年份
      yearDropdownItemNumber={yearRange}
      scrollableYearDropdown
      // 限定最小可选日期和最大可选日期
      minDate={new Date(1900, 0, 1)}  // 1900-01-01
      maxDate={new Date()}            // 今天
      placeholderText="YYYY-MM-DD"
      className="border rounded px-2 py-1 w-full"
      locale={currentLocale}          // 根据 language 传入不同 locale
    />
  );
};

export default ReactDatePickerWrapper;
