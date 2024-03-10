import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className='flex justify-evenly gap-12 bg-green-700  py-4 text-white' >
       
        <a href="/terms">Terms and Conditions</a>
        <a href="">DevZen Software Solutions Pvt Ltd.<sup>©</sup></a>
        <a href="/privacy">Privacy Policy</a>
       
      </div>
    </footer>
  );
}

export default Footer;
