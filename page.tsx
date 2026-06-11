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

  const [currentTab, setCurrentTab] =
    useState('dashboard');

  const [students, setStudents] = useState<Student[]>(
    []
  );

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [timetables, setTimetables] =
    useState<Timetable[]>([]);

  const [loading, setLoading] = useState(false);

  const [studentName, setStudentName] =
    useState('');

  const [studentYear, setStudentYear] =
    useState('7');

  const ADMIN_USERNAME = 'stempchase';
  const ADMIN_PASSWORD = 'Hmaw4357';

  async function loadStudents() {
    const snap = await getDocs(
      collection(db, 'students')
    );

    const data: Student[] = snap.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data()
        }) as Student
    );

    setStudents(data);
  }

  async function loadAnnouncements() {
    const snap = await getDocs(
      collection(db, 'announcements')
    );

    const data: Announcement[] = snap.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data()
        }) as Announcement
    );

    setAnnouncements(data);
  }

  async function loadTimetables() {
    const snap = await getDocs(
      collection(db, 'timetables')
    );

    const data: Timetable[] = snap.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data()
        }) as Timetable
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
    if (
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
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
    const student = students.find(
      (s) => s.id === id
    );

    if (!student) return;

    await updateDoc(doc(db, 'students', id), {
      merits: (student.merits || 0) + 1
    });

    await loadStudents();
  }

  async function addDemerit(id: string) {
    const student = students.find(
      (s) => s.id === id
    );

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
          <h1>
            Starlight Management
          </h1>

          <p>
            School Administration Portal
          </p>

          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            style={{
              width: '100%',
              padding: 12,
              marginTop: 20
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            style={{
              width: '100%',
              padding: 12,
              marginTop: 10
            }}
          />

          <button
            onClick={login}
            style={{
              width: '100%',
              padding: 12,
              marginTop: 15,
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f1f5f9'
      }}
    >
      <div
        style={{
          width: 260,
          background: '#0f172a',
          color: 'white',
          padding: 20
        }}
      >
        <h2>Starlight</h2>

        <p
          style={{
            opacity: 0.7,
            marginBottom: 20
          }}
        >
          Management
        </p>

        <button
          onClick={() =>
            setCurrentTab('dashboard')
          }
          style={sidebarButton}
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            setCurrentTab('students')
          }
          style={sidebarButton}
        >
          Students
        </button>

        <button
          onClick={() =>
            setCurrentTab('attendance')
          }
          style={sidebarButton}
        >
          Attendance
        </button>

        <button
          onClick={() =>
            setCurrentTab('merits')
          }
          style={sidebarButton}
        >
          Merits / Demerits
        </button>

        <button
          onClick={() =>
            setCurrentTab('timetable')
          }
          style={sidebarButton}
        >
          Timetables
        </button>

        <button
          onClick={() =>
            setCurrentTab('announcements')
          }
          style={sidebarButton}
        >
          Announcements
        </button>

        <button
          onClick={() =>
            setLoggedIn(false)
          }
          style={{
            ...sidebarButton,
            marginTop: 30
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: 30
        }}
      >
        {loading && (
          <h2>Loading...</h2>
        )}

        {!loading &&
          currentTab ===
            'dashboard' && (
            <>
              <h1>
                Dashboard
              </h1>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(4, 1fr)',
                  gap: 20,
                  marginTop: 20
                }}
              >
                <div
                  style={
                    dashboardCard
                  }
                >
                  <h2>
                    {students.length}
                  </h2>
                  <p>
                    Students
                  </p>
                </div>

                <div
                  style={
                    dashboardCard
                  }
                >
                  <h2>
                    {
                      announcements.length
                    }
                  </h2>
                  <p>
                    Announcements
                  </p>
                </div>

                <div
                  style={
                    dashboardCard
                  }
                >
                  <h2>
                    {
                      timetables.length
                    }
                  </h2>
                  <p>
                    Timetables
                  </p>
                </div>

                <div
                  style={
                    dashboardCard
                  }
                >
                  <h2>
                    {students.reduce(
                      (
                        total,
                        student
                      ) =>
                        total +
                        (student.merits ||
                          0),
                      0
                    )}
                  </h2>
                  <p>
                    Total Merits
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginTop: 30,
                  background:
                    'white',
                  padding: 20,
                  borderRadius: 12
                }}
              >
                <h2>
                  Welcome,
                  stempchase
                </h2>

                <p>
                  School:
                  Starlight
                  Management
                </p>

                <p>
                  Firebase
                  Connected
                </p>
              </div>
            </>
          )}

