import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Cấu hình Firebase của Nhóm 14
const firebaseConfig = {
  apiKey: "AIzaSyBCmFnGR9x3UGNuF_15reFnXxKYRgyifB0",
  authDomain: "nhom14-auth.firebaseapp.com",
  projectId: "nhom14-auth",
  storageBucket: "nhom14-auth.firebasestorage.app",
  messagingSenderId: "648445857912",
  appId: "1:648445857912:web:791afc8f2b564e5766dd8d",
  measurementId: "G-305H6W71MH"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSocialLogin = async (provider) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg("Email này đã được dùng để đăng nhập bằng phương thức khác.");
      } else {
        setErrorMsg("Đăng nhập thất bại: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      setErrorMsg("Đăng xuất thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="container" style={{ maxWidth: '750px' }}>
        {!user ? (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 fw-bold">Đăng nhập hệ thống</h4>
            </div>
            <div className="card-body p-4 text-center">
              {errorMsg && (
                <div className="alert alert-danger text-start" role="alert">
                  {errorMsg}
                </div>
              )}
              <h5 className="mb-2 fw-bold text-dark">Chào mừng bạn</h5>
              <p className="text-muted mb-4">
                Đăng nhập bằng tài khoản Gmail hoặc GitHub để tiếp tục.
              </p>

              <div className="d-grid gap-3 col-md-8 mx-auto">
                <button
                  onClick={() => handleSocialLogin(googleProvider)}
                  className="btn btn-danger btn-lg fw-semibold shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Gmail (Google)'}
                </button>
                <button
                  onClick={() => handleSocialLogin(githubProvider)}
                  className="btn btn-dark btn-lg fw-semibold shadow-sm"
                  disabled={isLoading}
                >
                  Đăng nhập bằng GitHub
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white py-3">
                <h4 className="mb-0 fw-bold">Trang chủ - Thông tin Nhóm 14</h4>
              </div>
              <div className="card-body p-4">
                <h5 className="text-primary fw-bold mb-3">Thông tin thành viên</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <span><strong>1. Huỳnh Nhật Ký</strong> (Thành viên tham gia)</span>
                    <span className="badge bg-primary rounded-pill">DH52200965</span>
                  </li>
                  <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <span><strong>2. Nguyễn Ái Phương Thảo</strong> (Thành viên tham gia)</span>
                    <span className="badge bg-primary rounded-pill">DH52201474</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body p-4 text-center">
                {errorMsg && (
                  <div className="alert alert-danger text-start" role="alert">
                    {errorMsg}
                  </div>
                )}
                <span className="badge bg-success mb-3 px-3 py-2">Đăng nhập thành công</span>
                <div className="mb-3">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/100'}
                    alt="Avatar"
                    className="rounded-circle shadow"
                    width="90"
                    height="90"
                  />
                </div>
                <h4 className="fw-bold mb-1">{user.displayName || 'Người dùng'}</h4>
                <p className="text-muted mb-2">{user.email || 'Tài khoản ẩn email công khai'}</p>
                <p className="small text-secondary mb-4">
                  <strong>Đăng nhập qua:</strong> {user.providerData[0]?.providerId}
                </p>
                <button onClick={handleLogout} className="btn btn-outline-danger px-4" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đăng xuất'}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;