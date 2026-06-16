import { useState } from 'react';
import axios from 'axios';
// استيراد الـ Use Case والـ Types بتاعته
import { addPlayer, AddPlayerInput } from '@/application/use-cases/addPlayer';

type ApiErrorResponse = {
  title?: unknown;
  message?: unknown;
  errors?: Record<string, string[] | string>;
};

function getAddPlayerErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return 'An unexpected error occurred';
  }

  const status = err.response?.status;
  const data = err.response?.data as ApiErrorResponse | string | undefined;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    if (data.errors) {
      const messages = Object.entries(data.errors).flatMap(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors)) {
          return fieldErrors.map(message => `${field}: ${message}`);
        }

        return [`${field}: ${fieldErrors}`];
      });

      if (messages.length > 0) {
        return messages.join(', ');
      }
    }

    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data.title === 'string' && data.title.trim()) {
      return data.title;
    }
  }

  if (status === 400) {
    return 'Invalid player data. Please check the required fields.';
  }

  return 'Failed to add player. Please try again.';
}

export function useAddPlayer() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (form: AddPlayerInput): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      // ─── استخدام الـ Use Case هنا ───
      const result = await addPlayer(form);

      if (!result.success) {
        // لو الـ Use Case رجع أخطاء Validation
        setError(result.errors.map(e => e.message).join(', '));
        return false;
      }

      return true;
    } catch (err) {
      // لو حصل خطأ في الشبكة أو السيرفر (Thrown error)
      setError(getAddPlayerErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, error, submit };
}
