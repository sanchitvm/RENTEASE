import React, { useEffect, useRef } from 'react';
import Nav from './Components/Navbar/Nav.jsx';
import Routing from './utils/Routing.jsx';
import Lenis from 'lenis';


const App = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, [scrollContainerRef]);

  return (
    <div ref={scrollContainerRef}>
      <Nav />
      <Routing />
    </div>
  );
};

export default App;
