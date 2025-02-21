import React, { useState } from 'react';
import AccountList from '../components/AccountList';
import AccountForm from '../components/AccountForm';

const Home = () => {
  const [refresh, setRefresh] = useState(false);

  const handleAccountCreation = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <AccountForm onSuccess={handleAccountCreation} />
      <AccountList key={refresh} />
    </div>
  );
};

export default Home;
