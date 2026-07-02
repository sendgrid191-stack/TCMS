/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden p-6 space-y-5 z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={16} />
            </button>

            {/* Content Section */}
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl shrink-0 h-11 w-11 flex items-center justify-center ${
                isDanger
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                  : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
              }`}>
                {isDanger ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans leading-none">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                }}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition cursor-pointer ${
                  isDanger
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
