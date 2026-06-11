<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Starlight Management Portal</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; }
    .login-container { min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #0f172a; }
    .login-card { width: 400px; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .main-layout { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #0f172a; color: white; padding: 20px; box-index: 1; }
    .sidebar h2 { margin-top: 0; color: #fff; }
    .sidebar button { display: block; width: 100%; padding: 12px 16px; background: transparent; border: none; color: white; text-align: left; cursor: pointer; font-size: 15px; border-radius: 6px; margin-bottom: 8px; }
    .sidebar button:hover { background: rgba(255,255,255,0.1); }
    .content { flex: 1; padding: 30px; }
    input { width: 100%; padding: 12px; margin-top: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .btn-primary { width: 100%; padding: 12px; margin-top: 15px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .hidden { display: none !important; }
  </style>
</head>
<body>

  <!-- Login Screen -->
  <div id="loginScreen" class="login-container">
    <div class="login-card">
      <h1>Starlight Management</h1>
      <p>School Administration Portal</p>
      <input type="text" id="username" placeholder="Username">
      <input type="password" id="password" placeholder="Password">
      <button class="btn-primary" onclick="login()">Login</button>
    </div>
  </div>

  <!-- App Dashboard Screen -->
  <div id="appScreen" class="main-layout hidden">
    <div class="sidebar">
      <h2>Starlight</h2>
      <p style="opacity: 0.7; margin-bottom: 20px;">Management</p>
      <button onclick="switchTab('dashboard')">Dashboard</button>
      <button onclick="switchTab('students')">Students</button>
      <button onclick="switchTab('attendance')">Attendance</button>
      <button onclick="switchTab('merits')">Merits / Demerits</button>
      <button onclick="switchTab('timetable')">Timetables</button>
      <button onclick="switchTab('announcements')">Announcements</button>
      <button onclick="logout()" style="margin-top: 30px; color: #f87171;">Logout</button>
    </div>
    
    <div class="content">
      <div id="loadingIndicator"><h2>Loading database resources...</h2></div>
      
      <div id="mainContent" class="hidden">
        <h1 id="tabTitle">Dashboard</h1>
        <div id="tabBody">
          <!-- Dynamic panels render inside here -->
          <p>Welcome back to the portal administration control desk.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Firebase Modular Scripts -->
  <script type="module">
    import { initializeApp } from "https://gstatic.com";
    import { getFirestore, collection, getDocs } from "https://gstatic.com";

    const firebaseConfig = {
      apiKey: 'AIzaSyABE1JfwpLLLtrr2gW1_C1Y88A7gm9Tpuw',
      authDomain: '://firebaseapp.com',
      projectId: 'starlight-management',
      storageBucket: 'starlight-management.firebasestorage.app',
      messagingSenderId: '783342937127',
      appId: '1:783342937127:web:d12291f4fae12011ee1a02'
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const ADMIN_USERNAME = 'stempchase';
    const ADMIN_PASSWORD = 'Hmaw4357';

    window.login = function() {
      const userField = document.getElementById('username').value;
      const passField = document.getElementById('password').value;

      if (userField === ADMIN_USERNAME && passField === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        loadData();
      } else {
        alert('Invalid Username or Password');
      }
    }

    window.logout = function() {
      document.getElementById('appScreen').classList.add('hidden');
      document.getElementById('loginScreen').classList.remove('hidden');
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    }

    window.switchTab = function(tabName) {
      document.getElementById('tabTitle').innerText = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      document.getElementById('tabBody').innerHTML = `<p>Viewing the ${tabName} subsystem management workspace.</p>`;
    }

    async function loadData() {
      try {
        document.getElementById('loadingIndicator').classList.remove('hidden');
        document.getElementById('mainContent').classList.add('hidden');
        
        // Parallel data fetch
        await Promise.all([
          getDocs(collection(db, 'students')),
          getDocs(collection(db, 'announcements')),
          getDocs(collection(db, 'timetables'))
        ]);

        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
      } catch (error) {
        console.error("Firebase connection error:", error);
        alert("Could not pull records. Verify your Cloud Firestore Security Rules permit public read/write configurations.");
      }
    }
  </script>
</body>
</html>