{!loading &&
          currentTab ===
            'students' && (
            <>
              <h1>
                Student Management
              </h1>

              <div
                style={{
                  background:
                    'white',
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20,
                  marginBottom: 20
                }}
              >
                <h2>
                  Add Student
                </h2>

                <input
                  value={
                    studentName
                  }
                  onChange={(e) =>
                    setStudentName(
                      e.target.value
                    )
                  }
                  placeholder="Student Name"
                  style={{
                    width: '100%',
                    padding: 12,
                    marginTop: 10
                  }}
                />

                <select
                  value={
                    studentYear
                  }
                  onChange={(e) =>
                    setStudentYear(
                      e.target.value
                    )
                  }
                  style={{
                    width: '100%',
                    padding: 12,
                    marginTop: 10
                  }}
                >
                  <option value="7">
                    Year 7
                  </option>
                  <option value="8">
                    Year 8
                  </option>
                  <option value="9">
                    Year 9
                  </option>
                  <option value="10">
                    Year 10
                  </option>
                  <option value="11">
                    Year 11
                  </option>
                  <option value="12">
                    Year 12
                  </option>
                </select>

                <button
                  onClick={
                    addStudent
                  }
                  style={{
                    width: '100%',
                    padding: 12,
                    marginTop: 12,
                    cursor: 'pointer'
                  }}
                >
                  Add Student
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 15
                }}
              >
                {students.map(
                  (
                    student
                  ) => (
                    <div
                      key={
                        student.id
                      }
                      style={{
                        background:
                          'white',
                        borderRadius: 12,
                        padding: 20
                      }}
                    >
                      <h2>
                        {
                          student.name
                        }
                      </h2>

                      <p>
                        Year:{' '}
                        {
                          student.yearLevel
                        }
                      </p>

                      <p>
                        Attendance:{' '}
                        {
                          student.attendance
                        }
                        %
                      </p>

                      <p>
                        Merits:{' '}
                        {
                          student.merits
                        }
                      </p>

                      <p>
                        Demerits:{' '}
                        {
                          student.demerits
                        }
                      </p>

                      <div
                        style={{
                          display:
                            'flex',
                          gap: 10,
                          marginTop: 15,
                          flexWrap:
                            'wrap'
                        }}
                      >
                        <button
                          onClick={() =>
                            addMerit(
                              student.id
                            )
                          }
                        >
                          + Merit
                        </button>

                        <button
                          onClick={() =>
                            addDemerit(
                              student.id
                            )
                          }
                        >
                          + Demerit
                        </button>

                        <button
                          onClick={() =>
                            markPresent(
                              student.id
                            )
                          }
                        >
                          Present
                        </button>

                        <button
                          onClick={() =>
                            markAbsent(
                              student.id
                            )
                          }
                        >
                          Absent
                        </button>

                        <button
                          onClick={() =>
                            removeStudent(
                              student.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        {!loading &&
          currentTab ===
            'attendance' && (
            <>
              <h1>
                Attendance
              </h1>

              <div
                style={{
                  background:
                    'white',
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20
                }}
              >
                <h2>
                  Daily Attendance
                </h2>

                <p>
                  Mark students
                  present or absent.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 15,
                  marginTop: 20
                }}
              >
                {students.map(
                  (
                    student
                  ) => (
                    <div
                      key={
                        student.id
                      }
                      style={{
                        background:
                          'white',
                        padding: 20,
                        borderRadius: 12
                      }}
                    >
                      <h2>
                        {
                          student.name
                        }
                      </h2>

                      <p>
                        Year:{' '}
                        {
                          student.yearLevel
                        }
                      </p>

                      <p>
                        Current
                        Attendance:{' '}
                        {
                          student.attendance
                        }
                        %
                      </p>

                      <div
                        style={{
                          display:
                            'flex',
                          gap: 10,
                          marginTop: 10
                        }}
                      >
                        <button
                          onClick={() =>
                            markPresent(
                              student.id
                            )
                          }
                        >
                          Mark
                          Present
                        </button>

                        <button
                          onClick={() =>
                            markAbsent(
                              student.id
                            )
                          }
                        >
                          Mark
                          Absent
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        {!loading &&
          currentTab ===
            'merits' && (
            <>
              <h1>
                Merits & Demerits
              </h1>

              <div
                style={{
                  display: 'grid',
                  gap: 15,
                  marginTop: 20
                }}
              >
                {students.map(
                  (
                    student
                  ) => (
                    <div
                      key={
                        student.id
                      }
                      style={{
                        background:
                          'white',
                        borderRadius: 12,
                        padding: 20
                      }}
                    >
                      <h2>
                        {
                          student.name
                        }
                      </h2>

                      <p>
                        Year:{' '}
                        {
                          student.yearLevel
                        }
                      </p>

                      <p>
                        Merits:{' '}
                        <strong>
                          {
                            student.merits
                          }
                        </strong>
                      </p>

                      <p>
                        Demerits:{' '}
                        <strong>
                          {
                            student.demerits
                          }
                        </strong>
                      </p>

                      <div
                        style={{
                          display:
                            'flex',
                          gap: 10,
                          marginTop: 15
                        }}
                      >
                        <button
                          onClick={() =>
                            addMerit(
                              student.id
                            )
                          }
                        >
                          Give Merit
                        </button>

                        <button
                          onClick={() =>
                            addDemerit(
                              student.id
                            )
                          }
                        >
                          Give Demerit
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
                  {!loading &&
          currentTab ===
            'timetable' && (
            <>
              <h1>
                Timetables
              </h1>

              <div
                style={{
                  background:
                    'white',
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20
                }}
              >
                <h2>
                  School Timetables
                </h2>

                <p>
                  View all timetable
                  entries stored in
                  Firebase.
                </p>
              </div>

              {timetables.length ===
                0 && (
                <div
                  style={{
                    background:
                      'white',
                    padding: 20,
                    borderRadius: 12,
                    marginTop: 20
                  }}
                >
                  <h3>
                    No Timetables
                    Found
                  </h3>

                  <p>
                    Add timetable
                    documents to the
                    "timetables"
                    Firestore
                    collection.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gap: 15,
                  marginTop: 20
                }}
              >
                {timetables.map(
                  (
                    timetable
                  ) => (
                    <div
                      key={
                        timetable.id
                      }
                      style={{
                        background:
                          'white',
                        borderRadius: 12,
                        padding: 20
                      }}
                    >
                      <h2>
                        {
                          timetable.day
                        }
                      </h2>

                      <div
                        style={{
                          marginTop: 10
                        }}
                      >
                        <p>
                          Period 1:{' '}
                          {
                            timetable.period1
                          }
                        </p>

                        <p>
                          Period 2:{' '}
                          {
                            timetable.period2
                          }
                        </p>

                        <p>
                          Period 3:{' '}
                          {
                            timetable.period3
                          }
                        </p>

                        <p>
                          Period 4:{' '}
                          {
                            timetable.period4
                          }
                        </p>

                        <p>
                          Period 5:{' '}
                          {
                            timetable.period5
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
                  {!loading &&
          currentTab ===
            'announcements' && (
            <>
              <h1>
                Announcements
              </h1>

              <div
                style={{
                  background:
                    'white',
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20
                }}
              >
                <h2>
                  School Notices
                </h2>

                <p>
                  Announcements
                  stored in Firebase
                  will appear here.
                </p>
              </div>

              {announcements.length ===
                0 && (
                <div
                  style={{
                    background:
                      'white',
                    padding: 20,
                    borderRadius: 12,
                    marginTop: 20
                  }}
                >
                  <h3>
                    No Announcements
                  </h3>

                  <p>
                    Create documents
                    inside the
                    announcements
                    collection.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gap: 15,
                  marginTop: 20
                }}
              >
                {announcements.map(
                  (
                    announcement
                  ) => (
                    <div
                      key={
                        announcement.id
                      }
                      style={{
                        background:
                          'white',
                        borderRadius: 12,
                        padding: 20
                      }}
                    >
                      <h2>
                        {
                          announcement.title
                        }
                      </h2>

                      <p
                        style={{
                          marginTop: 10
                        }}
                      >
                        {
                          announcement.message
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

const sidebarButton = {
  width: '100%',
  padding: '12px',
  marginBottom: '10px',
  background: '#1e293b',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
} as const;

const dashboardCard = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'center'
} as const;
