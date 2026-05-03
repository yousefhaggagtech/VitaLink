'use client';
import React, { useState, useEffect } from 'react';
import { colors, radius } from '@/styles/tokens/colors';
import axiosInstance from '@/lib/axiosInstance';

interface Belt { DeviceID: string; }

interface AddPlayerForm {
  firstName:          string;
  lastName:           string;
  beltId:             string;
  birthDate:          string;
  weight:             string;
  bloodType:          string;
  bodyFatPercentage:  string;
  profileImage:       File | null;
}

interface AddPlayerModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onSuccess: () => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const inputStyle: React.CSSProperties = {
  width:        '100%',
  background:   colors.bgInput,
  border:       `1px solid ${colors.border}`,
  color:        colors.text,
  fontSize:     '13px',
  padding:      '9px 12px',
  borderRadius: radius.md,
  outline:      'none',
  boxSizing:    'border-box',
  transition:   'border-color .2s',
};

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm]         = useState<AddPlayerForm>({
    firstName: '', lastName: '', beltId: '', birthDate: '',
    weight: '', bloodType: '', bodyFatPercentage: '', profileImage: null,
  });
  const [belts, setBelts]       = useState<Belt[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Fetch available belts when modal opens
  useEffect(() => {
    if (!isOpen) return;
    axiosInstance.get('/api/devices/available')
      .then(res => setBelts(res.data))
      .catch(() => setBelts([]));
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, profileImage: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName) {
      setError('First and last name are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('firstName',         form.firstName);
      body.append('lastName',          form.lastName);
      if (form.beltId)             body.append('beltId',            form.beltId);
      if (form.birthDate)          body.append('birthDate',         form.birthDate);
      if (form.weight)             body.append('weight',            form.weight);
      if (form.bloodType)          body.append('bloodType',         form.bloodType);
      if (form.bodyFatPercentage)  body.append('bodyFatPercentage', form.bodyFatPercentage);
      if (form.profileImage)       body.append('profileImage',      form.profileImage);

      await axiosInstance.post('/api/athletes', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess();
      onClose();
    } catch {
      setError('Failed to add player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        background:      'rgba(0,0,0,0.75)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          200,
        backdropFilter:  'blur(4px)',
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   colors.bgCard,
          border:       `1px solid ${colors.limeBorder}`,
          borderRadius: radius.xl,
          padding:      '26px',
          width:        '420px',
          maxHeight:    '88vh',
          overflowY:    'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          marginBottom:  '22px',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: colors.text }}>
              Add New Player
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: colors.textMuted }}>
              Fill in player details to add to squad
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background:   'transparent',
              border:       `1px solid ${colors.border}`,
              color:        colors.textSecondary,
              width:        '28px',
              height:       '28px',
              borderRadius: radius.md,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent:'center',
              fontSize:     '14px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(['firstName', 'lastName'] as const).map(field => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                  {field === 'firstName' ? 'First Name *' : 'Last Name *'}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'firstName' ? 'Ahmed' : 'Hassan'}
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = colors.limeBorder}
                  onBlur={e  => e.currentTarget.style.borderColor = colors.border}
                />
              </div>
            ))}
          </div>

          {/* Belt dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
              Assign Belt <span style={{ color: colors.textMuted }}>(optional)</span>
            </label>
            <select
              name="beltId"
              value={form.beltId}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">No belt — assign later</option>
              {belts.map(b => (
                <option key={b.DeviceID} value={b.DeviceID}>
                  {b.DeviceID}
                </option>
              ))}
            </select>
          </div>

          {/* Profile image */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
              Profile Image <span style={{ color: colors.textMuted }}>(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ ...inputStyle, padding: '7px 12px', cursor: 'pointer' }}
            />
          </div>

          {/* Birth date + Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = colors.limeBorder}
                onBlur={e  => e.currentTarget.style.borderColor = colors.border}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="75"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = colors.limeBorder}
                onBlur={e  => e.currentTarget.style.borderColor = colors.border}
              />
            </div>
          </div>

          {/* Blood type + Body fat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Blood Type
              </label>
              <select
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select...</option>
                {BLOOD_TYPES.map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Body Fat %
              </label>
              <input
                type="number"
                step="0.1"
                name="bodyFatPercentage"
                value={form.bodyFatPercentage}
                onChange={handleChange}
                placeholder="12.5"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = colors.limeBorder}
                onBlur={e  => e.currentTarget.style.borderColor = colors.border}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:   colors.criticalBg,
              border:       `1px solid ${colors.criticalBorder}`,
              borderRadius: radius.md,
              padding:      '8px 12px',
              fontSize:     '12px',
              color:        colors.critical,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:         '100%',
              background:    loading ? `${colors.lime}80` : colors.lime,
              border:        'none',
              color:         '#000',
              fontSize:      '13px',
              fontWeight:    '700',
              padding:       '11px',
              borderRadius:  radius.md,
              cursor:        loading ? 'not-allowed' : 'pointer',
              letterSpacing: '.05em',
              marginTop:     '4px',
              transition:    'background .2s',
            }}
          >
            {loading ? 'Adding Player...' : '+ Add Player to Squad'}
          </button>
        </div>
      </div>
    </div>
  );
};