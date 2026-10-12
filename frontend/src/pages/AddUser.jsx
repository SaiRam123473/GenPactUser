import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage, usersApi } from '../services/api.js';

const initialValues = { name: '', age: '', city: '', state: '', pincode: '' };
function validate(values) {
  const errors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Name is required.';
  else if (name.length < 2 || name.length > 100) errors.name = 'Name must be between 2 and 100 characters.';
  if (values.age === '') errors.age = 'Age is required.';
  else if (!Number.isInteger(Number(values.age)) || Number(values.age) < 0 || Number(values.age) > 120) errors.age = 'Age must be a whole number from 0 to 120.';
  if (!values.city.trim()) errors.city = 'City is required.';
  if (!values.state.trim()) errors.state = 'State is required.';
  const pincode = values.pincode.trim();
  if (!pincode) errors.pincode = 'Pincode is required.';
  else if (pincode.length < 4 || pincode.length > 10) errors.pincode = 'Pincode must be between 4 and 10 characters.';
  return errors;
}

export default function AddUser({ onCreated }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function update(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setApiError('');
  }

  async function submit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setSaving(true); setApiError('');
    try {
      await usersApi.create({ ...values, name: values.name.trim(), age: Number(values.age), city: values.city.trim(), state: values.state.trim(), pincode: values.pincode.trim() });
      onCreated('User added successfully.');
      navigate('/');
    } catch (error) { setApiError(getErrorMessage(error)); }
    finally { setSaving(false); }
  }

  return <section className="form-page"><div className="breadcrumbs"><Link to="/">Users</Link><span>/</span><span>Add user</span></div>
    <div className="page-heading compact"><div><p className="eyebrow">NEW RECORD</p><h1>Add user</h1><p className="subtitle">Enter the details below to add someone to the directory.</p></div></div>
    <div className="panel form-panel"><div className="panel-header"><div><h2>User information</h2><p>Fields marked with <span className="required">*</span> are required.</p></div></div>
      <form onSubmit={submit} noValidate>
        {apiError && <div className="alert danger" role="alert">{apiError}</div>}
        <div className="form-grid">
          <Field label="Full name" name="name" value={values.name} onChange={update} error={errors.name} placeholder="e.g. Priya Sharma" required maxLength={100} autoComplete="name" />
          <Field label="Age" name="age" value={values.age} onChange={update} error={errors.age} placeholder="e.g. 28" required type="number" min="0" max="120" />
          <Field label="City" name="city" value={values.city} onChange={update} error={errors.city} placeholder="e.g. Hyderabad" required autoComplete="address-level2" />
          <Field label="State" name="state" value={values.state} onChange={update} error={errors.state} placeholder="e.g. Telangana" required autoComplete="address-level1" />
          <Field label="Pincode" name="pincode" value={values.pincode} onChange={update} error={errors.pincode} placeholder="e.g. 500001" required maxLength={10} autoComplete="postal-code" />
        </div>
        <div className="form-actions"><Link to="/" className="button secondary">Cancel</Link><button type="submit" className="button primary" disabled={saving}>{saving && <span className="button-spinner"/>}{saving ? 'Saving…' : 'Save user'}</button></div>
      </form>
    </div>
  </section>;
}

function Field({ label, name, value, onChange, error, required, ...props }) {
  const id = `field-${name}`;
  return <div className="field"><label htmlFor={id}>{label}{required && <span className="required"> *</span>}</label><input id={id} name={name} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} required={required} className={error ? 'input-error' : ''} {...props}/>{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>;
}
