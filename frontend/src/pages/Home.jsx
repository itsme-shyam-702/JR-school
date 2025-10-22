import React from 'react';

const backgroundStyle = {
  backgroundImage: `url(${process.env.PUBLIC_URL + '/images/s31.png'})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  width: '100%',
};

const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // dark overlay for contrast
  minHeight: '100vh',
  color: 'white',
};

const Home = () => (
  <div style={backgroundStyle}>
    <div style={overlayStyle}>
      
   
  
    <div className="bg-school-hero bg-cover bg-center min-h-screen">
      {/* Hero Banner */}
      <section className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 text-white text-center px-4">
        <div>
          <h1 className="text-5xl font-bold mb-4">Welcome to </h1>
          <h1 className="text-5xl font-bold mb-4"> Government Junior Technical School</h1>
          <p className="text-xl mb-6">
            Empowering students to thrive with academic excellence and moral values.
          </p>
          <a href="/about">
            <button className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300 font-semibold">
               More
            </button>
          </a>
        </div>
      </section>

     

      

    </div>
    </div>
    </div>
  );

export default Home;


           
              
             
            
   