import { useState } from 'react';
// استيراد الـ Use Case والـ Types بتاعته
import { addPlayer, AddPlayerInput } from '@/application/use-cases/addPlayer';

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
      setError('An unexpected error occurred');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, error, submit };
}