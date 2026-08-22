import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';

export const ContactForm: React.FC = () => {
  const { submitInquiry } = useSite();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('sending');
    setErrorMsg('');

    try {
      const res = await submitInquiry(formData);
      if (res.ok) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          budget: '',
          message: '',
        });
        setState('sent');
      } else {
        setErrorMsg(res.error || 'Failed to send message.');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again or message via WhatsApp.');
      setState('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email address"
        />
      </div>
      <div>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone / WhatsApp"
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company / brand"
        />
      </div>
      <div>
        <input
          name="service"
          value={formData.service}
          onChange={handleChange}
          placeholder="Service needed (e.g. Branding)"
        />
        <input
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Estimated budget (LKR / USD)"
        />
      </div>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={5}
        placeholder="Tell us about the project, goals, timeline, and deliverables."
      />
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message ↗'}
      </button>
      {state === 'sent' && (
        <p className="form-success">
          Thank you. Your message has been sent. We&apos;ll get back to you within 24 hours.
        </p>
      )}
      {state === 'error' && <p className="form-error">{errorMsg}</p>}
    </form>
  );
};
