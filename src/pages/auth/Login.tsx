import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (!error) navigate('/dashboard'); // Redirect after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-primary-orange rounded-lg text-off-white
                   hover:bg-gradient-to-r from-primary-orange to-terracotta transition-all"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;