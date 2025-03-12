import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-off-white">
      <h1 className="text-4xl font-saira text-terracotta mb-6">Welcome to UpAndGiving</h1>
      <p className="text-off-black font-poppins mb-8">Turn idle goods into impact.</p>
      <Link
        to="/login"
        className="px-6 py-3 bg-primary-orange rounded-lg text-off-white 
                   hover:bg-gradient-to-r from-primary-orange to-terracotta transition-all"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;