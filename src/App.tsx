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
import { motion, useScroll, useSpring } from 'motion/react';

export default function App() {
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
      
      <Navbar />
      
      <main>
        <Hero />
        <Statistics />
        <MapSection />
        <ReportForm />
        <ActivitySection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}

