'use client';
import React, { useState } from 'react';
import { useAddPlayer } from '@/application/hooks/useAddPlayer';

interface AddPlayerForm {
  firstName:          string;
  lastName:           string;
  athleteID:          string;
  beltId:             string;
  targetSport:        string;
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
  background:   'rgba(255,255,255,0.045)',
  border:       `0.5px solid rgba(255,255,255,0.08)`,
  color:        '#F8FAFC',
  fontSize:     '13px',
  padding:      '9px 12px',
  borderRadius: '13px',
  outline:      'none',
  boxSizing:    'border-box',
  transition:   'border-color .2s',
  boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.06)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<AddPlayerForm>({
    firstName: '', lastName: '', athleteID: '', beltId: '', targetSport: '', birthDate: '',
    weight: '', bloodType: '', bodyFatPercentage: '', profileImage: null,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const { submit, error: hookError, submitting } = useAddPlayer();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, profileImage: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.athleteID.trim() ||
      !form.beltId.trim() ||
      !form.targetSport.trim() ||
      !form.birthDate ||
      !form.weight ||
      !form.bloodType ||
      !form.bodyFatPercentage
    ) {
      setLocalError('Please fill in all required player profile fields.');
      return;
    }

    if (!form.profileImage) {
      setLocalError('Profile image is required.');
      return;
    }

    setLocalError(null);
    const success = await submit({
      name: `${form.firstName} ${form.lastName}`,
      athleteID: form.athleteID,
      beltID: form.beltId,
      targetSport: form.targetSport,
      birthDate: form.birthDate,
      weight: form.weight,
      bloodType: form.bloodType,
      bodyFatPercentage: form.bodyFatPercentage,
      profileImage: form.profileImage,
    });
    if (success) {
      onSuccess();
      onClose();
      setForm({
        firstName: '', lastName: '', athleteID: '', beltId: '', targetSport: '', birthDate: '',
        weight: '', bloodType: '', bodyFatPercentage: '', profileImage: null,
      });
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
        background:      'rgba(5,8,22,0.74)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          200,
        backdropFilter:  'blur(12px) saturate(115%)',
        WebkitBackdropFilter: 'blur(12px) saturate(115%)',
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   'linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.024) 48%), rgba(11,18,32,0.84)',
          border:       `0.5px solid rgba(255,255,255,0.14)`,
          borderRadius: '28px',
          padding:      '26px',
          width:        '420px',
          maxHeight:    '88vh',
          overflowY:    'auto',
          color:        '#F8FAFC',
          boxShadow:    '0 30px 84px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.11)',
          backdropFilter: 'blur(18px) saturate(128%)',
          WebkitBackdropFilter: 'blur(18px) saturate(128%)',
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
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#F8FAFC', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '.04em', lineHeight: 1 }}>
              Add New Player
            </h2>
            <p style={{ margin: '5px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
              Fill in player details to add to squad
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background:   'linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)), rgba(11,18,32,0.62)',
              border:       `0.5px solid rgba(255,255,255,0.08)`,
              color:        'rgba(255,255,255,0.45)',
              width:        '28px',
              height:       '28px',
              borderRadius: '12px',
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent:'center',
              fontSize:     '14px',
              boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 26px rgba(0,0,0,0.18)',
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
                <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                  {field === 'firstName' ? 'First Name *' : 'Last Name *'}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'firstName' ? 'Ahmed' : 'Hassan'}
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                  onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            ))}
          </div>

          {/* Athlete + Belt IDs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Athlete ID *
              </label>
              <input
                type="text"
                name="athleteID"
                value={form.athleteID}
                onChange={handleChange}
                placeholder="e.g., ATH_A001"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Belt ID *
              </label>
              <input
                type="text"
                name="beltId"
                value={form.beltId}
                onChange={handleChange}
                placeholder="e.g., BELT_A001"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Profile image */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
              Profile Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              required
              style={{ ...inputStyle, padding: '7px 12px', cursor: 'pointer' }}
            />
          </div>

          {/* Sport + Birth date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Target Sport *
              </label>
              <input
                type="text"
                name="targetSport"
                value={form.targetSport}
                onChange={handleChange}
                placeholder="Football"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Birth Date *
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                required
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Weight + Blood type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Weight (kg) *
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="75"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
                onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
                Blood Type *
              </label>
              <select
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select...</option>
                {BLOOD_TYPES.map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Body fat */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '5px' }}>
              Body Fat % *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              name="bodyFatPercentage"
              value={form.bodyFatPercentage}
              onChange={handleChange}
              placeholder="12.5"
              required
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(204,255,0,0.26)'}
              onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Error Display */}
          {(localError || hookError) && (
            <div style={{
              background:   'rgba(255,90,95,0.07)',
              border:       `0.5px solid rgba(255,90,95,0.18)`,
              borderRadius: '13px',
              padding:      '8px 12px',
              fontSize:     '12px',
              color:        '#FF5A5F',
              boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              {localError || hookError}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width:         '100%',
              background:    submitting
                ? 'linear-gradient(180deg, rgba(204,255,0,0.08), rgba(204,255,0,0.03)), rgba(11,18,32,0.68)'
                : 'linear-gradient(180deg, rgba(204,255,0,0.12), rgba(204,255,0,0.045)), rgba(11,18,32,0.68)',
              border:        '0.5px solid rgba(204,255,0,0.22)',
              color:         '#CCFF00',
              fontSize:      '13px',
              fontWeight:    '700',
              padding:       '11px',
              borderRadius:  '13px',
              cursor:        submitting ? 'not-allowed' : 'pointer',
              letterSpacing: '.05em',
              marginTop:     '4px',
              transition:    'background .2s',
              boxShadow:     'inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18), 0 0 12px rgba(204,255,0,0.05)',
            }}
          >
            {submitting ? 'Adding Player...' : '+ Add Player to Squad'}
          </button>
        </div>
      </div>
    </div>
  );
};
