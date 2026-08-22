import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

// 1. Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className={`inline-block animate-spin rounded-full border-solid border-brand-500 border-r-transparent ${sizeClasses[size] || sizeClasses.md} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// 2. Skeleton Loader
export const SkeletonLoader = ({ className = 'h-12 w-full', count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`} />
      ))}
    </div>
  );
};

// 3. Alert Banner
export const AlertBanner = ({ type = 'info', title, message, onClose }) => {
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 icon:CheckCircle',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300 icon:AlertOctagon',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300 icon:AlertTriangle',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-300 icon:Info',
  };

  const IconComponent = {
    success: CheckCircle,
    error: AlertOctagon,
    warning: AlertTriangle,
    info: Info,
  }[type] || Info;

  return (
    <div className={`flex items-start p-4 rounded-xl border ${styles[type] || styles.info} my-3 justify-between transition-all`}>
      <div className="flex items-start space-x-3">
        <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          {title && <h4 className="font-semibold text-sm">{title}</h4>}
          {message && <p className="text-xs opacity-90">{message}</p>}
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 p-1">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// 4. Modal Dialog
export const ModalDialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// 5. Badge
export const Badge = ({ children, variant = 'brand', className = '' }) => {
  const variants = {
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.brand} ${className}`}>
      {children}
    </span>
  );
};

// 6. Button
export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-brand-500';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-ocean-500 text-white hover:opacity-95 shadow-lg shadow-brand-500/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
    outline: 'border border-brand-500/50 text-brand-400 hover:bg-brand-500/10',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <LoadingSpinner size="sm" className="mr-2 border-white border-r-transparent" />}
      {children}
    </button>
  );
};

// 7. Card
export const Card = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`glass-card rounded-2xl p-6 border border-slate-800/80 ${onClick ? 'cursor-pointer hover:border-brand-500/40' : ''} ${className}`}>
      {children}
    </div>
  );
};

// 8. StatCard
export const StatCard = ({ title, value, icon: Icon, trend, color = 'brand' }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
          {trend && <span className="text-xs text-brand-400 font-medium mt-1 inline-block">{trend}</span>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

// 9. Pagination
export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <Button variant="secondary" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        Prev
      </Button>
      <span className="text-xs text-slate-400 px-3">
        Page <span className="text-white font-semibold">{currentPage}</span> of {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </Button>
    </div>
  );
};

// 10. Tooltip
export const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2.5 py-1 text-xs text-slate-100 bg-slate-900 border border-slate-700 rounded shadow-xl whitespace-nowrap z-30">
        {text}
      </div>
    </div>
  );
};

// 11. Input Component
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5 my-2">
      {label && <label className="block text-xs font-semibold text-slate-300">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
          error ? 'border-rose-500/80' : 'border-slate-800 hover:border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};

// 12. Select Component
export const Select = ({ label, options = [], error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5 my-2">
      {label && <label className="block text-xs font-semibold text-slate-300">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
          error ? 'border-rose-500/80' : 'border-slate-800 hover:border-slate-700'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
