'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

// Note: Move these configuration details to .env.local variables for real-world deployment safety
const firebaseConfig = {
  apiKey: 'AIzaSyABE1JfwpLLLtrr2gW1_C1Y88A7gm9Tpuw',
  authDomain: 'starlight-management.firebaseapp.com',
  projectId: 'starlight-management',
  storageBucket: 'starlight-management.firebasestorage.app',
  messagingSenderId: '783342937127',
  appId: '1:783342937127:web:d12291f4fae12011ee1a02'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sidebar Button CSS Style Definition
const sidebarButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  color: 'white',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '15px',
  borderRadius: '6px',
  marginBottom: '8px'
};

type Student = {
  id: string;
  name: string;
  yearLevel: string;
  attendance: number;
  merits: number;
  demerits: number;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
};

type Timetable = {
  id: string;
  day: string;
  period1: string;
  period2: string;
  period3: string;
  period4: string;
  period5: string;
};

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentYear, setStudentYear] = useState('7');

  const ADMIN_USERNAME = 'stempchase';
  const ADMIN_PASSWORD = 'Hmaw4357';

  async function loadStudents() {
    const snap = await getDocs(collection(db, 'students'));
    const data: Student[] = snap.docs.map(
      (document) => ({ id: document.id, ...document.data() } as Student)
    );
    setStudents(data);
  }

  async function loadAnnouncements() {
    const snap = await getDocs(collection(db, 'announcements'));
    const data: Announcement[] = snap.docs.map(
      (document) => ({ id: document.id, ...document.data() } as Announcement)
    );
    setAnnouncements(data);
  }

  async function loadTimetables() {
    const snap = await getDocs(collection(db, 'timetables'));
    const data: Timetable[] = snap.docs.map(
      (document) => ({ id: document.id, ...document.data() } as Timetable)
    );
    setTimetables(data);
  }

  async function loadEverything() {
    setLoading(true);
    await Promise.all([
      loadStudents(),
      loadAnnouncements(),
      loadTimetables()
    ]);
    setLoading(false);
  }

  useEffect(() => {
    if (loggedIn) {
      loadEverything();
    }
  }, [loggedIn]);

  function login() {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      return;
    }
    alert('Invalid Username or Password');
  }

  async function addStudent() {
    if (!studentName) return;
    await addDoc(collection(db, 'students'), {
      name: studentName,
      yearLevel: studentYear,
      attendance: 100,
      merits: 0,
      demerits: 0,
      createdAt: serverTimestamp()
    });
    setStudentName('');
    await loadStudents();
  }

  async function removeStudent(id: string) {
    await deleteDoc(doc(db, 'students', id));
    await loadStudents();
  }

  async function addMerit(id: string) {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    await updateDoc(doc(db, 'students', id), {
      merits: (student.merits || 0) + 1
    });
    await loadStudents();
  }

  async function addDemerit(id: string) {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    await updateDoc(doc(db, 'students', id), {
      demerits: (student.demerits || 0) + 1
    });
    await loadStudents();
  }

  async function markPresent(id: string) {
    await updateDoc(doc(db, 'students', id), {
      attendance: 100
    });
    await loadStudents();
  }

  async function markAbsent(id: string) {
    await updateDoc(doc(db, 'students', id), {
      attendance: 0
    });
    await loadStudents();
  }

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0f172a'
        }}
      >
        <div
          style={{
            width: 450,
            background: 'white',
            borderRadius: 12,
            padding: 30
          }}
        >
          <h1>Starlight Management</h1>
          <p>School Administration Portal</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ width: '100%', padding: 12, marginTop: 20 }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: 12, marginTop: 10 }}
          />
          <button
            onClick={login}
            style={{ width: '100%', padding: 12, marginTop: 15, cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <div style={{ width: 260, background: '#0f172a', color: 'white', padding: 20 }}>
        <h2>Starlight</h2>
        <p style={{ opacity: 0.7, marginBottom: 20 }}>Management</p>

        <button onClick={() => setCurrentTab('dashboard')} style={sidebarButtonStyle}>
          Dashboard
        </button>
        <button onClick={() => setCurrentTab('students')} style={sidebarButtonStyle}>
          Students
        </button>
        <button onClick={() => setCurrentTab('attendance')} style={sidebarButtonStyle}>
          Attendance
        </button>
        <button onClick={() => setCurrentTab('merits')} style={sidebarButtonStyle}>
          Merits / Demerits
        </button>
        <button onClick={() => setCurrentTab('timetable')} style={sidebarButtonStyle}>
          Timetables
        </button>
        <button onClick={() => setCurrentTab('announcements')} style={sidebarButtonStyle}>
          Announcements
        </button>
        <button
          onClick={() => setLoggedIn(false)}
          style={{ ...sidebarButtonStyle, marginTop: 30 }}
        >
          Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        {loading && <h2>Loading...</h2>}

        {!loading && currentTab === 'dashboard' && (
          <>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 20 }}>
              {/* Dashboard Content Renders Here */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
