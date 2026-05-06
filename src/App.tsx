/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MapSection from './components/MapSection';
import ReportForm from './components/ReportForm';
import ActivitySection from './components/ActivitySection';
import Statistics from './components/Statistics';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import Profile from './components/Profile';
import { motion, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <Navbar onNavigate={setCurrentView} currentView={currentView} />
      
      <main>
        {currentView === 'home' ? (
          <>
            <Hero />
            <Statistics />
            <MapSection />
            <ReportForm />
            <ActivitySection />
            <AboutSection />
          </>
        ) : (
          <Profile />
        )}
      </main>

      <Footer />
    </div>
  );
}

