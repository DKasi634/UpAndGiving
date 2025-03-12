import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
  const [itemName, setItemName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      alert('Donation submitted!');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-off-white rounded-lg shadow-md">
      <h2 className="text-2xl font-saira text-terracotta mb-4">Donate Items</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-2 mb-4 border border-terracotta rounded-lg"
        />
        <button
          type="submit"
          className="w-full py-3 bg-primary-orange rounded-lg text-off-white font-poppins 
                     hover:bg-gradient-to-r from-primary-orange to-terracotta transition-all"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default Donate;