// utils/corsOption.js
module.exports = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://amazona-ecommerce-rho.vercel.app/",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};
