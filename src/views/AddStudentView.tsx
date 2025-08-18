// src/views/AddStudentView.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { ViewType } from '../types';
import '../styles/EditStudentView.css'; // reuse styling

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const AddStudentView: React.FC<Props> = ({ setView, setAlertMsg }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    class: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = name === 'phone' || name === 'password';
    setForm({ ...form, [name]: isNumeric ? Number(value) : value });
  };
  

  const handleAdd = async () => {
    if (!form.name.trim()) {
      setAlertMsg('Please fill in Name');
      return;
    } else if (!form.phone.trim()) {
      setAlertMsg('Please fill in Phone');
      return;
    } else if (!form.password.trim()) {
      setAlertMsg('Please fill in Password');
      return;
    }
  
    const payload = {
      ...form,
      phone: Number(form.phone),
      password: Number(form.password),
    };
  
    const { error } = await supabase.from('students').insert([payload]);
    if (error) {
      setAlertMsg('Error adding student');
    } else {
      setAlertMsg('Student added');
      setView('manage-students');
    }
  };
  

  return (
    <div className="edit-student-container">
      <h2>Add New Student</h2>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input name="phone"  inputMode="numeric"   pattern="[0-9]*"   type="number" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="number"  inputMode="numeric"   pattern="[0-9]*"   name="password" value={form.password} onChange={handleChange} />
      </label>
      <label>
        Class:
        <input name="class" value={form.class} onChange={handleChange} />
      </label>
      <button onClick={handleAdd}>➕ Add</button>
      <button onClick={() => setView('manage-students')}>⬅ Cancel</button>
    </div>
  );
};

export default AddStudentView;
