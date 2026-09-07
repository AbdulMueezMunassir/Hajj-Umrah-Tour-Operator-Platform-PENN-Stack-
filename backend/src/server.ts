import app from './app';  // Remove the .js extension

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MHK Travels Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});