import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SpeedIcon from '@mui/icons-material/Speed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

const AnimatedSphere = ({ color, distort, speed, scale, position }) => {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} visible args={[1, 100, 200]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const BackgroundScene = () => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <AnimatedSphere color={theme.palette.primary.main} distort={0.4} speed={2} scale={1.8} position={[-3, 1, -2]} />
        <AnimatedSphere color={theme.palette.secondary.main} distort={0.5} speed={1.5} scale={1.2} position={[3, -1, -3]} />
        <AnimatedSphere color="#ffffff" distort={0.3} speed={3} scale={0.8} position={[1, 2, -4]} />
        <Environment preset="city" />
      </Canvas>
    </Box>
  );
};

const Home = () => {
  const features = [
    { icon: <LinkIcon fontSize="large" />, title: 'Paste URL', desc: 'Copy link direct from BookMyShow' },
    { icon: <SpeedIcon fontSize="large" />, title: 'Real-time Checks', desc: 'Automated pings every 60 Seconds' },
    { icon: <NotificationsActiveIcon fontSize="large" />, title: 'Instant Alerts', desc: 'Email notification the moment tickets drop' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const rightItemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <BackgroundScene />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 2 } }}>
        <Grid container spacing={6} alignItems="center">

          {/* Left Column: Hero Text */}
          <Grid item xs={12} md={6}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Never Miss <span className="highlight" style={{ WebkitTextFillColor: 'initial', background: 'transparent' }}>a Match.</span>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6, maxWidth: '85%' }}>
                  Automated ticket monitoring for your favorite <span className="highlight">cricket matches</span> and events. We actively monitor availability so you don't have to keep refreshing.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                  <Button
                    component={Link}
                    to="/add-monitor"
                    variant="contained"
                    color="primary"
                    size="medium"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ py: 1.5, px: 4, mb: 4, borderRadius: 3, fontWeight: 700, boxShadow: '0 4px 15px rgba(25,118,210,0.3)' }}
                  >
                    Create Ticket Setup
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                  }}
                >
                  {/* <HelpOutlineIcon color="primary" sx={{ mt: 0.5 }} /> */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>How it works</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Submit your BookMyShow event URL. We run background checks continuously. The moment tickets drop or cancellations occur, we instantly dispatch an alert to your email, ensuring you're first to book.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Column: Features Stack */}
          <Grid item xs={12} md={6}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Box sx={{ display: 'flex', flexDirection: '', gap: 3 }}>
                {features.map((feature, index) => (
                  <motion.div key={index} variants={rightItemVariants} whileHover={{ x: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        borderRadius: 4,
                        backdropFilter: 'blur(10px)',
                        background: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      <Box sx={{
                        display: 'flex',
                        p: 2,
                        borderRadius: '50%',
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(25,118,210,0.3)'
                      }}>
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.desc}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
