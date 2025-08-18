// src/views/EditStudentView.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { ViewType } from '../types';
import '../styles/EditStudentView.css';

type Student = {
  id: number;
  name: string;
  phone: number;
  class: string;
  password: number;
};


type Props = {
  student: Student;
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const EditStudentView: React.FC<Props> = ({ student, setView, setAlertMsg }) => {
  const [form, setForm] = useState(student);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = name === 'phone' || name === 'password';
    setForm({ ...form, [name]: isNumeric ? Number(value) : value });
  };
  

  const handleUpdate = async () => {
    const { error } = await supabase.from('students').update(form).eq('id', student.id);
    if (error) {
      setAlertMsg('Error updating student');
    } else {
      setAlertMsg('Student updated');
      setView('manage-students');
    }
  };

  

  return (
    <div className="edit-student-container" style={{ padding: '2rem' }}>
      <h2>Edit Student</h2>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <br />
      <label>
        Phone:
        <input type="number"  inputMode="numeric"   pattern="[0-9]*"   name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <br />
      
      <label>
  Password:
  <div className="password-field">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      inputMode="numeric" // mobile numeric keyboard
      pattern="[0-9]*"    // HTML pattern for digits only
      value={form.password}
      onChange={(e) => {
        const numericValue = e.target.value.replace(/\D/g, ''); // strip non-numeric
        setForm({ ...form, password: Number(numericValue) });
      }}
    />
    <button
      type="button"
      className="toggle-password"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? '🙈 Hide' : '👁 Show'}
    </button>
  </div>
</label>




<br />
      <label>
        Class:
        <input name="class" value={form.class} onChange={handleChange} />
      </label>
      <br />
      <button onClick={handleUpdate}>💾 Save</button>
      <button onClick={() => setView('manage-students')}>⬅ Cancel</button>
    </div>
  );
};

export default EditStudentView;
